'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState } from 'react';

interface SideAdProps {
    side: 'left' | 'right';
    className?: string;
}

export function SideAd({ side, className }: SideAdProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                'fixed top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col gap-2',
                side === 'left' ? 'left-4' : 'right-4',
                className
            )}
        >
            <div className="relative w-[160px] h-[600px] bg-secondary/20 border border-border/50 rounded-lg overflow-hidden backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 shadow-lg transition-all hover:bg-secondary/30">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-background/50 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close ad"
                >
                    <X size={14} />
                </button>

                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Advertisement
                </div>

                <div className="flex-1 w-full bg-muted/50 rounded flex items-center justify-center mb-2">
                    <span className="text-muted-foreground text-sm">Ad Space {side === 'left' ? 'L' : 'R'}</span>
                </div>

                <p className="text-[10px] text-muted-foreground">
                    Place your ad here
                </p>
            </div>
        </div>
    );
}
