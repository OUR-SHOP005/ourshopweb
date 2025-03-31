'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { Navigation } from '../../components/Navigation'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;  // changed from imageUrl to image
  category: string;
  slug: string;   // added slug field
  liveUrl?: string; // URL to view the live project
  status: 'draft' | 'published';
}

interface Ad {
  _id: string;
  title: string;
  content: string;
  position: 'top' | 'sidebar' | 'bottom' | 'banner';
  status: 'active' | 'inactive';
  startDate: string;
  endDate: string;
}

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'main_admin' | 'admin' | 'user';
  createdAt: string;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  price: string;
  featured: boolean;
  status: 'active' | 'inactive';
}

interface Settings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  maintenanceMode: boolean;
  lastUpdated?: Date;
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [services, setServices] = useState<Service[]>([])
  
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddAd, setShowAddAd] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddService, setShowAddService] = useState(false)
  const [showMessageDetails, setShowMessageDetails] = useState<string | null>(null)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [isEmailServiceConfigured, setIsEmailServiceConfigured] = useState<boolean | null>(null)
  
  const [newProject, setNewProject] = useState<Partial<Project>>({})
  const [newAd, setNewAd] = useState<Partial<Ad>>({})
  const [newUser, setNewUser] = useState<Partial<User>>({})
  const [newService, setNewService] = useState<Partial<Service>>({})
  const [isMainAdmin, setIsMainAdmin] = useState(false)
  
  // New state variables for edit functionality
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingAdId, setEditingAdId] = useState<string | null>(null)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [editAd, setEditAd] = useState<Ad | null>(null)
  const [editService, setEditService] = useState<Service | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState<{type: string, id: string} | null>(null)
  
  // Marketing Emails state
  const [marketingEmailSubject, setMarketingEmailSubject] = useState('')
  const [marketingEmailContent, setMarketingEmailContent] = useState('')
  const [isTestMode, setIsTestMode] = useState(true)
  const [isSendingMarketingEmail, setIsSendingMarketingEmail] = useState(false)
  const [marketingEmailStatus, setMarketingEmailStatus] = useState<{success: boolean, message: string} | null>(null)
  const [consentingUsers, setConsentingUsers] = useState<{userId: string, email: string}[]>([])
  const [isLoadingConsentingUsers, setIsLoadingConsentingUsers] = useState(false)
  
  const [settings, setSettings] = useState<Settings>({
    siteName: 'OURSHOP',
    siteDescription: 'Modern Web Design Agency',
    contactEmail: 'contact@ourshop.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main Street, City, Country',
    maintenanceMode: false
  });
  
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaveStatus, setSettingsSaveStatus] = useState<{success: boolean, message: string} | null>(null);
  
  // This useEffect handles the initial loading and authentication
  useEffect(() => {
    console.log('Admin page mounted');
    console.log('isLoaded:', isLoaded, 'user:', user?.id);
    
    if (isLoaded && !user) {
      console.log('User not authenticated, redirecting to sign-in');
      router.push('/sign-in');
      return;
    }

    if (isLoaded && user) {
      // Check user's admin status
      const userRole = user.publicMetadata?.role as string;
      console.log('User role:', userRole);
      
      if (userRole !== 'admin' && userRole !== 'main_admin') {
        console.log('User is not an admin, redirecting to home');
        router.push('/');
        return;
      }
      
      setIsMainAdmin(userRole === 'main_admin');
      
      // Log current URL for debugging
      console.log('Current URL:', window.location.href);
      console.log('URL search params:', window.location.search);
      
      // Initialize data once we know the user is an admin
      loadRealData();
    }
  }, [isLoaded, user, router]);
  
  // This useEffect runs once on mount to set the active tab from URL
  useEffect(() => {
    if (isLoaded && user) {
      // Use searchParams from next/navigation
      const tabParam = searchParams.get('tab');
      console.log('Tab from URL through searchParams:', tabParam);
      
      if (tabParam && ['overview', 'projects', 'ads', 'users', 'inbox', 'services', 'marketing', 'settings'].includes(tabParam)) {
        console.log('Setting active tab from URL:', tabParam);
        setActiveTab(tabParam);
        
        // If inbox tab, fetch messages immediately
        if (tabParam === 'inbox') {
          console.log('Fetching messages for inbox tab');
          fetchMessages();
        }
      } else {
        // If no valid tab in URL, set default and update URL
        console.log('No valid tab in URL, setting default to overview');
        setActiveTab('overview');
        router.replace('/admin?tab=overview', { scroll: false });
      }
    }
  }, [isLoaded, user, searchParams, router]);
  
  // This useEffect handles tab changes and updates the URL
  useEffect(() => {
    if (isLoaded && user && activeTab) {
      console.log('Tab changed to:', activeTab);
      // Use history API to avoid full page reloads
      window.history.replaceState({}, '', `/admin?tab=${activeTab}`);
    }
  }, [activeTab, isLoaded, user]);
  
  // Function to load real data from APIs
  const loadRealData = async () => {
    console.log('Loading real data from APIs');
    try {
      // Fetch projects
      const projectsRes = await fetch('/api/projects?admin=true');
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }
      
      // Fetch ads
      const adsRes = await fetch('/api/ads?admin=true');
      if (adsRes.ok) {
        const adsData = await adsRes.json();
        setAds(adsData);
      }
      
      // Fetch services
      const servicesRes = await fetch('/api/services?admin=true');
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      }
      
      // Fetch messages
      fetchMessages();
      
      // Fetch users from the API
      try {
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (userError) {
        console.error('Error fetching users:', userError);
        // Fallback to mock users if API fails
        setUsers([
          {
            id: '1',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            createdAt: '2024-03-01'
          }
        ]);
      }
      
      // Also fetch settings
      fetchSettings();
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to mock data if APIs fail
      console.log('API loading failed, falling back to mock data');
      // Set default project data
      setProjects([
        {
          _id: '1',
          title: 'Sample Project',
          description: 'This is a sample project',
          image: '/images/sample.jpg',
          category: 'Web Design',
          slug: 'web-design',
          status: 'published'
        }
      ]);
      
      // Set default ad data
      setAds([
        {
          _id: '1',
          title: 'Sample Ad',
          content: 'This is a sample advertisement',
          position: 'top',
          status: 'active',
          startDate: '2024-03-01',
          endDate: '2024-04-01'
        }
      ]);
      
      // Set default service data
      setServices([
        {
          _id: '1',
          title: 'Web Design',
          description: 'Custom website design tailored to your business needs.',
          price: '$999',
          featured: true,
          status: 'active'
        },
        {
          _id: '2',
          title: 'Logo Design',
          description: 'Professional logo design to establish your brand identity.',
          price: '$299',
          featured: false,
          status: 'active'
        }
      ]);
    }
  };

  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to mock data
      setMessages([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Project Inquiry',
          message: 'I am interested in your web design services. Can you please provide more details about your packages and pricing?',
          read: false,
          createdAt: '2024-03-10T00:00:00.000Z',
          updatedAt: '2024-03-10T00:00:00.000Z'
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Support Request',
          message: 'I need help with my current website. It is not loading properly on mobile devices.',
          read: true,
          createdAt: '2024-03-08T00:00:00.000Z',
          updatedAt: '2024-03-08T00:00:00.000Z'
        }
      ]);
    }
  };

  // Function to mark a message as read/unread
  const markMessageAsRead = async (id: string, isRead: boolean = true) => {
    try {
      console.log(`Marking message ${id} as ${isRead ? 'read' : 'unread'}`);
      
      const response = await fetch(`/api/contact`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, read: isRead }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update message');
      }
      
      // Update messages in state
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, read: isRead } : msg
      ));
      
      // If marking as read, show message details
      if (isRead) {
        setShowMessageDetails(id);
        console.log('Set showMessageDetails to:', id);
      } else if (showMessageDetails === id) {
        // If marking the current message as unread, stay on the message details
        console.log('Keeping message details open while marking as unread');
      }
      
      console.log(`Message marked as ${isRead ? 'read' : 'unread'}`);
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message status. Please try again.');
    }
  };

  // Function to delete a message
  const deleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
      
      // Remove message from state
      setMessages(messages.filter(msg => msg._id !== id));
      
      // If this was the selected message, clear selection
      if (showMessageDetails === id) {
        setShowMessageDetails(null);
      }
      
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message. Please try again.');
    }
  };

  // Add effect to load messages when inbox tab is active
  useEffect(() => {
    if (activeTab === 'inbox') {
      fetchMessages();
    }
  }, [activeTab]);

  const handleAddProject = async () => {
    // Validate form fields
    if (!newProject.title || !newProject.description || !newProject.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          category: newProject.category,
          image: newProject.image,
          liveUrl: newProject.liveUrl, // Add live URL field
          status: newProject.status || 'draft'
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects([...projects, data]);
        console.log('Project added:', data);
        setShowAddProject(false);
        setNewProject({});
      } else {
        const error = await response.json();
        alert(`Error adding project: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again.');
    }
  }

  // Function to start editing a project
  const startEditingProject = (projectId: string) => {
    const projectToEdit = projects.find(p => p._id === projectId);
    if (projectToEdit) {
      setEditProject({...projectToEdit});
      setEditingProjectId(projectId);
    }
  }

  // Function to save edited project
  const saveEditedProject = async () => {
    if (!editProject) return;
    
    // Validate form fields
    if (!editProject.title || !editProject.description || !editProject.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch(`/api/projects?id=${editingProjectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editProject.title,
          description: editProject.description,
          category: editProject.category,
          image: editProject.image,
          liveUrl: editProject.liveUrl, // Add live URL field
          status: editProject.status
        }),
      });
      
      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(projects.map(p => p._id === editingProjectId ? updatedProject : p));
        console.log('Project updated:', updatedProject);
        setEditingProjectId(null);
        setEditProject(null);
      } else {
        const error = await response.json();
        alert(`Error updating project: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  }

  // Function to cancel project editing
  const cancelEditingProject = () => {
    setEditingProjectId(null);
    setEditProject(null);
  }

  // Function to delete a project
  const deleteProject = (projectId: string) => {
    setShowConfirmDelete({type: 'project', id: projectId});
  }

  const handleAddAd = async () => {
    // Validate form fields
    if (!newAd.title || !newAd.content || !newAd.startDate || !newAd.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAd.title,
          content: newAd.content,
          position: newAd.position || 'top',
          status: newAd.status || 'active',
          startDate: newAd.startDate,
          endDate: newAd.endDate
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAds([...ads, data]);
        console.log('Ad added:', data);
        setShowAddAd(false);
        setNewAd({});
      } else {
        const error = await response.json();
        alert(`Error adding advertisement: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding advertisement:', error);
      alert('Failed to add advertisement. Please try again.');
    }
  }

  // Function to start editing an ad
  const startEditingAd = (adId: string) => {
    const adToEdit = ads.find(a => a._id === adId);
    if (adToEdit) {
      setEditAd({...adToEdit});
      setEditingAdId(adId);
    }
  }

  // Function to save edited ad
  const saveEditedAd = async () => {
    if (!editAd) return;
    
    // Validate form fields
    if (!editAd.title || !editAd.content || !editAd.startDate || !editAd.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch(`/api/ads?id=${editingAdId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editAd.title,
          content: editAd.content,
          position: editAd.position,
          status: editAd.status,
          startDate: editAd.startDate,
          endDate: editAd.endDate
        }),
      });
      
      if (response.ok) {
        const updatedAd = await response.json();
        setAds(ads.map(a => a._id === editingAdId ? updatedAd : a));
        console.log('Ad updated:', updatedAd);
        setEditingAdId(null);
        setEditAd(null);
      } else {
        const error = await response.json();
        alert(`Error updating advertisement: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating advertisement:', error);
      alert('Failed to update advertisement. Please try again.');
    }
  }

  // Function to cancel ad editing
  const cancelEditingAd = () => {
    setEditingAdId(null);
    setEditAd(null);
  }

  // Function to delete an ad
  const deleteAd = (adId: string) => {
    setShowConfirmDelete({type: 'ad', id: adId});
  }

  const handleAddUser = async () => {
    console.log('Adding user:', newUser);
    
    if (!newUser.email) {
      alert('Email is required');
      return;
    }
    
    try {
      // Note: This is a placeholder. In a real implementation, you would need to:
      // 1. Create a user in Clerk with their API
      // 2. Then assign them a role using your API
      
      // Display a success message (this should be replaced with actual API call)
      alert(`In a production app, this would create a new user:
      
Name: ${newUser.firstName || ''} ${newUser.lastName || ''}
Email: ${newUser.email}
Role: ${newUser.role || 'admin'}
    
Implementation note: Creating users requires Clerk API integration which requires setting up webhooks and additional server routes.`);
      
      setShowAddUser(false);
      setNewUser({});
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. ' + (error as Error).message);
    }
  }

  const handleAddService = async () => {
    // Validate form fields
    if (!newService.title || !newService.description || !newService.price) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newService.title,
          description: newService.description,
          price: newService.price,
          featured: newService.featured || false,
          status: newService.status || 'active'
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices([...services, data]);
        console.log('Service added:', data);
        setShowAddService(false);
        setNewService({});
      } else {
        const error = await response.json();
        alert(`Error adding service: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service. Please try again.');
    }
  }

  // Function to start editing a service
  const startEditingService = (serviceId: string) => {
    const serviceToEdit = services.find(s => s._id === serviceId);
    if (serviceToEdit) {
      setEditService({...serviceToEdit});
      setEditingServiceId(serviceId);
    }
  }

  // Function to save edited service
  const saveEditedService = async () => {
    if (!editService) return;
    
    // Validate form fields
    if (!editService.title || !editService.description || !editService.price) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch(`/api/services?id=${editingServiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editService.title,
          description: editService.description,
          price: editService.price,
          featured: editService.featured,
          status: editService.status
        }),
      });
      
      if (response.ok) {
        const updatedService = await response.json();
        setServices(services.map(s => s._id === editingServiceId ? updatedService : s));
        console.log('Service updated:', updatedService);
        setEditingServiceId(null);
        setEditService(null);
      } else {
        const error = await response.json();
        alert(`Error updating service: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service. Please try again.');
    }
  }

  // Function to cancel service editing
  const cancelEditingService = () => {
    setEditingServiceId(null);
    setEditService(null);
  }

  // Function to delete a service
  const deleteService = (serviceId: string) => {
    setShowConfirmDelete({type: 'service', id: serviceId});
  }

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    console.log('Updating user role:', userId, newRole);
    
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: userId,
          role: newRole
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User role updated:', data);
        
        // Update the users list
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, role: newRole } 
            : user
        ));
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role. ' + (error as Error).message);
    }
  }

  const handleReply = async (recipientEmail: string, subject: string) => {
    setShowReplyForm(true);
    
    // Check if email service is configured
    try {
      const response = await fetch('/api/contact/reply/check');
      if (response.ok) {
        const data = await response.json();
        setIsEmailServiceConfigured(data.configured);
        
        if (!data.configured) {
          console.warn('Email service is not configured:', data.message);
        }
      }
    } catch (error) {
      console.error('Error checking email service:', error);
      setIsEmailServiceConfigured(false);
    }
  }
  
  const sendReply = async (recipientEmail: string, subject: string) => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }
    
    try {
      // Call the API to send the email reply
      const response = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail,
          subject,
          message: replyMessage,
          senderName: user?.fullName || 'Admin'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to send email');
      }
      
      console.log('Email sent successfully:', data);
      
      alert(`Email sent to ${recipientEmail} successfully!`);
      setShowReplyForm(false);
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Failed to send email: ${(error as Error).message}`);
    }
  };

  // Function to confirm deletion of any entity
  const confirmDelete = async () => {
    if (!showConfirmDelete) return;
    
    const { type, id } = showConfirmDelete;
    
    try {
      let url = '';
      let updaterFunction;
      
      switch (type) {
        case 'project':
          url = `/api/projects?id=${id}`;
          updaterFunction = () => setProjects(projects.filter(p => p._id !== id));
          break;
        case 'ad':
          url = `/api/ads?id=${id}`;
          updaterFunction = () => setAds(ads.filter(a => a._id !== id));
          break;
        case 'service':
          url = `/api/services?id=${id}`;
          updaterFunction = () => setServices(services.filter(s => s._id !== id));
          break;
        case 'message':
          // Not implemented with real API yet
          updaterFunction = () => setMessages(messages.filter(m => m._id !== id));
          break;
        case 'user':
          // Not implemented with real API yet
          updaterFunction = () => setUsers(users.filter(u => u.id !== id));
          break;
        default:
          throw new Error(`Unknown delete type: ${type}`);
      }
      
      if (url) {
        const response = await fetch(url, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete');
        }
      }
      
      // Update state to remove the deleted item
      updaterFunction();
      console.log(`${type} deleted:`, id);
      
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Failed to delete ${type}. Please try again.`);
    } finally {
      setShowConfirmDelete(null);
    }
  }

  // Function to delete a user
  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }
      
      const data = await response.json();
      console.log('User deleted:', data);
      
      // Remove user from state
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. ' + (error as Error).message);
    }
  }

  // Add function to fetch consenting users
  const fetchConsentingUsers = async () => {
    if (activeTab !== 'marketing') return;
    
    setIsLoadingConsentingUsers(true);
    try {
      const response = await fetch('/api/marketing-consent?admin=true', {
        method: 'PUT'
      });
      
      if (response.ok) {
        const data = await response.json();
        setConsentingUsers(data.users || []);
      } else {
        throw new Error('Failed to fetch consenting users');
      }
    } catch (error) {
      console.error('Error fetching consenting users:', error);
    } finally {
      setIsLoadingConsentingUsers(false);
    }
  };

  // Add effect to load consenting users when marketing tab is active
  useEffect(() => {
    if (activeTab === 'marketing') {
      fetchConsentingUsers();
    }
  }, [activeTab]);

  // Function to send marketing email
  const sendMarketingEmail = async () => {
    // Validate inputs
    if (!marketingEmailSubject.trim() || !marketingEmailContent.trim()) {
      setMarketingEmailStatus({
        success: false,
        message: 'Please fill in both subject and content'
      });
      return;
    }
    
    setIsSendingMarketingEmail(true);
    setMarketingEmailStatus(null);
    
    try {
      const response = await fetch('/api/marketing-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: marketingEmailSubject,
          content: marketingEmailContent,
          testMode: isTestMode
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMarketingEmailStatus({
          success: true,
          message: data.message
        });
        
        if (!isTestMode) {
          // Clear form if not in test mode and successful
          setMarketingEmailSubject('');
          setMarketingEmailContent('');
        }
      } else {
        setMarketingEmailStatus({
          success: false,
          message: data.message || 'Failed to send marketing email'
        });
      }
    } catch (error) {
      console.error('Error sending marketing email:', error);
      setMarketingEmailStatus({
        success: false,
        message: `Error: ${(error as Error).message}`
      });
    } finally {
      setIsSendingMarketingEmail(false);
    }
  };

  // This useEffect helps debug showMessageDetails changes
  useEffect(() => {
    console.log('showMessageDetails changed to:', showMessageDetails);
  }, [showMessageDetails]);

  // Add effect to handle message view status updates
  useEffect(() => {
    if (activeTab === 'inbox' && showMessageDetails) {
      console.log('Should be showing message details for:', showMessageDetails);
      // Ensure message exists in state
      const messageExists = messages.some(m => m._id === showMessageDetails);
      if (!messageExists) {
        console.warn('Message not found in state, clearing selection');
        setShowMessageDetails(null);
      }
    }
  }, [activeTab, showMessageDetails, messages]);

  // Function to load site settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Settings already initialized with defaults
    }
  };

  // Add effect to load settings when settings tab is active
  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab]);
  
  // Function to save settings
  const saveSettings = async () => {
    if (!user || !isLoaded) {
      setSettingsSaveStatus({
        success: false,
        message: 'You must be logged in to save settings'
      });
      return;
    }
    
    setIsSavingSettings(true);
    setSettingsSaveStatus(null);
    
    try {
      console.log('Saving settings:', settings);
      
      // Validate the settings before sending
      if (!settings.contactEmail || !settings.contactEmail.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!settings.phoneNumber) {
        throw new Error('Please enter a phone number');
      }
      
      if (!settings.address) {
        throw new Error('Please enter an address');
      }
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      console.log('Settings update response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Settings update response data:', data);
      } catch (err) {
        console.error('Error parsing response JSON:', err);
        throw new Error('Error parsing server response');
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.details || `Server error: ${response.status}`);
      }
      
      const successStatus = {
        success: true,
        message: 'Settings saved successfully'
      };
      
      setSettingsSaveStatus(successStatus);
      
      // Update settings with latest data
      if (data.settings) {
        setSettings(data.settings);
      }
      
      // Set a timeout to clear success messages after 3 seconds
      setTimeout(() => {
        setSettingsSaveStatus(prev => 
          prev && prev.success ? null : prev
        );
      }, 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setSettingsSaveStatus({
        success: false,
        message: `Error: ${(error as Error).message}`
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                Sign Out
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {['overview', 'projects', 'ads', 'inbox', 'services', 'users', 'marketing', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      console.log(`Tab clicked: ${tab}`);
                      setActiveTab(tab);
                      // Use Next.js router to update URL without full page reload
                      router.replace(`/admin?tab=${tab}`, { scroll: false });
                    }}
                    className={`${
                      activeTab === tab
                        ? 'border-secondary text-secondary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize relative cursor-pointer`}
                  >
                    {tab}
                    {tab === 'inbox' && messages.filter(m => !m.read).length > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {messages.filter(m => !m.read).length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
                    <p className="text-3xl font-bold text-secondary">{projects.length}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Active Ads</h3>
                    <p className="text-3xl font-bold text-secondary">
                      {ads.filter(ad => ad.status === 'active').length}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-secondary">{users.length}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Unread Messages</h3>
                    <p className="text-3xl font-bold text-secondary">
                      {messages.filter(message => !message.read).length}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Active Services</h3>
                    <p className="text-3xl font-bold text-secondary">
                      {services.filter(service => service.status === 'active').length}
                    </p>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Projects</h2>
                    <button
                      onClick={() => setShowAddProject(true)}
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                    >
                      Add Project
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Live URL
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {projects.map((project) => (
                          <tr key={project._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{project.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {project.liveUrl ? (
                                <a 
                                  href={project.liveUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                >
                                  {project.liveUrl}
                                </a>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => startEditingProject(project._id)} 
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteProject(project._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Edit Project Modal */}
              {editingProjectId && editProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4">Edit Project</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={editProject.title}
                          onChange={(e) => setEditProject({...editProject, title: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={editProject.description}
                          onChange={(e) => setEditProject({...editProject, description: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                          type="text"
                          value={editProject.image}
                          onChange={(e) => setEditProject({...editProject, image: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                          type="text"
                          value={editProject.category}
                          onChange={(e) => setEditProject({...editProject, category: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Live Project URL</label>
                        <input
                          type="url"
                          value={editProject.liveUrl || ''}
                          onChange={(e) => setEditProject({...editProject, liveUrl: e.target.value})}
                          placeholder="https://example.com"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          value={editProject.status}
                          onChange={(e) => setEditProject({...editProject, status: e.target.value as 'draft' | 'published'})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={cancelEditingProject}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEditedProject}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ads Tab */}
              {activeTab === 'ads' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Advertisements</h2>
                    <button
                      onClick={() => setShowAddAd(true)}
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                    >
                      Add Advertisement
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {ads.map((ad) => (
                          <tr key={ad._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{ad.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ad.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ad.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {ad.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => startEditingAd(ad._id)} 
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteAd(ad._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Edit Ad Modal */}
              {editingAdId && editAd && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4">Edit Advertisement</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={editAd.title}
                          onChange={(e) => setEditAd({...editAd, title: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <textarea
                          value={editAd.content}
                          onChange={(e) => setEditAd({...editAd, content: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Position</label>
                        <select
                          value={editAd.position}
                          onChange={(e) => setEditAd({...editAd, position: e.target.value as 'top' | 'sidebar' | 'bottom' | 'banner'})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <option value="top">Top</option>
                          <option value="sidebar">Sidebar</option>
                          <option value="bottom">Bottom</option>
                          <option value="banner">Banner (Home Page Featured)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        <input
                          type="date"
                          value={editAd.startDate}
                          onChange={(e) => setEditAd({...editAd, startDate: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                        <input
                          type="date"
                          value={editAd.endDate}
                          onChange={(e) => setEditAd({...editAd, endDate: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          value={editAd.status}
                          onChange={(e) => setEditAd({...editAd, status: e.target.value as 'active' | 'inactive'})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={cancelEditingAd}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEditedAd}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4">Confirm Delete</h2>
                    <p className="mb-6">
                      Are you sure you want to delete this {showConfirmDelete.type}? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowConfirmDelete(null)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Inbox Tab */}
              {activeTab === 'inbox' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Inbox</h2>
                    <button
                      onClick={fetchMessages}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">No messages found</p>
                    </div>
                  ) : showMessageDetails ? (
                    // Message details view
                    (() => {
                      const message = messages.find(m => m._id === showMessageDetails);
                      if (!message) {
                        console.error('Message not found:', showMessageDetails);
                        return (
                          <div className="text-center py-10">
                            <p className="text-red-500">Message not found</p>
                            <button
                              onClick={() => setShowMessageDetails(null)}
                              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
                            >
                              Back to Inbox
                            </button>
                          </div>
                        );
                      }
                      
                      return (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-semibold">{message.subject}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  From: {message.name} &lt;{message.email}&gt;
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  Received: {new Date(message.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={() => setShowMessageDetails(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                Back to Inbox
                              </button>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 py-4 mb-4">
                              <p className="whitespace-pre-line">{message.message}</p>
                            </div>
                            
                            {showReplyForm ? (
                              <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h4 className="text-lg font-medium mb-3">Reply to {message.name}</h4>

                                {isEmailServiceConfigured === false && (
                                  <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 rounded-lg text-sm">
                                    <div className="flex items-center mb-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      <span className="font-medium">Email Service Not Configured</span>
                                    </div>
                                    <p>The email service (Resend API) is not properly configured. Your reply might not be delivered to the recipient.</p>
                                    <p className="mt-1">Please add RESEND_API_KEY to your environment variables.</p>
                                  </div>
                                )}

                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1">Message</label>
                                  <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                                    rows={6}
                                    placeholder="Type your reply here..."
                                  />
                                </div>
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() => setShowReplyForm(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => sendReply(message.email, message.subject)}
                                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                                    disabled={!replyMessage.trim()}
                                  >
                                    Send Reply
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-6 flex space-x-4">
                                <button 
                                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                                  onClick={() => handleReply(message.email, message.subject)}
                                >
                                  Reply
                                </button>
                                <button 
                                  onClick={() => markMessageAsRead(message._id, false)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Mark as Unread
                                </button>
                                <button 
                                  onClick={() => deleteMessage(message._id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    // Message list view
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              From
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {messages.map((message) => (
                            <tr key={message._id} className={message.read ? '' : 'font-semibold bg-gray-50 dark:bg-gray-700/50'}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {!message.read && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    New
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{message.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{message.subject}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{new Date(message.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                  onClick={() => {
                                    console.log('Viewing message:', message._id);
                                    markMessageAsRead(message._id);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={() => deleteMessage(message._id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Services</h2>
                    <button
                      onClick={() => setShowAddService(true)}
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                    >
                      Add Service
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Featured
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {services.map((service) => (
                          <tr key={service._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{service.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{service.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                service.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {service.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {service.featured ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                  Featured
                                </span>
                              ) : 'No'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => startEditingService(service._id)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteService(service._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Edit Service Modal */}
              {editingServiceId && editService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4">Edit Service</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={editService.title}
                          onChange={(e) => setEditService({...editService, title: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={editService.description}
                          onChange={(e) => setEditService({...editService, description: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                          type="text"
                          value={editService.price}
                          onChange={(e) => setEditService({...editService, price: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={editService.featured}
                          onChange={(e) => setEditService({...editService, featured: e.target.checked})}
                          className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded dark:border-gray-600"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured Service
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          value={editService.status}
                          onChange={(e) => setEditService({...editService, status: e.target.value as 'active' | 'inactive'})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={cancelEditingService}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEditedService}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Manage Users</h2>
                    {isMainAdmin && (
                      <button
                        onClick={() => setShowAddUser(true)}
                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                      >
                        Add New Admin
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Created At
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user.firstName || user.lastName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'main_admin' 
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                  : user.role === 'admin'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.role !== 'main_admin' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                  >
                                    {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                  </button>
                                  <button 
                                    onClick={() => deleteUser(user.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add User Modal */}
              {showAddUser && isMainAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4">Add New Admin</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">First Name</label>
                          <input
                            type="text"
                            value={newUser.firstName || ''}
                            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Last Name</label>
                          <input
                            type="text"
                            value={newUser.lastName || ''}
                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={newUser.email || ''}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                          value={newUser.role || 'admin'}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' | 'main_admin' })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                          {/* Only show main_admin option if current user is main_admin */}
                          {isMainAdmin && <option value="main_admin">Main Admin</option>}
                        </select>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowAddUser(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddUser}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                        >
                          Add User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Website Settings</h2>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Configure website settings and preferences.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">General Settings</h3>
                        <div>
                          <label className="block text-sm font-medium mb-1">Site Name</label>
                          <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Site Description</label>
                          <textarea
                            value={settings.siteDescription}
                            onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="maintenanceMode"
                            checked={settings.maintenanceMode}
                            onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                            className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded dark:border-gray-600"
                          />
                          <label htmlFor="maintenanceMode" className="ml-2 block text-sm font-medium">
                            Maintenance Mode
                          </label>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        <div>
                          <label className="block text-sm font-medium mb-1">Contact Email</label>
                          <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={settings.phoneNumber}
                            onChange={(e) => setSettings({...settings, phoneNumber: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Address</label>
                          <textarea
                            value={settings.address}
                            onChange={(e) => setSettings({...settings, address: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {settingsSaveStatus && (
                      <div className={`mt-4 p-3 rounded-lg ${
                        settingsSaveStatus.success 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {settingsSaveStatus.message}
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={saveSettings}
                        disabled={isSavingSettings}
                        className={`px-4 py-2 rounded-lg ${
                          isSavingSettings
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-secondary text-white hover:bg-secondary/90 transition-colors'
                        }`}
                      >
                        {isSavingSettings ? 'Saving...' : 'Save Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Service Modal */}
              {showAddService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4">Add New Service</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={newService.title || ''}
                          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={newService.description || ''}
                          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                          type="text"
                          value={newService.price || ''}
                          onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          placeholder="$999"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="new-featured"
                          checked={newService.featured || false}
                          onChange={(e) => setNewService({ ...newService, featured: e.target.checked })}
                          className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                        />
                        <label htmlFor="new-featured" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured Service
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          value={newService.status || 'active'}
                          onChange={(e) => setNewService({ ...newService, status: e.target.value as 'active' | 'inactive' })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowAddService(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddService}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                        >
                          Add Service
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Project Modal */}
              {showAddProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={newProject.title || ''}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={newProject.description || ''}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                          type="text"
                          value={newProject.category || ''}
                          onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                          type="text"
                          value={newProject.image || ''}
                          onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Live Project URL</label>
                        <input
                          type="url"
                          value={newProject.liveUrl || ''}
                          onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                          placeholder="https://example.com"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          value={newProject.status || 'draft'}
                          onChange={(e) => setNewProject({ ...newProject, status: e.target.value as 'draft' | 'published' })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowAddProject(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddProject}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                        >
                          Add Project
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Advertisement Modal */}
              {showAddAd && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4">Add New Advertisement</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={newAd.title || ''}
                          onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <textarea
                          value={newAd.content || ''}
                          onChange={(e) => setNewAd({ ...newAd, content: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Position</label>
                        <select
                          value={newAd.position || 'top'}
                          onChange={(e) => setNewAd({ ...newAd, position: e.target.value as 'top' | 'sidebar' | 'bottom' | 'banner' })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <option value="top">Top</option>
                          <option value="sidebar">Sidebar</option>
                          <option value="bottom">Bottom</option>
                          <option value="banner">Banner (Home Page Featured)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        <input
                          type="date"
                          value={newAd.startDate || ''}
                          onChange={(e) => setNewAd({ ...newAd, startDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                        <input
                          type="date"
                          value={newAd.endDate || ''}
                          onChange={(e) => setNewAd({ ...newAd, endDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          value={newAd.status || 'active'}
                          onChange={(e) => setNewAd({ ...newAd, status: e.target.value as 'active' | 'inactive' })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowAddAd(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddAd}
                          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                        >
                          Add Advertisement
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Marketing Emails Tab */}
              {activeTab === 'marketing' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Marketing Emails</h2>
                    <button
                      onClick={fetchConsentingUsers}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Consenting Users</h3>
                      {isLoadingConsentingUsers ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                        </div>
                      ) : consentingUsers.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500 dark:text-gray-400">No users have consented to marketing emails</p>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-2 text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{consentingUsers.length}</span> user(s) have consented to receive marketing emails
                          </p>
                          <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                              {consentingUsers.map((user) => (
                                <li key={user.userId} className="py-2 px-1 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm">{user.email}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Send Marketing Email</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Subject</label>
                          <input
                            type="text"
                            value={marketingEmailSubject}
                            onChange={(e) => setMarketingEmailSubject(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                            placeholder="Enter email subject"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Content (HTML supported)</label>
                          <textarea
                            value={marketingEmailContent}
                            onChange={(e) => setMarketingEmailContent(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                            rows={10}
                            placeholder="<h1>Hello!</h1><p>Your marketing message here...</p>"
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="test-mode"
                            type="checkbox"
                            checked={isTestMode}
                            onChange={(e) => setIsTestMode(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                          />
                          <label htmlFor="test-mode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Test Mode (only sends to first user)
                          </label>
                        </div>
                        
                        {marketingEmailStatus && (
                          <div className={`p-4 rounded-lg ${
                            marketingEmailStatus.success 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {marketingEmailStatus.message}
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <button
                            onClick={sendMarketingEmail}
                            disabled={isSendingMarketingEmail || consentingUsers.length === 0}
                            className={`px-4 py-2 rounded-lg ${
                              isSendingMarketingEmail || consentingUsers.length === 0
                                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                                : 'bg-secondary hover:bg-secondary/90 text-white'
                            }`}
                          >
                            {isSendingMarketingEmail 
                              ? 'Sending...' 
                              : isTestMode 
                                ? 'Send Test Email' 
                                : 'Send to All Consenting Users'
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 