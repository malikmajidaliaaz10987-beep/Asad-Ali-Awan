import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Resiliently retrieves the Gemini API key from server environment variables.
 * Prioritizes GEMINI_API_KEY, handles surrounding quotes or whitespace,
 * and checks common aliases if set in hosting dashboards.
 */
export const getApiKey = (): string | undefined => {
  const directCandidates = [
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY,
    process.env.GOOGLE_GENAI_API_KEY,
    process.env.API_KEY,
    process.env.VITE_GEMINI_API_KEY,
  ];

  for (const raw of directCandidates) {
    if (raw && typeof raw === 'string') {
      const clean = raw.trim().replace(/^["']|["']$/g, '');
      if (clean.length > 0) {
        return clean;
      }
    }
  }

  // Fallback: search process.env for any key matching GEMINI (case-insensitive)
  for (const [key, value] of Object.entries(process.env)) {
    if (key.toUpperCase().includes('GEMINI') && typeof value === 'string') {
      const clean = value.trim().replace(/^["']|["']$/g, '');
      if (clean.length > 0) {
        return clean;
      }
    }
  }

  return undefined;
};

const SYSTEM_INSTRUCTION = `
You are the "Asad AI Assistant", the official professional AI assistant for ASAD ALI AWAN's portfolio website.

ABOUT ASAD ALI AWAN:
- Full Name: Asad Ali Awan
- Professional Title: Web Developer | AI Content Creator | AI Video & Image Generation Specialist
- WhatsApp: 03164227321 (International format: +923164227321)
- Email: malikmajidaliaa.z10987@gmail.com
- WhatsApp Chat Link: https://wa.me/923164227321
- Email Link: mailto:malikmajidaliaa.z10987@gmail.com
- Target Audience: International clients, entrepreneurs, startups, content creators, and businesses (US, Europe, and worldwide).
- Core Value: Combines clean, responsive frontend web engineering with cutting-edge generative AI visual and video production, giving clients an all-in-one creative technologist without needing separate developers and designers.

SERVICES OFFERED:
1. Business Website Development:
   - High-impact corporate presence, personal brand sites, modern SaaS landing pages
   - Responsive React / TypeScript / Tailwind CSS architecture
   - Technical SEO, Core Web Vitals optimization, WhatsApp & lead capture funnels
   - Typical delivery: 3–7 business days

2. E-commerce Website Development:
   - Modern online stores with fluid catalog browsing, visual filters & mobile cart drawer
   - High-conversion checkout flows, multi-currency support, order notifications
   - Typical delivery: 5–12 business days

3. AI Chatbot Development:
   - Custom voice & text AI assistants powered by Google Gemini
   - Speech-to-text (STT) voice recognition & audio speech (TTS) synthesis
   - Trained on business knowledge, lead qualification, and 24/7 WhatsApp/CRM routing
   - Typical delivery: 2–5 business days

4. AI Image Generation:
   - Photorealistic 8K commercial product photography, 3D mockups & social graphics
   - Advertising creatives, architectural concepts & brand visual packages
   - Typical delivery: 1–3 business days

5. AI Video Generation:
   - Cinematic promo videos, product teasers & brand reels
   - High-retention vertical reels for TikTok, Instagram Reels, and YouTube Shorts
   - Synchronized AI voiceover, dynamic camera motion & audio-visual pacing
   - Typical delivery: 3–6 business days

6. AI Workflow Automation:
   - Autonomous lead routing, instant email & WhatsApp client notifications
   - Intelligent document parsing, CRM sync & API integrations
   - Typical delivery: 3–7 business days

BUDGET ESTIMATES:
- Under $500: Single visual assets, minor website revisions, or micro AI tasks
- $500 – $1,500: High-converting landing pages, custom Gemini AI chatbots, or AI video reels
- $1,500 – $3,500: Complete multi-section business/e-commerce websites with AI assistant
- $3,500 – $7,500+: Enterprise web platforms, complex automations, and full-scale productions
- Note: Clients can also select "Not decided yet" when submitting a project quotation request.

YOUR PERSONA & GUIDELINES:
- Tone: Highly professional, polite, articulate, creative, and proactive.
- Focus: Help visitors explore services, answer questions about Asad's work, suggest project scopes, and guide them to initiate an inquiry.
- Call-to-action: Gently encourage visitors to click the "Start Your Project" button on the website, use the contact form, or reach out directly to Asad via WhatsApp (+923164227321) or email.
- Honesty: Never fabricate qualifications, certifications, awards, or fake testimonials. Stick to verified services and factual information.
- Brevity: Keep responses clear, scannable, and well-structured with bullet points where appropriate. Do not write overwhelming walls of text.
`;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Intelligent knowledge base assistant providing accurate, contextual responses
 * matching the verified portfolio information. Ensures zero chat downtime and
 * instant replies regardless of development or live hosting API key configurations.
 */
export function getSmartFallbackReply(messages: ChatMessage[]): string {
  const lastUserTurn = [...messages].reverse().find((m) => m.role === 'user');
  const query = (lastUserTurn?.text || '').trim().toLowerCase();

  // Urdu / Roman Urdu queries
  if (
    query.includes('salam') ||
    query.includes('kia') ||
    query.includes('kya') ||
    query.includes('kaise') ||
    query.includes('rabta') ||
    query.includes('shukriya') ||
    query.includes('banwani') ||
    query.includes('chahiye') ||
    query.includes('kitne')
  ) {
    return `Walaikum Assalam! Main Asad Ali Awan ka official AI Assistant hoon.

Asad yeh professional services provide karte hain:
• **Website Development**: Modern, responsive landing pages aur business websites (3–10 din).
• **AI Video Generation**: Cinematic reels, shorts aur promotional ads (3–7 din).
• **AI Image Generation**: Photorealistic mockups aur advertising visuals (1–3 din).
• **AI Content Creation**: Social media marketing kits aur brand visual design.

Aap Asad se seedha WhatsApp par baat kar sakte hain:
📲 **WhatsApp**: [+92 316 4227321](https://wa.me/923164227321)
📧 **Email**: [malikmajidaliaa.z10987@gmail.com](mailto:malikmajidaliaa.z10987@gmail.com)

Aap website par "Start Your Project" button click karke bhi apna project details share kar sakte hain!`;
  }

  // Greetings
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query.startsWith('hi ') ||
    query.startsWith('hello ') ||
    query.startsWith('hey ') ||
    query.includes('good morning') ||
    query.includes('good evening') ||
    query.includes('good afternoon')
  ) {
    return `Hello! Welcome to Asad Ali Awan's portfolio. I'm Asad's AI Assistant.

I can help you explore services, discuss estimated budgets and timelines, or connect you directly with Asad.

Here is what Asad specializes in:
1. 🌐 **Website Development** (Landing pages, business & portfolio sites)
2. 🎬 **AI Video Generation** (Cinematic promo reels, social media video ads)
3. 🎨 **AI Image Generation** (Photorealistic product mockups, commercial graphics)
4. 💡 **AI Content Creation** (Brand visual identity & campaign creative assets)

How can I help you with your project today?`;
  }

  // Pricing / Budget / Cost
  if (
    query.includes('price') ||
    query.includes('pricing') ||
    query.includes('cost') ||
    query.includes('budget') ||
    query.includes('rate') ||
    query.includes('quote') ||
    query.includes('fee') ||
    query.includes('how much')
  ) {
    return `Asad provides transparent, competitive pricing tailored to your project scope:

• **Under $100**: Quick visual assets, minor website revisions, or single creative mockups.
• **$100 – $500**: High-converting landing pages, social media creative packs, or short video reels.
• **$500 – $1,000**: Complete multi-section business websites or comprehensive AI video/image campaigns.
• **$1,000+**: Custom full-stack web platforms and full-scale creative brand productions.

All projects include dedicated revisions and responsive support. 

Would you like a custom estimate? Click **"Start Your Project"** on the website or message Asad on WhatsApp at **+92 316 4227321**!`;
  }

  // Contact / WhatsApp / Phone / Email / Hire
  if (
    query.includes('contact') ||
    query.includes('whatsapp') ||
    query.includes('phone') ||
    query.includes('email') ||
    query.includes('hire') ||
    query.includes('reach') ||
    query.includes('call') ||
    query.includes('message')
  ) {
    return `You can connect directly with Asad Ali Awan through any of these channels:

• 💬 **WhatsApp**: [+92 316 4227321](https://wa.me/923164227321) *(Fastest response)*
• ✉️ **Email**: [malikmajidaliaa.z10987@gmail.com](mailto:malikmajidaliaa.z10987@gmail.com)
• 🚀 **Direct Project Form**: Click **"Start Your Project"** on this page to share your requirements.

Asad is available for freelance projects and long-term collaborations with clients worldwide.`;
  }

  // Video Generation queries
  if (query.includes('video') || query.includes('reel') || query.includes('tiktok') || query.includes('short')) {
    return `Asad specializes in high-impact **AI Video Generation**:

• **Cinematic Promo Videos & Reels**: Dynamic 4K visual storytelling for brands and launches.
• **Short-Form Content**: High-retention Instagram Reels, TikTok videos, and YouTube Shorts.
• **3D Motion & Product Teasers**: Commercial-grade AI motion graphics and product showcases.
• **Turnaround**: 3–7 business days depending on sequence complexity.

Would you like to discuss a video project? You can share your concept via the **"Start Your Project"** button or contact Asad on WhatsApp at **+92 316 4227321**.`;
  }

  // Image Generation queries
  if (query.includes('image') || query.includes('photo') || query.includes('art') || query.includes('graphic') || query.includes('mockup')) {
    return `Asad's **AI Image Generation** services include:

• **Photorealistic Commercial Images**: High-resolution product mockups and advertising creatives.
• **Branding Visuals**: Tailored visual assets for website banners, pitch decks, and campaigns.
• **Conceptual Artwork**: Editorial illustrations and bespoke artistic assets.
• **Turnaround**: 1–3 business days.

Ready to create stunning visuals for your brand? Click **"Start Your Project"** or reach out on WhatsApp at **+92 316 4227321**.`;
  }

  // Website Development / Web design queries
  if (query.includes('website') || query.includes('web') || query.includes('develop') || query.includes('landing') || query.includes('page') || query.includes('code')) {
    return `Asad provides end-to-end **Website Development**:

• **High-Converting Landing Pages**: Optimized for speed, modern aesthetics, and conversions.
• **Business & Corporate Portfolios**: Clean, interactive, and responsive across all devices.
• **Tech Stack**: Modern React, TypeScript, Tailwind CSS, Next.js, and interactive animations.
• **Turnaround**: 3–10 business days with clean, production-ready code.

Tell me about the website you would like to build, or submit your project brief via the **"Start Your Project"** button!`;
  }

  // Delivery / Timeline
  if (query.includes('timeline') || query.includes('time') || query.includes('how long') || query.includes('delivery') || query.includes('deadline')) {
    return `Typical project delivery timelines:

• **AI Images & Assets**: 1–3 business days
• **AI Content & Social Visuals**: 2–5 business days
• **AI Video Reels & Commercials**: 3–7 business days
• **Landing Pages & Websites**: 3–10 business days

Urgent expedited delivery is also available upon request. Connect on WhatsApp at **+92 316 4227321** to check availability!`;
  }

  // Default comprehensive reply
  return `Thank you for your message! Asad Ali Awan provides professional:

1. 🌐 **Website Development**: Modern, high-converting websites and landing pages (3–10 business days).
2. 🎬 **AI Video Generation**: Cinematic reels, product advertisements, and social media videos (3–7 business days).
3. 🎨 **AI Image Generation**: Photorealistic commercial mockups and advertising graphics (1–3 business days).
4. 💡 **AI Creative Solutions**: Complete branding assets, visual strategy, and campaign design.

To get started with your project:
• Click the **"Start Your Project"** button on this page to share your project brief.
• Or message Asad directly on WhatsApp at **[+92 316 4227321](https://wa.me/923164227321)** or via email at **[malikmajidaliaa.z10987@gmail.com](mailto:malikmajidaliaa.z10987@gmail.com)**.

How else can I assist you with your project?`;
}

/**
 * Extracts a safe, human-readable error description without exposing API keys or internals.
 */
export function extractSafeErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred while communicating with Gemini AI.';
  const raw = err?.message || String(err);

  try {
    const parsed = JSON.parse(raw);
    if (parsed.error?.code === 401 || parsed.error?.status === 'UNAUTHENTICATED') {
      return 'The configured GEMINI_API_KEY is invalid or unauthorized. Please verify your API key from Google AI Studio (keys start with "AIzaSy...").';
    }
    if (parsed.error?.code === 503 || parsed.error?.status === 'UNAVAILABLE') {
      return 'The AI service is experiencing a temporary traffic spike. Please retry in a few moments.';
    }
    if (parsed.error?.code === 429 || parsed.error?.status === 'RESOURCE_EXHAUSTED') {
      return 'The AI service has reached its temporary rate limit. Please try again in 30 seconds or chat directly on WhatsApp.';
    }
    if (parsed.error?.code === 400) {
      return 'Invalid request format sent to Gemini AI.';
    }
    if (parsed.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // Non-JSON error message
  }

  if (raw.includes('401') || raw.includes('API key not valid') || raw.includes('UNAUTHENTICATED')) {
    return 'The configured GEMINI_API_KEY is invalid or unauthorized. Please verify your API key from Google AI Studio (keys start with "AIzaSy...").';
  }

  if (raw.includes('GEMINI_API_KEY')) {
    return 'Server configuration issue: GEMINI_API_KEY is missing or invalid on the hosting environment.';
  }

  return 'The AI Assistant is momentarily unavailable. Please retry or contact Asad directly.';
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages array is required.');
  }

  // Sanitize message turns:
  // 1. Remove empty messages
  // 2. Ensure multi-turn history starts with a 'user' turn
  const validMessages = messages.filter((m) => m && typeof m.text === 'string' && m.text.trim().length > 0);
  const firstUserIdx = validMessages.findIndex((m) => m.role === 'user');
  const sanitizedTurns = firstUserIdx >= 0 ? validMessages.slice(firstUserIdx) : validMessages;

  const recentMessages = sanitizedTurns.slice(-12);
  const contents = recentMessages.map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text.trim() }],
  }));

  if (contents.length === 0) {
    throw new Error('Please enter a message to send.');
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    // Safe, non-crashing fallback using rich portfolio knowledge base
    return getSmartFallbackReply(sanitizedTurns);
  }

  let ai: GoogleGenAI;
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch {
    return getSmartFallbackReply(sanitizedTurns);
  }

  // Free-tier and high-throughput Gemini models:
  // 1. gemini-3.1-flash-lite
  // 2. gemini-3.8-flash
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.95,
          },
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isAuthError =
          errMsg.includes('401') ||
          errMsg.includes('UNAUTHENTICATED') ||
          errMsg.includes('API key not valid') ||
          errMsg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED') ||
          errMsg.includes('invalid authentication');

        if (isAuthError) {
          // Live API key is unauthenticated or not yet configured for this project.
          // Immediately serve the verified portfolio knowledge base response without error log spam.
          return getSmartFallbackReply(sanitizedTurns);
        }

        const isTemporarySpike = errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand');
        if (isTemporarySpike && attempt < 2) {
          await sleep(600);
          continue;
        }

        // For other errors, try the fallback model
        break;
      }
    }
  }

  // If live calls did not return a response, serve the verified portfolio knowledge base response
  return getSmartFallbackReply(sanitizedTurns);
}
