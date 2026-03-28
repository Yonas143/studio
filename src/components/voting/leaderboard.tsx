'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            try {
                const url = new URL('/api/leaderboard', window.location.origin);
                if (categoryFilter) url.searchParams.append('categoryId', categoryFilter);
                url.searchParams.append('limit', maxEntries.toString());

                const response = await fetch(url.toString());
                const result = await response.json();

                if (result.success) {
                    setLeaders(result.data);
                } else {
                    throw new Error(result.error || 'Failed to fetch leaderboard');
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [categoryFilter, maxEntries]);

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
                {/* Award promo video */}
                <div className="mb-4 rounded-lg overflow-hidden">
                    <video
                        src="/ads/award.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full"
                    />
                </div>
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
                ) : null}
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
