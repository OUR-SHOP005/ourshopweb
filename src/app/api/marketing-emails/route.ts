import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/mongodb';
import { MarketingConsent } from '@/models/MarketingConsent';
import { Resend } from 'resend';

// Send marketing email to all users who have consented
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    // Check authentication
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    // Get request body
    const { subject, content, testMode = false } = await request.json();
    
    // Basic validation
    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }
    
    // Get all users who have consented to marketing emails
    const consentingUsers = await MarketingConsent.find({ marketingConsent: true });
    
    if (consentingUsers.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No users have consented to marketing emails'
      });
    }
    
    const resendApiKey = process.env.RESEND_API_KEY;
    
    // Check if Resend API key is configured
    if (!resendApiKey) {
      return NextResponse.json({
        success: false,
        error: 'Email service not configured',
        message: 'Email service not configured. Please add RESEND_API_KEY to environment variables.'
      }, { status: 503 });
    }
    
    // Initialize Resend
    const resend = new Resend(resendApiKey);
    
    // In test mode, only send to the first user
    const recipients = testMode 
      ? [consentingUsers[0].email] 
      : consentingUsers.map(user => user.email);
    
    // Count of recipients
    const recipientCount = testMode ? 1 : consentingUsers.length;
    
    try {
      // Send email with Resend
      const result = await resend.emails.send({
        from: 'OurShop Marketing <onboarding@resend.dev>', // Update with your verified domain
        to: recipients,
        subject: subject,
        html: content,
        text: content.replace(/<[^>]*>?/gm, ''), // Strip HTML for text version
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return NextResponse.json({ 
        success: true,
        message: `Marketing email sent to ${recipientCount} recipient(s)${testMode ? ' (TEST MODE)' : ''}`,
        recipients: recipientCount,
        testMode,
        emailId: result.data?.id
      });
    } catch (emailError: any) {
      console.error('Error sending marketing email:', emailError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to send marketing email',
        message: emailError.message || 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in marketing email API:', error);
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