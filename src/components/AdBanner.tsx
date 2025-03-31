'use client';

import Advertisement from './Advertisement';

interface AdBannerProps {
  position: 'top' | 'sidebar' | 'bottom' | 'banner';
}

export default function AdBanner({ position }: AdBannerProps) {
  return <Advertisement position={position} />;
} 