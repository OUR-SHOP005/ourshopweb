import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, email, subject, message } = await request.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'ourshop005@gmail.com';
    
    // Create mailto fallback link
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    // Check if Resend API key is configured
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not set, using mailto: fallback');
      return NextResponse.json({
        success: false,
        message: 'Email service not configured. Using fallback method.',
        mailtoLink
      });
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    try {
      // Send email with Resend
      const result = await resend.emails.send({
        from: 'OurShop Contact Form <onboarding@resend.dev>', // This is the default sender for unverified domains
        to: [recipientEmail],
        subject: `Contact Form: ${subject}`,
        reply_to: email,
        text: `
          Name: ${name}
          Email: ${email}
          
          Message:
          ${message}
        `,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h4>Message:</h4>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return NextResponse.json({ 
        success: true,
        id: result.data?.id 
      });
    } catch (emailError: any) {
      console.error('Error sending email with Resend:', emailError);
      
      // Check for specific Resend errors
      const errorMessage = emailError.message || 'Failed to send email';
      let statusCode = 500;
      
      // Handle rate limiting
      if (errorMessage.includes('rate limit')) {
        statusCode = 429;
      }
      
      // Handle authentication errors
      if (errorMessage.includes('authentication') || errorMessage.includes('API key')) {
        statusCode = 401;
      }
      
      // Domain verification issues often happen with new Resend accounts
      if (errorMessage.includes('domain') && errorMessage.includes('verify')) {
        return NextResponse.json({
          success: false,
          error: 'Domain not verified. Using fallback method.',
          mailtoLink
        }, { status: statusCode });
      }
      
      // If direct email fails, provide mailto fallback
      return NextResponse.json({
        success: false,
        error: errorMessage,
        mailtoLink
      }, { status: statusCode });
    }
  } catch (error: any) {
    console.error('Error in contact API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 