'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { Trophy, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
    nomineeId: string;
    nomineeName: string;
    category: string;
    voteCount: number;
}

interface LeaderboardProps {
    categoryFilter?: string;
    maxEntries?: number;
}

export function Leaderboard({ categoryFilter, maxEntries = 10 }: LeaderboardProps) {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const firestore = useFirestore();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Get all votes
                const votesRef = collection(firestore, 'votes');
                const votesSnapshot = await getDocs(votesRef);

                // Get all nominees
                const nomineesRef = collection(firestore, 'nominees');
                const nomineesSnapshot = await getDocs(nomineesRef);

                // Count votes per nominee
                const voteCounts = new Map<string, number>();
                votesSnapshot.forEach((doc) => {
                    const vote = doc.data();
                    const count = voteCounts.get(vote.nomineeId) || 0;
                    voteCounts.set(vote.nomineeId, count + 1);
                });

                // Build leaderboard entries
                const entries: LeaderboardEntry[] = [];
                nomineesSnapshot.forEach((doc) => {
                    const nominee = doc.data();
                    const voteCount = voteCounts.get(doc.id) || 0;

                    // Apply category filter if provided
                    if (!categoryFilter || nominee.category === categoryFilter) {
                        entries.push({
                            nomineeId: doc.id,
                            nomineeName: nominee.name,
                            category: nominee.category,
                            voteCount,
                        });
                    }
                });

                // Sort by vote count and limit
                entries.sort((a, b) => b.voteCount - a.voteCount);
                setLeaders(entries.slice(0, maxEntries));
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [firestore, categoryFilter, maxEntries]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="font-headline">Top Nominees</CardTitle>
                </div>
                <CardDescription>
                    {categoryFilter ? `Leading nominees in ${categoryFilter}` : 'Current voting leaders across all categories'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div>
                                        <Skeleton className="h-4 w-32 mb-1" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-16" />
                            </div>
                        ))}
                    </div>
                ) : leaders.length > 0 ? (
                    <div className="space-y-3">
                        {leaders.map((entry, index) => (
                            <Link
                                key={entry.nomineeId}
                                href={`/nominees/${entry.nomineeId}`}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-500 text-white' :
                                            index === 1 ? 'bg-gray-400 text-white' :
                                                index === 2 ? 'bg-amber-600 text-white' :
                                                    'bg-muted text-muted-foreground'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold group-hover:text-primary transition-colors">
                                            {entry.nomineeName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{entry.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="font-bold text-lg">{entry.voteCount}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No votes yet. Be the first to vote!</p>
                    </div>
                )}
                {!isLoading && leaders.length > 0 && (
                    <div className="mt-4 text-center">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/nominees">View All Nominees</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
