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
    images: BALE_IMAGES,
    content: `Bale Mountains National Park is located in the south eastern part of Ethiopia 400 km southeast of Addis Ababa. The park stretches over 2400 sq kms primarily featuring the Harenna Escarpment and Forest and the Sanetti Plateau. The area is well known for its incredible diversity of wildlife. The most well known animal that calls Bale home is the endangered Red and White Ethiopian Wolf. There are great diversity of other animals, which include the Mountain Nyala, a large horned antelope, Bale Monkey and the Forest Hog allegedly the world's largest swine. Bale is also recognized as one of the African continent's top five places to find exotic birds (six endemic species and 11 other geographically unique species). Bale is known to support the only known sub-Saharan birding populations of Golden Eagle, Ruddy Shelduck and Red-billed Chough. In addition to its wonderful range of wildlife, Bale Mountains National Park is an extremely important area of biodiversity. The area is also known for its lush evergreen forests and woodland, bamboo groves, moorlands, rivers and waterfalls as well as an abundance of grassland providing the ideal habitat for a range of animals and birds. Bale's 1,300-plus plant species include 160 Ethiopian endemics and 23 unique to the park. Bale is an excellent place for hiking and mule or horseback treks as part of a unique and colorful Safari across this beautiful and diverse region.`,
    createdAt: '2026-03-28',
    isPublished: true,
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

  const allInsights = [...STATIC_INSIGHTS, ...insights.filter(i => i.id !== 'bale-mountains')];

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
        {allInsights.map((insight) => (
          <Link key={insight.id} href={`/cultural-insight/${insight.id}`} passHref>
            <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full bg-muted">
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
      </div>
    </div>
  );
}
