'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Insight } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/ui/page-header';

const BALE_IMAGES = [
  '/bale/IMAGE 2026-03-28 17:28:33.jpg',
  '/bale/IMAGE 2026-03-28 17:28:41.jpg',
  '/bale/IMAGE 2026-03-28 17:28:46.jpg',
  '/bale/IMAGE 2026-03-28 17:28:51.jpg',
  '/bale/IMAGE 2026-03-28 17:28:55.jpg',
  '/bale/IMAGE 2026-03-28 17:28:59.jpg',
];

const STATIC_INSIGHTS = [
  {
    id: 'bale-mountains',
    title: 'Bale Mountains National Park',
    imageUrl: BALE_IMAGES[0],
    content: 'Bale Mountains National Park is located in the south eastern part of Ethiopia 400 km southeast of Addis Ababa. The park stretches over 2400 sq kms primarily featuring the Harenna Escarpment and Forest and the Sanetti Plateau. Home to the endangered Ethiopian Wolf, Mountain Nyala, Bale Monkey and the Giant Forest Hog.',
    createdAt: '2026-03-28',
  },
  {
    id: 'danakil-depression',
    title: 'Danakil Depression',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
    content: 'Dallol in the Danakil Desert is one of the lowest places on earth at 116 meters below sea level, where lakes of acid form colorful sulfur formations. Volcano Erta Ale is globally recognized as one of the most alluring natural attractions, with dramatic boiling lava erupting from its summit.',
    createdAt: '2026-03-28',
  },
];

export default function CulturalInsightPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('CulturalInsight')
          .select('*')
          .order('createdAt', { ascending: false });
        setInsights((data as unknown as Insight[]) || []);
      } catch {
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const staticIds = STATIC_INSIGHTS.map(s => s.id);
  const allInsights = [...STATIC_INSIGHTS, ...insights.filter(i => !staticIds.includes(i.id))];

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
            </CardContent>
          </Card>
        ))}
        {allInsights.map((item) => (
          <Link key={item.id} href={`/cultural-insight/${item.id}`} passHref>
            <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full bg-muted">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-headline text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{item.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
