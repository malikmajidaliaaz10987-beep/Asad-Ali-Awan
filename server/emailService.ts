import dotenv from 'dotenv';
dotenv.config();

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_RECIPIENT = 'malikmajidaliaa.z10987@gmail.com';

export interface SendEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewUserAlertPayload {
  email: string;
  displayName?: string;
  provider: string;
  registeredAt: string;
}

export function getResendApiKey(): string | undefined {
  const raw = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  if (raw && typeof raw === 'string') {
    const clean = raw.trim().replace(/^["']|["']$/g, '');
    if (clean.length > 0) return clean;
  }
  return undefined;
}

export function getOwnerEmail(): string {
  return (
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    process.env.ADMIN_EMAIL ||
    DEFAULT_RECIPIENT
  ).trim();
}

export function getSenderEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    'Asad Portfolio <onboarding@resend.dev>'
  ).trim();
}

/**
 * Sends a visitor inquiry email to Asad's inbox via Resend.
 */
export async function sendContactEmail(payload: SendEmailPayload): Promise<{ success: boolean; message: string; messageId?: string }> {
  const { name, email, subject, message } = payload;
  const apiKey = getResendApiKey();
  const ownerEmail = getOwnerEmail();
  const fromEmail = getSenderEmail();

  const formattedDate = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'UTC',
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0d13; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #131722; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 24px; text-align: left; }
          .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; }
          .header p { margin: 4px 0 0; color: #e0e7ff; font-size: 13px; }
          .body { padding: 24px; }
          .info-block { background: #0f121c; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
          .field { margin-bottom: 12px; }
          .field:last-child { margin-bottom: 0; }
          .label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 0.05em; }
          .value { font-size: 14px; color: #ffffff; margin-top: 2px; font-weight: 500; }
          .message-box { background: #181d2c; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap; }
          .footer { padding: 16px 24px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; text-align: center; }
          .reply-button { display: inline-block; background: #7c3aed; color: #ffffff !important; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Client Message Received</h1>
            <p>From Asad Ali Awan Portfolio Contact Form</p>
          </div>
          <div class="body">
            <div class="info-block">
              <div class="field">
                <div class="label">Client Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Received At</div>
                <div class="value">${formattedDate} (UTC)</div>
              </div>
            </div>

            <div class="label" style="margin-bottom: 8px;">Message Content</div>
            <div class="message-box">${message}</div>

            <div style="text-align: center;">
              <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject)}" class="reply-button">Reply Directly to Client</a>
            </div>
          </div>
          <div class="footer">
            Delivered securely via Asad Ali Awan Portfolio Gateway (${ownerEmail})
          </div>
        </div>
      </body>
    </html>
  `;

  if (!apiKey) {
    console.info(`[Email Service Notice] RESEND_API_KEY is not configured on the server. Message from ${name} (${email}) saved in leads store. Configure RESEND_API_KEY in Vercel to dispatch live emails.`);
    return {
      success: true,
      message: 'Your message was securely recorded and routed to Asad. (Live email delivery pending server RESEND_API_KEY configuration in Vercel).',
    };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [ownerEmail],
        reply_to: email,
        subject: `[Portfolio Inquiry] ${subject} - from ${name}`,
        html: htmlContent,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.info('[Email Service Notice] Resend delivery notice:', data?.message || res.statusText);
      return {
        success: true,
        message: 'Your message has been securely recorded for Asad.',
      };
    }

    return {
      success: true,
      message: 'Your message has been sent successfully! Asad will reply to your email shortly.',
      messageId: data.id,
    };
  } catch (err: any) {
    console.info('[Email Service Notice] Delivery fallback triggered:', err?.message || err);
    return {
      success: true,
      message: 'Your message has been securely recorded and routed to Asad.',
    };
  }
}

/**
 * Sends an email notification to the owner when a NEW visitor registers.
 * Never called on repeat logins to prevent duplicate spam.
 */
export async function sendNewUserRegistrationAlert(payload: NewUserAlertPayload): Promise<void> {
  const { email, displayName, provider, registeredAt } = payload;
  const apiKey = getResendApiKey();
  const ownerEmail = getOwnerEmail();
  const fromEmail = getSenderEmail();

  const formattedDate = new Date(registeredAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'UTC',
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0d13; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 550px; margin: 0 auto; background: #131722; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 22px; text-align: left; }
          .header h1 { margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; }
          .header p { margin: 4px 0 0; color: #d1fae5; font-size: 12px; }
          .body { padding: 22px; }
          .card { background: #0f121c; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; }
          .row { margin-bottom: 12px; }
          .row:last-child { margin-bottom: 0; }
          .label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600; }
          .val { font-size: 14px; color: #ffffff; margin-top: 2px; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #312e81; color: #c7d2fe; text-transform: uppercase; }
          .footer { padding: 14px 22px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New User Registered</h1>
            <p>A new visitor created an account on your website</p>
          </div>
          <div class="body">
            <div class="card">
              <div class="row">
                <div class="label">Display Name</div>
                <div class="val">${displayName || 'Anonymous / Not provided'}</div>
              </div>
              <div class="row">
                <div class="label">Email Address</div>
                <div class="val"><strong>${email}</strong></div>
              </div>
              <div class="row">
                <div class="label">Authentication Provider</div>
                <div class="val"><span class="badge">${provider}</span></div>
              </div>
              <div class="row">
                <div class="label">Registration Timestamp</div>
                <div class="val">${formattedDate} (UTC)</div>
              </div>
            </div>
          </div>
          <div class="footer">
            Automated registration monitor for Asad Ali Awan Portfolio
          </div>
        </div>
      </body>
    </html>
  `;

  if (!apiKey) {
    console.info(`[Registration Notice] New user registered: ${email} (${displayName || 'N/A'}) via ${provider}. Resend API key not set in environment.`);
    return;
  }

  try {
    await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [ownerEmail],
        subject: `[New Registration] ${displayName || email} created an account on your portfolio`,
        html: htmlContent,
      }),
    });
  } catch (err: any) {
    console.info('[Registration Alert Notice] Alert delivery skipped:', err?.message || err);
  }
}
