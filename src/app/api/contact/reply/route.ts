import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { recipientEmail, subject, message, senderName } = body;
    
    // Validate required fields
    if (!recipientEmail || !subject || !message) {
      console.error('Missing required fields:', { recipientEmail, subject, message });
      return NextResponse.json(
        { error: 'Missing required fields', details: { recipientEmail, subject, message } },
        { status: 400 }
      );
    }
    
    // Get Resend API key from environment variables
    const resendApiKey = process.env.RESEND_API_KEY;
    
    // Check if Resend API key is configured
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not set');
      return NextResponse.json({
        success: false,
        error: 'Email service not configured',
        message: 'Email service not configured. Please add RESEND_API_KEY to environment variables.'
      }, { status: 503 });
    }
    
    console.log('Attempting to send email with Resend API');
    
    // Initialize Resend
    const resend = new Resend(resendApiKey);
    
    try {
      // Send email reply
      console.log('Email params:', {
        to: recipientEmail,
        subject: `Re: ${subject}`
      });
      
      const result = await resend.emails.send({
        from: 'OURSHOP <onboarding@resend.dev>', // Update with your verified domain
        to: [recipientEmail],
        subject: `Re: ${subject}`,
        text: message,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Re: ${subject}</h2>
            <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #ddd;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p style="font-size: 14px; color: #666;">
              Regards,<br>
              ${senderName || 'The OURSHOP Team'}
            </p>
          </div>
        `,
      });
      
      console.log('Resend API response:', result);
      
      if (result.error) {
        console.error('Resend API error:', result.error);
        throw new Error(result.error.message);
      }
      
      return NextResponse.json({ 
        success: true,
        message: 'Reply sent successfully',
        emailId: result.data?.id
      });
    } catch (emailError: any) {
      console.error('Error sending email reply:', emailError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to send email reply',
        message: emailError.message || 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in reply email API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 