'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

export interface PopupContent {
    type: 'video' | 'image' | 'text';
    title?: string;
    description?: string;
    videoUrl?: string; // YouTube embed URL or local .mp4
    imageUrl?: string;
    imageLink?: string;
    autoCloseSeconds?: number;
}

interface AnnouncementPopupProps {
    content: PopupContent;
    showOnLoad?: boolean;
    delaySeconds?: number;
    storageKey?: string;
}

export function AnnouncementPopup({
    content,
    showOnLoad = true,
    delaySeconds = 1,
    storageKey = 'announcement-popup-seen',
}: AnnouncementPopupProps) {
    const [open, setOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        // Check if user has opted out
        const hasSeenPopup = localStorage.getItem(storageKey);
        if (hasSeenPopup === 'true') {
            return;
        }

        if (showOnLoad) {
            const timer = setTimeout(() => {
                setOpen(true);
            }, delaySeconds * 1000);

            return () => clearTimeout(timer);
        }
    }, [showOnLoad, delaySeconds, storageKey]);

    useEffect(() => {
        if (open && content.autoCloseSeconds) {
            const timer = setTimeout(() => {
                handleClose();
            }, content.autoCloseSeconds * 1000);

            return () => clearTimeout(timer);
        }
    }, [open, content.autoCloseSeconds]);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem(storageKey, 'true');
        }
        setOpen(false);
    };

    const renderContent = () => {
        switch (content.type) {
            case 'video':
                return (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                        {content.videoUrl?.includes('youtube.com') || content.videoUrl?.includes('youtu.be') ? (
                            <iframe
                                src={content.videoUrl}
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={content.videoUrl}
                                controls
                                autoPlay
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                );

            case 'image':
                return (
                    <div className="relative w-full overflow-hidden rounded-lg">
                        {content.imageLink ? (
                            <a href={content.imageLink} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={content.imageUrl}
                                    alt={content.title || 'Announcement'}
                                    className="w-full h-auto transition-transform hover:scale-105"
                                />
                            </a>
                        ) : (
                            <img
                                src={content.imageUrl}
                                alt={content.title || 'Announcement'}
                                className="w-full h-auto"
                            />
                        )}
                    </div>
                );

            case 'text':
                return (
                    <div className="space-y-4">
                        {content.description && (
                            <p className="text-muted-foreground leading-relaxed">{content.description}</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    {content.title && <DialogTitle className="font-headline text-2xl">{content.title}</DialogTitle>}
                    {content.type === 'text' && content.description && (
                        <DialogDescription>{content.description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="mt-4">{renderContent()}</div>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="dont-show"
                            checked={dontShowAgain}
                            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                        />
                        <label
                            htmlFor="dont-show"
                            className="text-sm text-muted-foreground cursor-pointer select-none"
                        >
                            Don't show this again
                        </label>
                    </div>
                    <Button onClick={handleClose} variant="outline">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
