'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface VoteButtonProps {
    nomineeId: string;
    nomineeName: string;
    voteCount?: number;
    className?: string;
}

export function VoteButton({ nomineeId, nomineeName, voteCount = 0, className }: VoteButtonProps) {
    const [hasVoted, setHasVoted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentVoteCount, setCurrentVoteCount] = useState(voteCount);
    const { toast } = useToast();

    useEffect(() => {
        // Check local storage for vote status
        const votedNominees = JSON.parse(localStorage.getItem('votedNominees') || '[]');
        if (votedNominees.includes(nomineeId)) {
            setHasVoted(true);
        }
    }, [nomineeId]);

    const handleVote = async () => {
        setIsLoading(true);

        try {
            // Initialize fingerprint
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const fingerprint = result.visitorId;

            const response = await fetch('/api/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nomineeId,
                    fingerprint,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to vote');
            }

            // Update local state
            setHasVoted(true);
            setCurrentVoteCount(prev => prev + 1);

            // Update local storage
            const votedNominees = JSON.parse(localStorage.getItem('votedNominees') || '[]');
            if (!votedNominees.includes(nomineeId)) {
                votedNominees.push(nomineeId);
                localStorage.setItem('votedNominees', JSON.stringify(votedNominees));
            }

            toast({
                title: 'Vote Recorded',
                description: `You voted for ${nomineeName}!`,
            });
        } catch (error: any) {
            console.error('Error voting:', error);
            toast({
                variant: 'destructive',
                title: 'Vote Failed',
                description: error.message || 'Failed to record your vote. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Button
                onClick={handleVote}
                disabled={isLoading || hasVoted}
                variant={hasVoted ? 'default' : 'outline'}
                className={cn(
                    "font-bold transition-all",
                    hasVoted && "bg-primary text-primary-foreground hover:bg-primary/90 cursor-default"
                )}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Voting...
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
    );
}
