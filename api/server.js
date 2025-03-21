import express from 'express';
import { z } from 'zod';
import { Resend } from 'resend';

const app = express();
app.use(express.json());

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const OWNER_EMAIL = 'ourshop005@gmail.com';

async function sendEmail(to, subject, html) {
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

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const validatedData = contactSchema.parse(req.body);
    
    // Log the form submission
    console.log("Contact form submission:", validatedData);
    
    // Send email notification
    if (resend) {
      const html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `;
      const {ok, data, error} = await sendEmail(
        OWNER_EMAIL, 
        `New Contact Form Submission from ${validatedData.name}`, 
        html
      );
      
      if (!ok) {
        console.error('Failed to send email:', error);
      }
    }
    
    res.status(200).json({ message: "Message received successfully" });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(400).json({ message: "Invalid form data" });
  }
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: "No API key configured for Gemini" 
      });
    }
    
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + 
      process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        }),
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).json({ message: "Failed to generate response" });
  }
});

export default app;