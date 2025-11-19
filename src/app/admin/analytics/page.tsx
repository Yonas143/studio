'use client'

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useCollection } from '@/firebase';
import type { Nominee, Vote, Category } from '@/lib/types';
import { format, startOfDay } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  votes: {
    label: 'Votes',
    color: 'hsl(var(--primary))',
  },
};

export default function AdminAnalyticsPage() {
  const { data: nominees, loading: nomineesLoading } = useCollection<Nominee>('nominees');
  const { data: votes, loading: votesLoading } = useCollection<Vote>('votes');
  const { data: categories, loading: categoriesLoading } = useCollection<Category>('categories');

  const loading = nomineesLoading || votesLoading || categoriesLoading;

  const votesByCategory = useMemo(() => {
    if (!nominees || !votes || !categories) return [];

    const categoryVotes: { [categoryId: string]: number } = {};
    const categoryIdToName: { [categoryId: string]: string } = {};
    
    categories.forEach(c => categoryIdToName[c.id] = c.name);

    votes.forEach(vote => {
        const nominee = nominees.find(n => n.id === vote.nomineeId);
        if (nominee) {
            const categoryName = nominee.category;
            if (!categoryVotes[categoryName]) {
                categoryVotes[categoryName] = 0;
            }
            categoryVotes[categoryName]++;
        }
    });

    return Object.entries(categoryVotes).map(([category, votes]) => ({
        category,
        votes
    }));
    
  }, [nominees, votes, categories]);
  
  const votesOverTime = useMemo(() => {
    if (!votes) return [];
    
    const votesByDay: { [date: string]: number } = {};

    votes.forEach(vote => {
      if (vote.createdAt) {
        const date = format(startOfDay(new Date(vote.createdAt)), 'MM/dd');
        if (!votesByDay[date]) {
          votesByDay[date] = 0;
        }
        votesByDay[date]++;
      }
    });
    
    return Object.entries(votesByDay)
        .map(([date, count]) => ({ date, votes: count }))
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  }, [votes]);

  if (loading) {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Analytics</h1>
                <p className="text-muted-foreground">
                Insights into votes, participants, and engagement.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Votes by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Votes Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Analytics</h1>
        <p className="text-muted-foreground">
          Insights into votes, participants, and engagement.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Votes by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={votesByCategory}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="votes" fill="var(--color-votes)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Votes Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={votesOverTime}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                 <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  dataKey="votes"
                  type="monotone"
                  stroke="var(--color-votes)"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
