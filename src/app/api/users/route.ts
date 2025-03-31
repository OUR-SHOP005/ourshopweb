import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs';

// Get all users or a specific user
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    
    // Check authentication and authorization
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get current user's metadata to check if they're an admin
    const currentUser = await clerkClient.users.getUser(userId);
    const isAdmin = currentUser.publicMetadata?.role === 'admin' || currentUser.publicMetadata?.role === 'main_admin';
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    // If a specific user is requested, return that user
    if (targetUserId) {
      const user = await clerkClient.users.getUser(targetUserId);
      return NextResponse.json({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.publicMetadata?.role || 'user',
        createdAt: user.createdAt
      });
    }
    
    // Get all users
    const userList = await clerkClient.users.getUserList({
      limit: 100, // Adjust as needed
    });
    
    // Format users for response
    const formattedUsers = userList.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.publicMetadata?.role || 'user',
      createdAt: user.createdAt
    }));
    
    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// Update user (set role)
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    const { targetUserId, role } = await request.json();
    
    // Check authentication and authorization
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get current user's metadata to check if they're a main admin
    const currentUser = await clerkClient.users.getUser(userId);
    const isMainAdmin = currentUser.publicMetadata?.role === 'main_admin';
    
    // Only main_admin can set roles
    if (!isMainAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only main admin can set user roles' },
        { status: 403 }
      );
    }
    
    // Validate role
    if (!['user', 'admin', 'main_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role value' },
        { status: 400 }
      );
    }
    
    // Get target user
    const targetUser = await clerkClient.users.getUser(targetUserId);
    
    // Don't allow changing role of another main_admin
    if (targetUser.publicMetadata?.role === 'main_admin' && role !== 'main_admin') {
      return NextResponse.json(
        { error: 'Cannot change the role of another main admin' },
        { status: 403 }
      );
    }
    
    // Update user's role
    await clerkClient.users.updateUser(targetUserId, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        role
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `User role updated to ${role}` 
    });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    
    // Check authentication and authorization
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Get current user's metadata to check if they're a main admin
    const currentUser = await clerkClient.users.getUser(userId);
    const isMainAdmin = currentUser.publicMetadata?.role === 'main_admin';
    
    // Only main_admin can delete users
    if (!isMainAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only main admin can delete users' },
        { status: 403 }
      );
    }
    
    // Get target user to check if they're a main_admin
    const targetUser = await clerkClient.users.getUser(targetUserId);
    
    // Don't allow deleting another main_admin
    if (targetUser.publicMetadata?.role === 'main_admin' && targetUserId !== userId) {
      return NextResponse.json(
        { error: 'Cannot delete another main admin' },
        { status: 403 }
      );
    }
    
    // Delete user
    await clerkClient.users.deleteUser(targetUserId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
} 