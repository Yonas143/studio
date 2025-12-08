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
import { Phone, MessageSquare } from 'lucide-react';

export function ContactPopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Show immediately after 1 minute, and then every 1 minute after closing?
        // The user said "every 1 min".
        // Let's set an interval that opens it if it's not already open.

        const intervalId = setInterval(() => {
            if (!open) {
                setOpen(true);
            }
        }, 60000); // 60000 ms = 1 minute

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-center">Contact Us</DialogTitle>
                    <DialogDescription className="text-center text-lg mt-2">
                        For submissions, please contact us via WhatsApp or Telegram.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 mt-6">
                    <div className="flex items-center justify-center space-x-3 p-4 bg-muted/30 rounded-lg">
                        <Phone className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-wider select-all">+251 953 540 101</span>
                    </div>

                    <div className="flex items-center justify-center space-x-3 p-4 bg-muted/30 rounded-lg">
                        <Phone className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-wider select-all">+251 953 540 102</span>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-muted-foreground mt-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">Available on WhatsApp & Telegram</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Button onClick={() => setOpen(false)} className="w-full sm:w-auto px-8">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
