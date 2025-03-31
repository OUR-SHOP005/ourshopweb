import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define a schema for contact messages if not already defined elsewhere
let Message;

try {
  // Try to get the existing model
  Message = mongoose.model('Message');
} catch (error) {
  // Create the model if it doesn't exist
  const MessageSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  Message = mongoose.model('Message', MessageSchema);
}

// Get all messages
export async function GET(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Return a single message if ID is provided
    if (id) {
      const message = await Message.findById(id);
      if (!message) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(message);
    }
    
    // Get all messages, sorted by creation date (newest first)
    const messages = await Message.find().sort({ createdAt: -1 });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Handle message submission
export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
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

    // Save the message to the database
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      read: false,
    });

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
        success: true,
        message: 'Message saved. Email service not configured, using fallback method.',
        mailtoLink,
        id: newMessage._id
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
        replyTo: email,
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
        id: newMessage._id,
        emailId: result.data?.id 
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
          success: true, // Message was still saved to DB
          error: 'Domain not verified. Using fallback method.',
          mailtoLink,
          id: newMessage._id
        }, { status: statusCode });
      }
      
      // If direct email fails, provide mailto fallback
      return NextResponse.json({
        success: true, // Message was still saved to DB
        error: errorMessage,
        mailtoLink,
        id: newMessage._id
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

// Delete a message
export async function DELETE(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    // Find the message by ID and delete it
    const result = await Message.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

// Mark message as read/unread
export async function PATCH(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const { id, read } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    // Find the message by ID and update its read status
    const updatedMessage = await Message.findByIdAndUpdate(
      id, 
      { read: !!read }, 
      { new: true }
    );
    
    if (!updatedMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
} 