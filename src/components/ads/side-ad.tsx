'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SideAdProps {
  side: 'left' | 'right';
  className?: string;
}

interface AdConfig {
  imageUrl: string;
  linkUrl: string;
  active: boolean;
}

export function SideAd({ side, className }: SideAdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [adConfig, setAdConfig] = useState<AdConfig | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch('/api/ads');
        if (res.ok) {
          const data = await res.json();
          const config = side === 'left' ? data.leftAd : data.rightAd;
          setAdConfig(config);
        }
      } catch (error) {
        console.error('Failed to fetch ads:', error);
      }
    };

    fetchAds();
  }, [side]);

  if (!isVisible || !adConfig || !adConfig.active || !adConfig.imageUrl) return null;

  return (
    <div
      className={cn(
        'fixed top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col gap-2',
        side === 'left' ? 'left-4' : 'right-4',
        className
      )}
    >
      <div className="relative w-[160px] h-[600px] bg-secondary/20 border border-border/50 rounded-lg overflow-hidden backdrop-blur-sm flex flex-col items-center justify-center text-center shadow-lg transition-all hover:bg-secondary/30 group">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 rounded-full bg-background/50 hover:bg-background text-muted-foreground hover:text-foreground transition-colors z-10 opacity-0 group-hover:opacity-100"
          aria-label="Close ad"
        >
          <X size={14} />
        </button>

        <a
          href={adConfig.linkUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full h-full block"
        >
          <Image
            src={adConfig.imageUrl}
            alt="Advertisement"
            fill
            className="object-cover"
          />
        </a>
      </div>
    </div>
  );
}
