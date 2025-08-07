export interface EmailData {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      })
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export function generateLeadNotificationEmail(
  tenantName: string,
  leadData: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    systemSizeKW: number;
    estimatedCost: number;
    estimatedSavings: number;
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Solar Lead - ${tenantName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #FFA63D;">New Solar Lead Received</h1>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Lead Information</h2>
          <p><strong>Name:</strong> ${leadData.name}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          ${leadData.phone ? `<p><strong>Phone:</strong> ${leadData.phone}</p>` : ''}
          <p><strong>Address:</strong> ${leadData.address}</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Solar Estimate</h2>
          <p><strong>System Size:</strong> ${leadData.systemSizeKW} kW</p>
          <p><strong>Estimated Cost:</strong> $${leadData.estimatedCost.toLocaleString()}</p>
          <p><strong>Annual Savings:</strong> $${leadData.estimatedSavings.toLocaleString()}</p>
        </div>
        
        <p style="margin-top: 30px;">
          <strong>Action Required:</strong> Please contact this lead within 24 hours for the best conversion rate.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This lead was generated through ${tenantName}'s solar estimation tool.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Solar Lead - ${tenantName}

Lead Information:
- Name: ${leadData.name}
- Email: ${leadData.email}
${leadData.phone ? `- Phone: ${leadData.phone}` : ''}
- Address: ${leadData.address}

Solar Estimate:
- System Size: ${leadData.systemSizeKW} kW
- Estimated Cost: $${leadData.estimatedCost.toLocaleString()}
- Annual Savings: $${leadData.estimatedSavings.toLocaleString()}

Action Required: Please contact this lead within 24 hours for the best conversion rate.

This lead was generated through ${tenantName}'s solar estimation tool.
  `;

  return {
    subject: `New Solar Lead - ${leadData.name} (${leadData.address})`,
    html,
    text
  };
}

export function generateUserConfirmationEmail(
  tenantName: string,
  leadData: {
    name: string;
    address: string;
    systemSizeKW: number;
    estimatedCost: number;
    estimatedSavings: number;
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Solar Estimate - ${tenantName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #FFA63D;">Thank You for Your Interest!</h1>
        
        <p>Hi ${leadData.name},</p>
        
        <p>Thank you for requesting a solar estimate for your property at <strong>${leadData.address}</strong>.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Your Solar Estimate Summary</h2>
          <p><strong>System Size:</strong> ${leadData.systemSizeKW} kW</p>
          <p><strong>Estimated Cost:</strong> $${leadData.estimatedCost.toLocaleString()}</p>
          <p><strong>Annual Savings:</strong> $${leadData.estimatedSavings.toLocaleString()}</p>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ul>
          <li>Our team will review your property details</li>
          <li>You'll receive a call within 24 hours</li>
          <li>We'll schedule a free consultation</li>
          <li>Get your personalized solar proposal</li>
        </ul>
        
        <p>If you have any questions, please don't hesitate to reach out.</p>
        
        <p>Best regards,<br>The ${tenantName} Team</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This estimate is based on industry-standard calculations. Final pricing may vary based on site-specific factors.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Thank You for Your Interest!

Hi ${leadData.name},

Thank you for requesting a solar estimate for your property at ${leadData.address}.

Your Solar Estimate Summary:
- System Size: ${leadData.systemSizeKW} kW
- Estimated Cost: $${leadData.estimatedCost.toLocaleString()}
- Annual Savings: $${leadData.estimatedSavings.toLocaleString()}

What happens next?
- Our team will review your property details
- You'll receive a call within 24 hours
- We'll schedule a free consultation
- Get your personalized solar proposal

If you have any questions, please don't hesitate to reach out.

Best regards,
The ${tenantName} Team

This estimate is based on industry-standard calculations. Final pricing may vary based on site-specific factors.
  `;

  return {
    subject: `Your Solar Estimate - ${tenantName}`,
    html,
    text
  };
}

