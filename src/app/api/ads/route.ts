import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Ad from '@/models/Ad';

// Initial data for seeding the database if empty
const initialAds = [
  {
    title: 'Special Offer: Website Package',
    content: 'Get a professional website with 20% discount until the end of the month.',
    position: 'top',
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
  },
  {
    title: 'E-commerce Solutions',
    content: 'Launch your online store with our specialized e-commerce packages.',
    position: 'sidebar',
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
  },
  {
    title: 'SEO Optimization Service',
    content: 'Improve your website visibility with our comprehensive SEO services.',
    position: 'bottom',
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
  },
  {
    title: 'Mobile App Development',
    content: 'Transform your business with custom mobile applications for iOS and Android.',
    position: 'top',
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
  },
  {
    title: 'Website Maintenance',
    content: 'Keep your website running smoothly with our maintenance packages.',
    position: 'sidebar',
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
  },
  {
    title: 'Premium Web Design Services',
    content: 'Our award-winning design team will create a stunning website for your business.',
    position: 'banner',
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
  },
  {
    title: 'Digital Marketing Solutions',
    content: 'Boost your online presence with our comprehensive digital marketing strategy.',
    position: 'banner',
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
  }
];

// Helper function to seed initial data
async function seedInitialData() {
  try {
    // Check if there are any ads in the database
    const count = await Ad.countDocuments();
    
    // If no ads, seed the initial data
    if (count === 0) {
      console.log('Seeding initial ads data...');
      await Ad.insertMany(initialAds);
      console.log('Initial ads data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial ads data:', error);
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
    const position = searchParams.get('position');
    const id = searchParams.get('id');
    const mostPromoted = searchParams.get('mostPromoted');
    
    // Build query based on parameters
    let query: any = {};
    
    // If ID is provided, return single ad
    if (id) {
      const ad = await Ad.findById(id);
      if (!ad) {
        return NextResponse.json(
          { error: 'Advertisement not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(ad);
    }
    
    // Filter by position if specified
    if (position) {
      query.position = position;
    }
    
    // For public API, only show active ads within date range
    if (!searchParams.get('admin')) {
      const now = new Date();
      query.status = 'active';
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    }
    
    let ads;
    
    // If mostPromoted is true, return only banner ads (limit to 1)
    if (mostPromoted === 'true') {
      query.position = 'banner';
      // Get all banner ads and return a random one
      const bannerAds = await Ad.find(query).lean();
      
      if (bannerAds.length > 0) {
        const randomIndex = Math.floor(Math.random() * bannerAds.length);
        return NextResponse.json([bannerAds[randomIndex]]);
      } else {
        return NextResponse.json([]);
      }
    } else {
      // Normal query for ads
      ads = await Ad.find(query).lean();
    }
    
    return NextResponse.json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}

// Create a new advertisement
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content || !data.position || !data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new ad
    const newAd = await Ad.create({
      title: data.title,
      content: data.content,
      position: data.position,
      status: data.status || 'active',
      startDate: data.startDate,
      endDate: data.endDate,
    });
    
    return NextResponse.json(newAd, { status: 201 });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    
    // Check for validation errors
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create advertisement' },
      { status: 500 }
    );
  }
}

// Update an existing advertisement
export async function PUT(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Advertisement ID is required' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Find the ad to update
    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    // Update the ad
    if (data.title) ad.title = data.title;
    if (data.content) ad.content = data.content;
    if (data.position) ad.position = data.position;
    if (data.status) ad.status = data.status;
    if (data.startDate) ad.startDate = data.startDate;
    if (data.endDate) ad.endDate = data.endDate;
    
    // Save the updated ad
    const updatedAd = await ad.save();
    
    return NextResponse.json(updatedAd);
  } catch (error) {
    console.error('Error updating advertisement:', error);
    
    // Check for validation errors
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update advertisement' },
      { status: 500 }
    );
  }
}

// Delete an advertisement
export async function DELETE(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Advertisement ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the ad exists
    const ad = await Ad.findById(id);
    if (!ad) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    // Delete the ad
    await Ad.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to delete advertisement' },
      { status: 500 }
    );
  }
} 