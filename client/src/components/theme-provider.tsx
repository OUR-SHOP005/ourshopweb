import React, { ReactNode } from 'react';

// Define the props type
interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <div style={{ backgroundColor: '#f0f0f0', color: '#333', minHeight: '100vh' }}>
      {children}
    </div>
  );
};

export default ThemeProvider;
