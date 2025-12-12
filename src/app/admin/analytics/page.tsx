'use client'

import { useMemo, useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { createClient } from '@/lib/supabase/client';
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
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [nomineesRes, votesRes, categoriesRes] = await Promise.all([
          supabase.from('Nominee').select('*'),
          supabase.from('Vote').select('*'),
          supabase.from('Category').select('*')
        ]);

        if (nomineesRes.data) setNominees(nomineesRes.data as unknown as Nominee[]);
        if (votesRes.data) setVotes(votesRes.data as unknown as Vote[]);
        if (categoriesRes.data) setCategories(categoriesRes.data as unknown as Category[]);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const votesByCategory = useMemo(() => {
    if (!nominees.length || !votes.length || !categories.length) return [];

    const categoryVotes: { [categoryId: string]: number } = {};

    // Map existing votes to categories via nominees
    votes.forEach(vote => {
      const nominee = nominees.find(n => n.id === vote.nomineeId);
      if (nominee) {
        // category could be name or ID based on migration status, let's try to resolve name
        // If nominee.categoryId is present, use that to look up category name
        // Or if nominee.category is the name string
        let categoryName = nominee.category;

        // If nominee has categoryId, try to find name from categories list
        if ((nominee as any).categoryId) {
          const cat = categories.find(c => c.id === (nominee as any).categoryId);
          if (cat) categoryName = cat.name;
        }

        if (!categoryName) categoryName = 'Unknown';

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
    if (!votes.length) return [];

    const votesByDay: { [date: string]: number } = {};

    votes.forEach(vote => {
      if (vote.createdAt) {
        try {
          const dateObj = new Date(vote.createdAt);
          if (!isNaN(dateObj.getTime())) {
            const date = format(startOfDay(dateObj), 'MM/dd');
            if (!votesByDay[date]) {
              votesByDay[date] = 0;
            }
            votesByDay[date]++;
          }
        } catch (error) {
          console.error('Error parsing vote date:', error);
        }
      }
    });

    return Object.entries(votesByDay)
      .map(([date, count]) => ({ date, votes: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Approximate sort by MM/dd string might be wrong if crossing years, but fine for simple chart

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
