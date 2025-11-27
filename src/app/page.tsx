'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { ArrowRight, Calendar, Medal, Trophy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCollection } from '@/firebase';
import type { Nominee, TimelineEvent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaderboard } from '@/components/voting/leaderboard';

const { placeholderImages } = placeholderImagesData;

export default function Home() {
  const { data: featuredNominees, loading: nomineesLoading } = useCollection<Nominee>('nominees', { where: ['featured', '==', true] });
  const { data: timelineEvents, loading: timelineLoading } = useCollection<TimelineEvent>('timelineEvents');

  const heroImage = placeholderImages.find(p => p.id === 'hero-banner');
  const sponsors = placeholderImages.filter(p => p.imageHint.includes('logo'));

  const loading = nomineesLoading || timelineLoading;

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="relative h-[60vh] min-h-[400px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Cultural Ambassador Award
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Celebrating and preserving the rich tapestry of Ethiopian cultural heritage.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="font-bold">
                <Link href="/nominees">Vote Now <Trophy className="ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="font-bold">
                <Link href="/submit">Submit Your Work <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold bg-transparent text-white hover:bg-white/10">
                <Link href="/categories">View Categories</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="featured-nominees" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center font-headline text-3xl font-bold md:text-4xl">
              Featured Nominees
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {loading && [...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/3 mt-2" />
                  </CardContent>
                </Card>
              ))}
              {featuredNominees?.map((nominee) => {
                const nomineeImage = placeholderImages.find(p => p.id === nominee.imageId);
                return (
                  <Card key={nominee.id} className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="p-0">
                      <div className="relative h-48 w-full">
                        {nominee.imageUrl ? (
                          <Image
                            src={nominee.imageUrl}
                            alt={`Photo of ${nominee.name}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : nomineeImage ? (
                          <Image
                            src={nomineeImage.imageUrl}
                            alt={`Photo of ${nominee.name}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            data-ai-hint={nomineeImage.imageHint}
                          />
                        ) : null}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-headline text-lg font-semibold">{nominee.name}</h3>
                      <p className="text-sm text-muted-foreground">{nominee.category}</p>
                      <Button asChild variant="link" className="p-0 mt-2">
                        <Link href={`/nominees/${nominee.id}`}>View Profile <ArrowRight className="ml-1 h-4 w-4" /></Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="/nominees">View All Nominees</Link>
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        <section id="leaderboard" className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Leaderboard maxEntries={5} />
          </div>
        </section>

        <Separator />

        <section id="timeline" className="py-12 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center font-headline text-3xl font-bold md:text-4xl">
              Award Timeline
            </h2>
            <div className="relative mx-auto max-w-2xl">
              <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border"></div>
              {loading && [...Array(4)].map((_, index) => (
                <div key={index} className="relative mb-8 flex items-center justify-between w-full">
                  <div className={`order-1 w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <Skeleton className="h-5 w-24 ml-auto" />
                  </div>
                  <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-muted shadow-lg">
                  </div>
                  <div className={`order-1 w-5/12 px-4 py-3 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-1" />
                  </div>
                </div>
              ))}
              {timelineEvents?.sort((a, b) => a.order - b.order).map((event, index) => (
                <div key={index} className="relative mb-8 flex items-center justify-between w-full">
                  <div className={`order-1 w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <p className="font-bold text-primary">{event.date}</p>
                  </div>
                  <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    {index === 0 ? <Medal /> : <Calendar />}
                  </div>
                  <div className={`order-1 w-5/12 px-4 py-3 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <h3 className="font-headline font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sponsors" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center font-headline text-3xl font-bold md:text-4xl">
              Our Sponsors
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="relative h-16 w-32 grayscale opacity-60 transition-all hover:opacity-100 hover:grayscale-0">
                  <Image
                    src={sponsor.imageUrl}
                    alt={sponsor.description}
                    fill
                    className="object-contain"
                    data-ai-hint={sponsor.imageHint}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
