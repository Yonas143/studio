'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { ArrowRight, Trophy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCollection } from '@/firebase';
import type { Nominee } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaderboard } from '@/components/voting/leaderboard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const { placeholderImages } = placeholderImagesData;

const timelineData = [
    {
        months: "1-2",
        title: "Month 1–2 — Summit & Orientation",
        points: [
            "Program launch event",
            "Creative mentorship & cultural innovation workshops",
            "Public introduction of participants",
        ],
    },
    {
        months: "3-4",
        title: "Month 3–4 — Competition Rounds",
        points: [
            "Audience-voted performance showcases",
            "Digital submissions & creative challenges",
            "Top talents advance to semi-finals",
        ],
    },
    {
        months: "5",
        title: "Month 5 — Finalist Selection",
        points: [
            "Expert judging panel review",
            "Final presentations & performances",
            "Cultural talent refinement sessions",
        ],
    },
    {
        months: "6",
        title: "Month 6 — Grand Award Ceremony",
        points: [
            "Winners announced on stage",
            "Trophy & certificate presentation",
            "Media exposure + Ambassador title awarding",
        ],
    },
];

export default function Home() {
  const { data: featuredNominees, loading: nomineesLoading } = useCollection<Nominee>('nominees', { where: ['featured', '==', true] });

  const sponsors = placeholderImages.filter(p => p.imageHint.includes('logo'));

  const loading = nomineesLoading;

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {featuredNominees?.map((nominee, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[60vh] min-h-[400px] w-full">
                    {nominee.imageUrl && (
                      <Image
                        src={nominee.imageUrl}
                        alt={nominee.name}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
                      <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                        {nominee.name}
                      </h1>
                      <p className="mt-4 max-w-2xl text-lg md:text-xl">
                        {nominee.category}
                      </p>
                      <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="font-bold">
                          <Link href={`/nominees/${nominee.id}`}>Vote Now <Trophy className="ml-2" /></Link>
                        </Button>
                        <Button asChild size="lg" variant="secondary" className="font-bold">
                          <Link href="/submit">Submit Your Work <ArrowRight className="ml-2" /></Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </section>

        {/* Short Intro Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">
                Cultural Ambassadors Award 2025/26
              </h2>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                A national creative initiative designed to recognize and elevate Ethiopia's young talents in music, performance, poetry, traditional instruments, and digital expression.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                The program empowers youth to preserve culture while innovating for the future.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Award & Program Timeline Section */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center mb-16">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Award & Program Timeline
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A six-month journey of recognition, development, and cultural excellence.
              </p>
            </div>
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-1/2 top-4 h-full w-0.5 -translate-x-1/2 bg-border"></div>
              {timelineData.map((item, index) => {
                const titleParts = item.title.split('— ');
                const displayTitle = titleParts.length > 1 ? titleParts[1] : item.title;

                return (
                  <div
                    key={index}
                    className={`relative mb-12 flex w-full items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                      <Card className="transition-all hover:shadow-xl hover:scale-105">
                        <CardHeader>
                          <p className="font-bold text-primary">Months {item.months}</p>
                          <CardTitle className="font-headline text-xl">{displayTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1.5 text-sm text-muted-foreground">
                            {item.points.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-primary"></div>
                  </div>
                );
              })}
            </div>
             <p className="mt-12 text-center text-lg font-semibold text-primary">
              Outcome: A new generation of cultural leaders representing Ethiopia.
            </p>
          </div>
        </section>

        <Separator />

        {/* Award Categories Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center mb-12">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Award Categories
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the discipline where your talent shines.
              </p>
            </div>
            <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
              <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🎭</div>
                  <h3 className="font-headline text-xl font-semibold mb-2">Performing Arts</h3>
                  <p className="text-muted-foreground">Dance • Drama • Cultural performance • Stage expression</p>
                </CardContent>
              </Card>
              <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🎵</div>
                  <h3 className="font-headline text-xl font-semibold mb-2">Digital Music & Vocal Innovation</h3>
                  <p className="text-muted-foreground">Modern beats fused with Ethiopian rhythm & creative production</p>
                </CardContent>
              </Card>
              <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🎻</div>
                  <h3 className="font-headline text-xl font-semibold mb-2">Traditional Instruments</h3>
                  <p className="text-muted-foreground">Krar • Masinko • Kebero • Washint & more — pure heritage sound</p>
                </CardContent>
              </Card>
              <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">✍</div>
                  <h3 className="font-headline text-xl font-semibold mb-2">Literary & Poetry Excellence</h3>
                  <p className="text-muted-foreground">Poetry, storytelling, spoken word & written cultural expression</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

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
