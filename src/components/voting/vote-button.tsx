'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { PaymentModal } from './payment-modal';

interface VoteButtonProps {
    nomineeId: string;
    nomineeName: string;
    voteCount?: number;
    className?: string;
}

export function VoteButton({ nomineeId, nomineeName, voteCount = 0, className }: VoteButtonProps) {
    const [hasVoted, setHasVoted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [currentVoteCount, setCurrentVoteCount] = useState(voteCount);
    const [fingerprint, setFingerprint] = useState<string | undefined>();
    const { toast } = useToast();

    useEffect(() => {
        // Check local storage for vote status
        const votedNominees = JSON.parse(localStorage.getItem('votedNominees') || '[]');
        if (votedNominees.includes(nomineeId)) {
            setHasVoted(true);
        }

        // Initialize fingerprint
        const initFingerprint = async () => {
            try {
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                setFingerprint(result.visitorId);
            } catch (error) {
                console.error('Fingerprint error:', error);
            }
        };
        initFingerprint();
    }, [nomineeId]);

    // Check for successful payment return
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentSuccess = urlParams.get('payment_success');
        const votedFor = urlParams.get('voted_for');

        if (paymentSuccess === 'true' && votedFor === nomineeId) {
            setHasVoted(true);
            setCurrentVoteCount(prev => prev + 1);

            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete('payment_success');
            url.searchParams.delete('voted_for');
            window.history.replaceState({}, '', url.toString());

            toast({
                title: 'Vote Recorded!',
                description: `Thank you for voting for ${nomineeName}!`,
            });
        }
    }, [nomineeId, nomineeName, toast]);

    const handleVoteClick = () => {
        if (hasVoted) {
            toast({
                title: 'Already Voted',
                description: `You have already voted for ${nomineeName}.`,
            });
            return;
        }
        setShowPayment(true);
    };

    return (
        <>
            <div className={cn("flex flex-col gap-2", className)}>
                <Button
                    onClick={handleVoteClick}
                    disabled={isLoading}
                    variant={hasVoted ? 'default' : 'outline'}
                    className={cn(
                        "font-bold transition-all",
                        hasVoted && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : hasVoted ? (
                        <>
                            <Heart className="mr-2 h-4 w-4 fill-current" />
                            Voted
                        </>
                    ) : (
                        <>
                            <Heart className="mr-2 h-4 w-4" />
                            Vote Now
                        </>
                    )}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                    {currentVoteCount} {currentVoteCount === 1 ? 'vote' : 'votes'}
                </p>
            </div>

            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                nomineeId={nomineeId}
                nomineeName={nomineeName}
                fingerprint={fingerprint}
            />
        </>
    );
}
