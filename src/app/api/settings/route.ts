import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { auth } from '@clerk/nextjs';

// Define a schema for website settings if not already defined elsewhere
let Settings;

try {
  // Try to get the existing model
  Settings = mongoose.model('Settings');
} catch (error) {
  // Create the model if it doesn't exist
  const SettingsSchema = new mongoose.Schema({
    siteName: {
      type: String,
      default: 'OURSHOP',
    },
    siteDescription: {
      type: String, 
      default: 'Modern Web Design Agency',
    },
    contactEmail: {
      type: String,
      default: 'contact@ourshop.com',
    },
    phoneNumber: {
      type: String,
      default: '+1 (555) 123-4567',
    },
    address: {
      type: String,
      default: '123 Main Street, City, Country',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  });

  Settings = mongoose.model('Settings', SettingsSchema);
}

// GET settings
export async function GET() {
  // Add CORS headers for debugging
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  });
  
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Find settings or create default if not exists
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    return NextResponse.json(settings, { headers });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500, headers }
    );
  }
}

// PUT settings - update
export async function PUT(request: Request) {
  // Add CORS headers for debugging
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  });

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers, status: 200 });
  }

  try {
    // Connect to the database first to handle potential connection issues early
    await connectToDatabase();
    
    // Check authentication
    const { userId } = auth();
    console.log('Auth user ID:', userId);
    
    if (!userId) {
      console.log('Authentication failed: No userId');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers }
      );
    }
    
    // Parse request body with error handling
    let updateData;
    try {
      updateData = await request.json();
      console.log('Received update data:', updateData);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400, headers }
      );
    }
    
    // Find settings or create default if not exists
    let settings;
    try {
      settings = await Settings.findOne({});
      
      if (!settings) {
        console.log('No settings found, creating default');
        settings = await Settings.create({});
      }
    } catch (dbError) {
      console.error('Database error when finding settings:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500, headers }
      );
    }
    
    // Update fields with validation
    try {
      if (updateData.siteName !== undefined) settings.siteName = updateData.siteName;
      if (updateData.siteDescription !== undefined) settings.siteDescription = updateData.siteDescription;
      if (updateData.contactEmail !== undefined) settings.contactEmail = updateData.contactEmail;
      if (updateData.phoneNumber !== undefined) settings.phoneNumber = updateData.phoneNumber;
      if (updateData.address !== undefined) settings.address = updateData.address;
      if (updateData.maintenanceMode !== undefined) settings.maintenanceMode = updateData.maintenanceMode;
      
      // Update last updated timestamp
      settings.lastUpdated = new Date();
      
      // Save changes
      await settings.save();
      console.log('Settings updated successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully',
        settings
      }, { headers });
    } catch (saveError) {
      console.error('Error saving settings:', saveError);
      return NextResponse.json(
        { error: 'Failed to save settings' },
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings', details: (error as Error).message },
      { status: 500, headers }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  
  return new NextResponse(null, { headers, status: 200 });
} 