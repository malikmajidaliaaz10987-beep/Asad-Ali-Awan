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

  if (req.method === 'POST') {
    try {
      let lead = req.body;
      if (typeof lead === 'string') {
        try {
          lead = JSON.parse(lead);
        } catch {
          lead = {};
        }
      }

      const { fullName, email, service, consent } = lead || {};

      if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
        return res.status(400).json({ error: 'Full name is required.' });
      }

      if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
        return res.status(400).json({ error: 'A valid email address is required.' });
      }

      if (!service) {
        return res.status(400).json({ error: 'Please select a service of interest.' });
      }

      const leadRecord = {
        id: 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        fullName: fullName.trim(),
        email: email.trim(),
        whatsapp: (lead.whatsapp || '').trim(),
        businessName: (lead.businessName || '').trim(),
        service: lead.service,
        budget: lead.budget || 'Not decided yet',
        details: (lead.details || '').trim(),
        consent: Boolean(consent),
        submittedAt: new Date().toISOString(),
        source: lead.source || 'onboarding_welcome_screen',
      };

      // In production serverless functions, log safely without exposing secrets
      console.log(`[Lead Received]: ${leadRecord.fullName} (${leadRecord.email}) for service: ${leadRecord.service}`);

      return res.status(201).json({
        success: true,
        message: 'Lead received and processed successfully.',
        lead: leadRecord,
      });
    } catch (err: any) {
      console.error('[Vercel Leads Handler Error]:', err?.message || err);
      return res.status(500).json({ error: 'Failed to process lead submission.' });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Leads service is operational.' });
  }

  return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
}
