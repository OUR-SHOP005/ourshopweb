import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/mongodb';
import { MarketingConsent } from '@/models/MarketingConsent';

// Get user's marketing preferences
export async function GET(request: NextRequest) {
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
    
    // Find the user's marketing consent
    const consent = await MarketingConsent.findOne({ userId });
    
    if (!consent) {
      return NextResponse.json({
        userId,
        marketingConsent: false, // Default to false if not found
      });
    }
    
    return NextResponse.json({
      userId: consent.userId,
      email: consent.email,
      marketingConsent: consent.marketingConsent,
      createdAt: consent.createdAt,
      updatedAt: consent.updatedAt,
    });
  } catch (error: any) {
    console.error('Error getting marketing consent:', error);
    return NextResponse.json(
      { error: 'Failed to get marketing preferences' },
      { status: 500 }
    );
  }
}

// Update user's marketing preferences
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    console.log('User ID from auth:', userId);
    
    // Check authentication
    if (!userId) {
      console.error('Marketing consent update failed: No user ID from auth');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body with error handling
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('Marketing consent request body:', requestBody);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body', details: (parseError as Error).message },
        { status: 400 }
      );
    }
    
    const { email, marketingConsent } = requestBody;
    
    // Validate email
    if (!email) {
      console.error('Marketing consent update failed: No email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Validate consent (should be boolean)
    if (typeof marketingConsent !== 'boolean') {
      console.error('Marketing consent update failed: Consent not boolean', typeof marketingConsent);
      return NextResponse.json(
        { error: 'Marketing consent must be a boolean value' },
        { status: 400 }
      );
    }
    
    // Connect to database with error handling
    try {
      await connectToDatabase();
      console.log('Connected to database for marketing consent update');
    } catch (dbError) {
      console.error('Error connecting to database:', dbError);
      return NextResponse.json(
        { error: 'Database connection error', details: (dbError as Error).message },
        { status: 500 }
      );
    }
    
    try {
      // Use findOneAndUpdate with upsert to create or update
      const updatedConsent = await MarketingConsent.findOneAndUpdate(
        { userId },
        { 
          userId,
          email,
          marketingConsent
        },
        { 
          new: true, // Return the updated document
          upsert: true, // Create if it doesn't exist
          runValidators: true // Run validators on update
        }
      );
      
      console.log('Marketing consent updated successfully:', {
        userId,
        email,
        marketingConsent,
        success: true
      });
      
      return NextResponse.json({
        success: true,
        userId: updatedConsent.userId,
        email: updatedConsent.email,
        marketingConsent: updatedConsent.marketingConsent,
        message: `Marketing preferences ${marketingConsent ? 'enabled' : 'disabled'}`
      });
    } catch (mongoError: any) {
      console.error('MongoDB error updating marketing consent:', mongoError);
      
      // Check for validation errors
      if (mongoError.name === 'ValidationError') {
        const validationErrors = Object.keys(mongoError.errors).map(field => ({
          field,
          message: mongoError.errors[field].message
        }));
        
        return NextResponse.json(
          { 
            error: 'Validation error', 
            details: validationErrors 
          },
          { status: 400 }
        );
      }
      
      // Check for duplicate key errors
      if (mongoError.code === 11000) {
        return NextResponse.json(
          { 
            error: 'Duplicate record', 
            details: 'A consent record for this user already exists' 
          },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Database error', 
          details: mongoError.message || 'Unknown database error' 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error updating marketing consent:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update marketing preferences',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get all users with marketing consent (admin only)
export async function PUT(request: NextRequest) {
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
    
    // Verify the user is an admin
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Get all users who have consented to marketing emails
    const consentingUsers = await MarketingConsent.find({ marketingConsent: true });
    
    return NextResponse.json({
      success: true,
      users: consentingUsers.map(user => ({
        userId: user.userId,
        email: user.email,
        createdAt: user.createdAt,
      }))
    });
  } catch (error: any) {
    console.error('Error listing marketing consents:', error);
    return NextResponse.json(
      { error: 'Failed to list marketing consents' },
      { status: 500 }
    );
  }
} 