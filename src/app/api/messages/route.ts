import { NextRequest, NextResponse } from 'next/server';

// Mock database of messages (in a real app, this would use a database)
let messages = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Website Redesign Inquiry',
    message: 'Hello, I am interested in redesigning our company website. Could you provide information about your services and pricing?',
    date: '2023-12-01T10:30:00Z',
    read: true
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    subject: 'Mobile App Development',
    message: 'Hi there, I am looking for a team to develop a mobile app for my business. I would like to discuss the requirements and get a quote.',
    date: '2023-12-05T14:45:00Z',
    read: false
  },
  {
    id: '3',
    name: 'Michael Smith',
    email: 'michael@example.com',
    subject: 'SEO Services',
    message: 'Hello, I am interested in improving the SEO of my website. Can you tell me more about your SEO packages and expected results?',
    date: '2023-12-08T09:15:00Z',
    read: false
  }
];

// GET: Retrieve messages
export async function GET(request: NextRequest) {
  try {
    // Get the URL and params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If an ID is provided, return just that message
    if (id) {
      const message = messages.find(m => m.id === id);
      if (!message) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(message);
    }
    
    // Otherwise return all messages sorted by date (newest first)
    return NextResponse.json(
      messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST: Create a new message
export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new message
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      date: new Date().toISOString(),
      read: false
    };
    
    // Add to messages array (in a real app, this would be saved to a database)
    messages.unshift(newMessage);
    
    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// PATCH: Update message properties (e.g., mark as read)
export async function PATCH(request: NextRequest) {
  try {
    const { id, read } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    // Find the message
    const messageIndex = messages.findIndex(m => m.id === id);
    if (messageIndex === -1) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    // Update the message
    messages[messageIndex] = {
      ...messages[messageIndex],
      ...(read !== undefined && { read })
    };
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    // Check if message exists
    const messageIndex = messages.findIndex(m => m.id === id);
    if (messageIndex === -1) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    // Delete the message
    messages = messages.filter(m => m.id !== id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
} 