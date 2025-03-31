import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function GET() {
  try {
    // Check authentication
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    return NextResponse.json({
      configured: !!resendApiKey,
      message: resendApiKey 
        ? 'Email service is configured properly'
        : 'Email service is not configured. Please add RESEND_API_KEY to environment variables.'
    });
  } catch (error: any) {
    console.error('Error checking email service configuration:', error);
    return NextResponse.json(
      { 
        configured: false,
        error: 'Failed to check email service configuration',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 