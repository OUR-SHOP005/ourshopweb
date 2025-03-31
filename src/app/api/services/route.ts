import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Service from '@/models/Service';

// Initial data for seeding the database if empty
const initialServices = [
  {
    title: 'Web Design',
    description: 'Custom website design tailored to your business needs.',
    price: '$999',
    featured: true,
    status: 'active'
  },
  {
    title: 'Logo Design',
    description: 'Professional logo design to establish your brand identity.',
    price: '$299',
    featured: false,
    status: 'active'
  },
  {
    title: 'SEO Services',
    description: 'Improve your search engine rankings with our SEO expertise.',
    price: '$499/month',
    featured: true,
    status: 'active'
  },
  {
    title: 'Mobile App Development',
    description: 'Custom mobile applications for iOS and Android platforms.',
    price: '$4,999',
    featured: false,
    status: 'active'
  },
  {
    title: 'Social Media Marketing',
    description: 'Comprehensive social media strategy and implementation.',
    price: '$799/month',
    featured: true,
    status: 'active'
  }
];

// Helper function to seed initial data
async function seedInitialData() {
  try {
    // Check if there are any services in the database
    const count = await Service.countDocuments();
    
    // If no services, seed the initial data
    if (count === 0) {
      console.log('Seeding initial services data...');
      await Service.insertMany(initialServices);
      console.log('Initial services data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial services data:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Seed initial data if needed
    await seedInitialData();
    
    // Get the URL and params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const featured = searchParams.get('featured');
    
    // Build query based on parameters
    let query: any = {};
    
    // If ID is provided, return single service
    if (id) {
      const service = await Service.findById(id);
      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(service);
    }
    
    // Filter by featured if specified
    if (featured === 'true') {
      query.featured = true;
    }
    
    // For public API, only show active services
    if (!searchParams.get('admin')) {
      query.status = 'active';
    }
    
    // Execute the query
    const services = await Service.find(query).lean();
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// Create a new service
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new service
    const newService = await Service.create({
      title: data.title,
      description: data.description,
      price: data.price,
      featured: data.featured || false,
      status: data.status || 'active'
    });
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    
    // Check for validation errors
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

// Update an existing service
export async function PUT(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Find the service to update
    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Update the service
    if (data.title) service.title = data.title;
    if (data.description) service.description = data.description;
    if (data.price) service.price = data.price;
    if (data.featured !== undefined) service.featured = data.featured;
    if (data.status) service.status = data.status;
    
    // Save the updated service
    const updatedService = await service.save();
    
    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    
    // Check for validation errors
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// Delete a service
export async function DELETE(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the service exists
    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Delete the service
    await Service.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
} 