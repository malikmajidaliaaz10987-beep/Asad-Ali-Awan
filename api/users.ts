import { recordUserSignIn } from '../server/userService';

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { uid, email, displayName, photoURL, provider } = body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    const record = await recordUserSignIn({
      uid,
      email,
      displayName,
      photoURL,
      provider,
    });

    return res.status(200).json({
      success: true,
      user: record.user,
      isNewUser: record.isNewUser,
    });
  } catch (err: any) {
    console.info('[Vercel Users Record Notice]:', err?.message || err);
    return res.status(500).json({ error: 'Failed to record user authentication.' });
  }
}
