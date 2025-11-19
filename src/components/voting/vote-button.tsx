'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteButtonProps {
    nomineeId: string;
    nomineeName: string;
    voteCount?: number;
    className?: string;
}

export function VoteButton({ nomineeId, nomineeName, voteCount = 0, className }: VoteButtonProps) {
    const [hasVoted, setHasVoted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingVote, setIsCheckingVote] = useState(true);
    const [currentVoteCount, setCurrentVoteCount] = useState(voteCount);

    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();

    // Check if user has already voted for this nominee
    useEffect(() => {
        const checkVoteStatus = async () => {
            if (!user) {
                setIsCheckingVote(false);
                return;
            }

            try {
                const votesRef = collection(firestore, 'votes');
                const q = query(votesRef, where('userId', '==', user.uid), where('nomineeId', '==', nomineeId));
                const querySnapshot = await getDocs(q);
                setHasVoted(!querySnapshot.empty);
            } catch (error) {
                console.error('Error checking vote status:', error);
            } finally {
                setIsCheckingVote(false);
            }
        };

        checkVoteStatus();
    }, [user, nomineeId, firestore]);

    const handleVote = async () => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Login Required',
                description: 'Please log in to vote for nominees.',
            });
            return;
        }

        setIsLoading(true);

        try {
            if (hasVoted) {
                // Remove vote
                const votesRef = collection(firestore, 'votes');
                const q = query(votesRef, where('userId', '==', user.uid), where('nomineeId', '==', nomineeId));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    await deleteDoc(querySnapshot.docs[0].ref);
                    setHasVoted(false);
                    setCurrentVoteCount(prev => Math.max(0, prev - 1));
                    toast({
                        title: 'Vote Removed',
                        description: `Your vote for ${nomineeName} has been removed.`,
                    });
                }
            } else {
                // Add vote
                const voteId = `${user.uid}_${nomineeId}`;
                const voteRef = doc(firestore, 'votes', voteId);

                await setDoc(voteRef, {
                    userId: user.uid,
                    nomineeId: nomineeId,
                    createdAt: serverTimestamp(),
                });

                setHasVoted(true);
                setCurrentVoteCount(prev => prev + 1);
                toast({
                    title: 'Vote Recorded',
                    description: `You voted for ${nomineeName}!`,
                });
            }
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

    if (isCheckingVote) {
        return (
            <Button disabled className={className}>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
            </Button>
        );
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Button
                onClick={handleVote}
                disabled={isLoading}
                variant={hasVoted ? 'default' : 'outline'}
                className={cn(
                    "font-bold transition-all",
                    hasVoted && "bg-red-500 hover:bg-red-600 text-white"
                )}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {hasVoted ? 'Removing...' : 'Voting...'}
                    </>
                ) : (
                    <>
                        <Heart className={cn("mr-2 h-4 w-4", hasVoted && "fill-current")} />
                        {hasVoted ? 'Remove Vote' : 'Vote Now'}
                    </>
                )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
                {currentVoteCount} {currentVoteCount === 1 ? 'vote' : 'votes'}
            </p>
        </div>
    );
}
