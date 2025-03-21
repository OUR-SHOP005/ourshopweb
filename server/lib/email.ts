import { ContactMessage } from '@shared/schema';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const OWNER_EMAIL = 'ourshop005@gmail.com'; // Owner email address

export async function sendContactEmail(message: ContactMessage) {
  try {
    if (resend) {
      const html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        ${message.company ? `<p><strong>Company:</strong> ${message.company}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.message}</p>
      `;
      const {ok, data, error} = await sendEmail(OWNER_EMAIL, `New Contact Form Submission from ${message.name}`, html);
      if (!ok) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email notification');
      }
    } else {
      // If no API key, just log the message
      console.log('==== CONTACT FORM SUBMISSION ====');
      console.log(`Name: ${message.name}`);
      console.log(`Email: ${message.email}`);
      if (message.company) console.log(`Company: ${message.company}`);
      console.log(`Message: ${message.message}`);
      console.log('================================');
      console.log('(Set RESEND_API_KEY to enable email notifications)');
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email notification');
  }
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const data = await resend?.emails.send({
      from: 'Our Shop <onboarding@resend.dev>',
      to,
      subject,
      html
    });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error };
  }
}