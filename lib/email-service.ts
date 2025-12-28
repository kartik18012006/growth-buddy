/**
 * Email Service
 * 
 * Integration with email service providers (SendGrid, Resend, AWS SES, etc.)
 * 
 * For production, integrate with your preferred email service.
 * This is a placeholder implementation.
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using email service
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Example: SendGrid integration
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    // 
    // await sgMail.send({
    //   to: options.to,
    //   from: process.env.EMAIL_FROM!,
    //   subject: options.subject,
    //   html: options.html,
    //   text: options.text,
    // });

    // Example: Resend integration
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY!);
    // 
    // await resend.emails.send({
    //   from: process.env.EMAIL_FROM!,
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html,
    // });

    // Example: AWS SES integration
    // const AWS = require('aws-sdk');
    // const ses = new AWS.SES({ region: process.env.AWS_REGION });
    // 
    // await ses.sendEmail({
    //   Source: process.env.EMAIL_FROM!,
    //   Destination: { ToAddresses: [options.to] },
    //   Message: {
    //     Subject: { Data: options.subject },
    //     Body: {
    //       Html: { Data: options.html },
    //       Text: { Data: options.text || options.html.replace(/<[^>]*>/g, '') },
    //     },
    //   },
    // }).promise();

    // Placeholder: Log email for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send reminder email
 */
export async function sendReminderEmail(
  userEmail: string,
  userName: string,
  entityName: string,
  entityType: 'task' | 'habit',
  reminderTime: string
): Promise<boolean> {
  const subject = `Reminder: ${entityName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0ea5e9; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .button { display: inline-block; padding: 10px 20px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Growth Buddy Reminder</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>This is a reminder for your ${entityType}:</p>
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${entityName}</h3>
            <p><strong>Scheduled Time:</strong> ${reminderTime}</p>
          </div>
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3001'}" class="button">Open Growth Buddy</a>
        </div>
        <div class="footer">
          <p>You're receiving this because you set up a reminder in Growth Buddy.</p>
          <p>To manage your reminders, visit your settings page.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: userEmail,
    subject,
    html,
    text: `Reminder: ${entityName}\n\nThis is a reminder for your ${entityType} scheduled for ${reminderTime}.`,
  });
}


