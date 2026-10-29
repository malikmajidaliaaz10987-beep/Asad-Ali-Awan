import { verifyAdminAccess, getRegisteredUsers, AUTHORIZED_ADMIN_EMAIL } from '../server/userService';

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-key, x-admin-email'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const adminKey = (req.headers['x-admin-key'] as string) || (req.query?.secret as string);
  const adminEmail = (req.headers['x-admin-email'] as string) || (req.query?.email as string);

  if (req.method === 'POST') {
    // Admin access verification check
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const checkSecret = body?.secretKey || adminKey;
    const checkEmail = body?.email || adminEmail;
    const isAuthorized = verifyAdminAccess(checkEmail, checkSecret);
    return res.status(200).json({
      isAdmin: isAuthorized,
      adminEmail: AUTHORIZED_ADMIN_EMAIL,
    });
  }

  if (req.method === 'GET') {
    const isAuthorized = verifyAdminAccess(adminEmail, adminKey);
    if (!isAuthorized) {
      return res.status(403).json({
        error: 'Access denied. Only the authorized administrator can access this dashboard.',
      });
    }

    const search = req.query?.search as string;
    const result = getRegisteredUsers({ search });
    return res.status(200).json({
      success: true,
      ...result,
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed.' });
}
