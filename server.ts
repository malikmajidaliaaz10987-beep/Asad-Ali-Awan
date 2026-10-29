import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateChatResponse, ChatMessage, extractSafeErrorMessage, getSmartFallbackReply } from './server/geminiService';
import { sendContactEmail } from './server/emailService';
import { recordUserSignIn, verifyAdminAccess, getRegisteredUsers, AUTHORIZED_ADMIN_EMAIL } from './server/userService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json());

const PUBLIC_DIR = path.resolve(__dirname, 'public');
app.use(express.static(PUBLIC_DIR));

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').sendFile(path.join(PUBLIC_DIR, 'robots.txt'));
});

app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml').sendFile(path.join(PUBLIC_DIR, 'sitemap.xml'));
});

// In-Memory IP Rate Limiter
interface RateBucket {
  count: number;
  resetAt: number;
}
const chatBuckets = new Map<string, RateBucket>();
const emailBuckets = new Map<string, RateBucket>();

function checkRateLimit(map: Map<string, RateBucket>, ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = map.get(ip);
  if (!record || now > record.resetAt) {
    map.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count++;
  return true;
}

// Chat API endpoint using Google Gemini API
app.post('/api/chat', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(chatBuckets, clientIp, 35, 60 * 1000)) {
    res.status(429).json({ error: 'Rate limit reached. Please wait a moment before sending another prompt.' });
    return;
  }

  try {
    const { messages } = req.body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const reply = await generateChatResponse(messages);
    res.json({ reply });
  } catch (error: any) {
    const safeMsg = extractSafeErrorMessage(error);
    console.info('[Server Chat Notice]:', safeMsg);
    const msgs = (req.body as any)?.messages || [];
    res.json({
      reply: getSmartFallbackReply(Array.isArray(msgs) ? msgs : []),
    });
  }
});

// Also support /.netlify/functions/chat path for full parity in dev/local environments
app.post('/.netlify/functions/chat', async (req, res) => {
  try {
    const { messages } = req.body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const reply = await generateChatResponse(messages);
    res.json({ reply });
  } catch (error: any) {
    const safeMsg = extractSafeErrorMessage(error);
    console.info('[Netlify Route Notice]:', safeMsg);
    const msgs = (req.body as any)?.messages || [];
    res.json({
      reply: getSmartFallbackReply(Array.isArray(msgs) ? msgs : []),
    });
  }
});

// Leads API endpoint for persistent lead storage
const DATA_DIR = path.resolve(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

app.post('/api/leads', (req, res) => {
  try {
    const lead = req.body;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let existingLeads = [];
    if (fs.existsSync(LEADS_FILE)) {
      try {
        existingLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
      } catch {
        existingLeads = [];
      }
    }

    existingLeads.unshift({
      ...lead,
      savedAt: new Date().toISOString(),
    });

    fs.writeFileSync(LEADS_FILE, JSON.stringify(existingLeads, null, 2), 'utf-8');
    res.status(201).json({ success: true, message: 'Lead saved successfully.' });
  } catch (err: any) {
    console.error('Error saving lead:', err);
    res.status(500).json({ error: 'Failed to save lead.' });
  }
});

app.get('/api/leads', (req, res) => {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  } catch {
    res.json([]);
  }
});

// Direct Contact / Email Dispatch API
app.post('/api/send-email', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(emailBuckets, clientIp, 8, 60 * 1000)) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment before submitting again or reach out on WhatsApp.' });
    return;
  }

  try {
    const { name, email, subject, message, hp } = req.body || {};

    // Spam honeypot detection
    if (hp) {
      res.json({ success: true, message: 'Your message has been processed.' });
      return;
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Please enter your name.' });
      return;
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      res.status(400).json({ error: 'Please enter a message subject.' });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      res.status(400).json({ error: 'Please enter a message (minimum 5 characters).' });
      return;
    }

    // Save copy to lead vault
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      let existingLeads = [];
      if (fs.existsSync(LEADS_FILE)) {
        try { existingLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8')); } catch { existingLeads = []; }
      }
      existingLeads.unshift({
        fullName: name.trim(),
        email: email.trim(),
        service: 'Direct Email Inquiry',
        budget: 'Custom Scope',
        projectDescription: `[${subject.trim()}] ${message.trim()}`,
        source: 'contact_page_email_form',
        savedAt: new Date().toISOString(),
      });
      fs.writeFileSync(LEADS_FILE, JSON.stringify(existingLeads, null, 2), 'utf-8');
    } catch {
      // non-fatal
    }

    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.json(result);
  } catch (err: any) {
    console.info('[Send Email Route Notice]:', err?.message || err);
    res.status(500).json({ error: 'Unable to dispatch email at this moment. Please reach out via WhatsApp or email directly.' });
  }
});

// User Registration & Sign-In Recording API
app.post('/api/users/record', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, provider } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Valid email is required.' });
      return;
    }

    const record = await recordUserSignIn({
      uid,
      email,
      displayName,
      photoURL,
      provider,
    });

    res.json({
      success: true,
      user: record.user,
      isNewUser: record.isNewUser,
    });
  } catch (err: any) {
    console.info('[Users Record Notice]:', err?.message || err);
    res.status(500).json({ error: 'Failed to record user authentication.' });
  }
});

// Admin-Only Registered Users Directory
app.get('/api/admin/users', (req, res) => {
  const adminKey = (req.headers['x-admin-key'] as string) || (req.query.secret as string);
  const adminEmail = (req.headers['x-admin-email'] as string) || (req.query.email as string);

  const isAuthorized = verifyAdminAccess(adminEmail, adminKey);
  if (!isAuthorized) {
    res.status(403).json({ error: 'Access denied. Only the authorized administrator can access this dashboard.' });
    return;
  }

  const search = req.query.search as string;
  const result = getRegisteredUsers({ search });
  res.json({
    success: true,
    ...result,
  });
});

// Admin Access Verification
app.post('/api/admin/verify', (req, res) => {
  const { secretKey, email } = req.body || {};
  const isAuthorized = verifyAdminAccess(email, secretKey);
  res.json({
    isAdmin: isAuthorized,
    adminEmail: AUTHORIZED_ADMIN_EMAIL,
  });
});

async function startServer() {
  if (!isProd) {
    // In development mode, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // In production mode, serve built static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
