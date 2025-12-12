'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Insight } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/ui/page-header';

export default function CulturalInsightPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('CulturalInsight')
          .select('*')
          .order('createdAt', { ascending: false });

        if (error) throw error;
        setInsights((data as unknown as Insight[]) || []);
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="container py-8">
      <PageHeader>
        <PageHeaderHeading>Cultural Insights</PageHeaderHeading>
        <PageHeaderDescription>
          News, articles, and stories about Ethiopian culture and creativity.
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid gap-8 mt-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading && [...Array(3)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
        {insights?.map((insight) => (
          <Link key={insight.id} href={`/cultural-insight/${insight.id}`} passHref>
            <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  {insight.imageUrl && (
                    <Image
                      src={insight.imageUrl}
                      alt={insight.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-headline text-lg font-semibold">{insight.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{insight.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!loading && insights?.length === 0 && (
          <p>No insights published yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
