import React from 'react';
import { useLocation } from 'wouter';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="bg-white border-r border-neutral-200 w-full md:w-64 md:flex md:flex-col md:fixed md:inset-y-0">
      <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-200">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2 text-lg font-medium">Vercel Deploy</span>
        </div>
        <button 
          type="button" 
          className="md:hidden rounded-md p-2 text-neutral-500 hover:text-neutral-900 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>
      
      <nav className={`flex-1 px-2 py-4 space-y-1 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
        <a 
          href="#overview" 
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeSection === "overview" 
              ? "bg-primary-50 text-primary-700" 
              : "text-neutral-700 hover:bg-neutral-50"
          }`}
          onClick={() => handleSectionClick("overview")}
        >
          <i className="ri-dashboard-line mr-3 text-lg"></i>
          Overview
        </a>
        <a 
          href="#configuration" 
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeSection === "configuration" 
              ? "bg-primary-50 text-primary-700" 
              : "text-neutral-700 hover:bg-neutral-50"
          }`}
          onClick={() => handleSectionClick("configuration")}
        >
          <i className="ri-settings-4-line mr-3 text-lg"></i>
          Configuration
        </a>
        <a 
          href="#environment" 
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeSection === "environment" 
              ? "bg-primary-50 text-primary-700" 
              : "text-neutral-700 hover:bg-neutral-50"
          }`}
          onClick={() => handleSectionClick("environment")}
        >
          <i className="ri-file-list-3-line mr-3 text-lg"></i>
          Environment Variables
        </a>
        <a 
          href="#build" 
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeSection === "build" 
              ? "bg-primary-50 text-primary-700" 
              : "text-neutral-700 hover:bg-neutral-50"
          }`}
          onClick={() => handleSectionClick("build")}
        >
          <i className="ri-hammer-line mr-3 text-lg"></i>
          Build Settings
        </a>
        <a 
          href="#troubleshooting" 
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeSection === "troubleshooting" 
              ? "bg-primary-50 text-primary-700" 
              : "text-neutral-700 hover:bg-neutral-50"
          }`}
          onClick={() => handleSectionClick("troubleshooting")}
        >
          <i className="ri-error-warning-line mr-3 text-lg"></i>
          Troubleshooting
        </a>
      </nav>
      
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center">
            <span className="font-medium text-sm">JS</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-800">John Smith</p>
            <p className="text-xs text-neutral-500">Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
