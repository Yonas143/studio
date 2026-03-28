'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Insight } from '@/lib/types';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader, PageHeaderHeading } from '@/components/ui/page-header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
