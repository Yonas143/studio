'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Insight } from '@/lib/types';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader, PageHeaderHeading } from '@/components/ui/page-header';

export default function InsightDetailPage() {
  const { id } = useParams();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInsight = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('CulturalInsight')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setInsight(data as unknown as Insight);
      } catch (error) {
        console.error('Error fetching insight:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsight();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-96 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="container py-8 text-center">
        <PageHeader>
          <PageHeaderHeading>Insight Not Found</PageHeaderHeading>
        </PageHeader>
        <p>The requested article could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <article>
        <PageHeader className="mb-8 px-0">
          <PageHeaderHeading className="text-4xl font-bold font-headline">{insight.title}</PageHeaderHeading>
          {insight.createdAt && (
            <p className="text-muted-foreground text-sm mt-2">
              Posted on {new Date(insight.createdAt).toLocaleDateString()}
            </p>
          )}
        </PageHeader>

        {insight.imageUrl && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={insight.imageUrl}
              alt={insight.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="prose dark:prose-invert max-w-none mx-auto" dangerouslySetInnerHTML={{ __html: insight.content }} />
      </article>
    </div>
  );
}
