'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

interface AdConfig {
    imageUrl: string;
    linkUrl: string;
    active: boolean;
}

interface AdsData {
    leftAd: AdConfig;
    rightAd: AdConfig;
}

export function BottomAdBanner() {
    const [ads, setAds] = useState<AdsData | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        fetch('/api/ads')
            .then(r => r.json())
            .then(data => setAds(data))
            .catch(() => {});
    }, []);

    if (!ads || dismissed) return null;

    const hasActive = ads.leftAd.active || ads.rightAd.active;
    if (!hasActive) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t shadow-lg">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 justify-center">
                    {ads.leftAd.active && ads.leftAd.imageUrl && (
                        <Link href={ads.leftAd.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="shrink-0">
                            <div className="relative h-16 w-48">
                                <Image src={ads.leftAd.imageUrl} alt="Advertisement" fill className="object-contain" unoptimized />
                            </div>
                        </Link>
                    )}
                    {ads.rightAd.active && ads.rightAd.imageUrl && (
                        <Link href={ads.rightAd.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="shrink-0">
                            <div className="relative h-16 w-48">
                                <Image src={ads.rightAd.imageUrl} alt="Advertisement" fill className="object-contain" unoptimized />
                            </div>
                        </Link>
                    )}
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="shrink-0 p-1 rounded-full hover:bg-muted text-muted-foreground"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
