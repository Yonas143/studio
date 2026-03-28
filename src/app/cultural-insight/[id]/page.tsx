'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Insight } from '@/lib/types';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader, PageHeaderHeading } from '@/components/ui/page-header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BALE_IMAGES = [
  '/bale/IMAGE 2026-03-28 17:28:33.jpg',
  '/bale/IMAGE 2026-03-28 17:28:41.jpg',
  '/bale/IMAGE 2026-03-28 17:28:46.jpg',
  '/bale/IMAGE 2026-03-28 17:28:51.jpg',
  '/bale/IMAGE 2026-03-28 17:28:55.jpg',
  '/bale/IMAGE 2026-03-28 17:28:59.jpg',
];

const STATIC_ARTICLES: Record<string, any> = {
  'bale-mountains': {
    id: 'bale-mountains',
    title: 'Bale Mountains National Park',
    imageUrl: JSON.stringify(BALE_IMAGES),
    content: `<p>Bale Mountains National Park is located in the south eastern part of Ethiopia, 400 km southeast of Addis Ababa. Stretching over 2,400 sq kms, the park primarily features the Harenna Escarpment and Forest and the Sanetti Plateau — one of Africa's most extraordinary highland ecosystems.</p>

<h2>Wildlife</h2>
<p>The park is renowned for its incredible diversity of wildlife. The most iconic resident is the endangered <strong>Ethiopian Wolf</strong> — the rarest canid in the world. Other notable species include the <strong>Mountain Nyala</strong>, a large and majestic horned antelope found nowhere else on earth, the <strong>Bale Monkey</strong>, and the <strong>Giant Forest Hog</strong>, allegedly the world's largest swine.</p>

<h2>Birdlife</h2>
<p>Bale is recognized as one of the African continent's top five destinations for exotic birdwatching, with six endemic species and 11 other geographically unique species. It is the only known sub-Saharan location supporting breeding populations of the <strong>Golden Eagle</strong>, <strong>Ruddy Shelduck</strong>, and <strong>Red-billed Chough</strong>.</p>

<h2>Landscape & Biodiversity</h2>
<p>Beyond its wildlife, Bale Mountains National Park is a globally significant biodiversity hotspot. The landscape encompasses lush evergreen forests, bamboo groves, open moorlands, rivers, waterfalls, and vast grasslands — each providing vital habitat for a remarkable range of flora and fauna.</p>
<p>Bale's 1,300-plus plant species include <strong>160 Ethiopian endemics</strong> and 23 species unique to the park itself.</p>

<h2>Adventure & Exploration</h2>
<p>Bale is an exceptional destination for hiking, mule trekking, and horseback safaris. Whether traversing the Sanetti Plateau or descending into the Harenna Forest, visitors are rewarded with landscapes and wildlife encounters found nowhere else on the continent.</p>

<hr/>
<p><strong>Plan your visit:</strong> <a href="https://www.ethiopianholidays.com/packages/package-details/bale-mountains-national-park-tour-ethn01-aqkwvdno" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:opacity-80">Bale Mountains National Park Tour — Ethiopian Holidays</a></p>`,
    createdAt: '2026-03-28',
  },
};

function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg group">
      <Image src={images[current]} alt={`Slide ${current + 1}`} fill className="object-cover transition-all duration-500" />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

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
        // Check static articles first
        if (STATIC_ARTICLES[id as string]) {
          setInsight(STATIC_ARTICLES[id as string]);
          setLoading(false);
          return;
        }
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
        <Skeleton className="h-96 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="container py-8 text-center">
        <PageHeader><PageHeaderHeading>Insight Not Found</PageHeaderHeading></PageHeader>
        <p>The requested article could not be found.</p>
      </div>
    );
  }

  // Support single imageUrl or JSON array of images
  let images: string[] = [];
  if (insight.imageUrl) {
    try {
      const parsed = JSON.parse(insight.imageUrl);
      images = Array.isArray(parsed) ? parsed : [insight.imageUrl];
    } catch {
      images = [insight.imageUrl];
    }
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

        <ImageSlider images={images} />

        <div className="prose dark:prose-invert max-w-none mx-auto" dangerouslySetInnerHTML={{ __html: insight.content }} />
      </article>
    </div>
  );
}
