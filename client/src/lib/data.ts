// Type definitions for the website data
// These match the shape of data in constants.ts
export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  details: string[];
  pricing: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  category: string;
  image: string;
}

export interface Testimonial {
  name: string;
  company: string;
  image: string;
  text: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  instagram: string;
}

// Import the actual data from constants.ts
import { SERVICES, PORTFOLIO_ITEMS, TEAM_MEMBERS, TESTIMONIALS } from './constants';

// Re-export using the variable names expected by components
export const services = SERVICES;
export const portfolioItems = PORTFOLIO_ITEMS;
export const teamMembers = TEAM_MEMBERS;
export const testimonials = TESTIMONIALS;
