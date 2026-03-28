'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function SubmissionCountdown() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [mounted, setMounted] = useState(false);

    // Calculate end date (April 14, 2026)
    const getEndDate = () => {
        return new Date('2026-04-14T23:59:59');
    };

    useEffect(() => {
        setMounted(true);
        const endDate = getEndDate();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;

            if (distance < 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    const endDate = getEndDate();
    const formattedEndDate = endDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 shadow-xl">
                <CardContent className="p-8">
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <h3 className="font-headline text-2xl font-bold text-primary">Launching Date</h3>
                        </div>
                        <p className="text-muted-foreground">
                            The award ceremony launches on <span className="font-bold text-foreground text-xl">{formattedEndDate}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background/50 border border-border/50 backdrop-blur-sm">
                            <div className="text-4xl md:text-5xl font-bold font-headline text-primary mb-1">
                                {timeLeft.days}
                            </div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wide">Days</div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background/50 border border-border/50 backdrop-blur-sm">
                            <div className="text-4xl md:text-5xl font-bold font-headline text-primary mb-1">
                                {String(timeLeft.hours).padStart(2, '0')}
                            </div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wide">Hours</div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background/50 border border-border/50 backdrop-blur-sm">
                            <div className="text-4xl md:text-5xl font-bold font-headline text-primary mb-1">
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wide">Minutes</div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background/50 border border-border/50 backdrop-blur-sm">
                            <div className="text-4xl md:text-5xl font-bold font-headline text-primary mb-1">
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wide">Seconds</div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Countdown to the Cultural Ambassador Award launch</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
