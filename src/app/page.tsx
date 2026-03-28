'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { ArrowRight, Trophy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Nominee } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaderboard } from '@/components/voting/leaderboard';
import { AnnouncementPopup } from '@/components/announcement-popup';
import { SubmissionCountdown } from '@/components/submission-countdown';
import { AWARD_CATEGORIES } from '@/lib/categories-data';
import { useEffect, useState } from 'react';

const { placeholderImages } = placeholderImagesData;

export default function Home() {
  const [featuredNominees, setFeaturedNominees] = useState<Nominee[]>([]);
  const [popups, setPopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [popupsRes, nomineesRes] = await Promise.all([
          fetch('/api/popups?isActive=true'),
          fetch('/api/nominees?featured=true'),
        ]);

        const popupsData = await popupsRes.json();
        if (popupsData.success) {
          setPopups(popupsData.data?.data || popupsData.data || []);
        }

        const nomineesData = await nomineesRes.json();
        setFeaturedNominees(Array.isArray(nomineesData) ? nomineesData : (nomineesData.data || []));

      } catch (error) {
        console.error('Failed to fetch home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroVideos = [
    {
      id: 'dance',
      src: '/files/DANCE.mp4',
      title: 'Traditional Dance',
      subtitle: "Rhythms of our ancestors bringing history to life.",
    },
    {
      id: 'music',
      src: '/files/music.mp4',
      title: 'Traditional Music',
      subtitle: 'Melodies that define us, echoing through generations.',
    },
    {
      id: 'instrument',
      src: '/files/instrument.mp4',
      title: 'Traditional Instruments',
      subtitle: 'Mastery of sound with Masinko, Kirar, and Begena.',
    },
    {
      id: 'poem',
      src: '/files/poem.mp4',
      title: 'Traditional Poetry',
      subtitle: "Words that paint pictures of our rich cultural tapestry.",
    },
    {
      id: 'product-design',
      src: '/files/creativity.mp4',
      title: 'Ethiopian Product Design & Presentation Award',
      subtitle: 'Bridging heritage and modernity through innovative Ethiopian-made products.',
    },
    {
      id: 'acting',
      src: '/files/acting.mp4',
      title: 'Cultural Discovery Acting Award',
      subtitle: "Extraordinary performers bringing Ethiopia's cultural stories to life.",
    },
  ];

  const [heroIndex, setHeroIndex] = useState(0);
  const activePopup = popups && popups.length > 0 ? popups[0] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % heroVideos.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [heroVideos.length]);

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Dynamic Announcement Popup */}
      {activePopup && (
        <AnnouncementPopup
          content={{
            type: activePopup.type,
            title: activePopup.title,
            description: activePopup.description,
            videoUrl: activePopup.videoUrl,
            imageUrl: activePopup.imageUrl,
            imageLink: activePopup.imageLink,
          }}
          showOnLoad={true}
          delaySeconds={activePopup.delaySeconds || 2}
          storageKey={activePopup.storageKey}
        />
      )}

      <main className="flex-1">
        {/* Hero Section — custom auto-rotating, fully responsive */}
        <section className="relative w-full overflow-hidden" style={{ height: '100dvh' }}>
          {heroVideos.map((video, i) => (
            <div
              key={video.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28">
                <div className="max-w-xl">
                  <h1 className="font-headline text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-5xl lg:text-6xl drop-shadow-lg">
                    {video.title}
                  </h1>
                  <p className="mt-3 text-sm text-gray-200 sm:text-base md:text-xl drop-shadow-md">
                    {video.subtitle}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild size="default" className="font-bold shadow-lg text-sm sm:text-base">
                      <Link href="/nominees">Vote Now <Trophy className="ml-2 h-4 w-4" /></Link>
                    </Button>
                    <Button asChild size="default" variant="secondary" className="font-bold shadow-lg text-sm sm:text-base">
                      <Link href="/submit">Submit Your Work <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroVideos.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === heroIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        </section>

        {/* Short Intro Section */}
        <section className="py-10 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl text-primary">
                Cultural Ambassador Award 2026
              </h2>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                A national creative initiative designed to recognize and elevate Ethiopia's cultural talent in traditional dance, traditional music, traditional instruments, poetry, product design, acting, and digital expression.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                The program empowers creators to preserve culture while innovating for the future.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Ad Video */}
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <img
                src="/ads/new.gif"
                alt="Advertisement"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* Submission Countdown Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <SubmissionCountdown />
          </div>
        </section>

        <Separator />

        {/* CAA Promo Video */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl text-center mb-8">
              <h2 className="font-headline text-3xl font-bold md:text-4xl text-primary">Watch Our Story</h2>
              <p className="mt-3 text-muted-foreground text-lg">See what the Cultural Ambassador Award is all about.</p>
            </div>
            <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'CJmYj63Kalc', title: 'CAA' },
                { id: 'GHXY_OruvAE', title: 'CAA Tibebu Belete' },
              ].map(v => (
                <div key={v.id} className="relative w-full rounded-xl overflow-hidden shadow-xl" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Award & Program Timeline Section */}
        {/* <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center mb-12">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Award & Program Timeline
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A six-month journey of recognition, development, and cultural excellence.
              </p>
            </div>
            <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      1-2
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-semibold">Month 1–2 — Summit & Orientation</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>• Program launch event</li>
                        <li>• Creative mentorship & cultural innovation workshops</li>
                        <li>• Public introduction of participants</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      3-4
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-semibold">Month 3–4 — Competition Rounds</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>• Audience-voted performance showcases</li>
                        <li>• Digital submissions & creative challenges</li>
                        <li>• Top talents advance to semi-finals</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      5
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-semibold">Month 5 — Finalist Selection</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>• Expert judging panel review</li>
                        <li>• Final presentations & performances</li>
                        <li>• Cultural talent refinement sessions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      6
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-semibold">Month 6 — Grand Award Ceremony</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>• Winners announced on stage</li>
                        <li>• Trophy & certificate presentation</li>
                        <li>• Media exposure + Ambassador title awarding</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="mt-8 text-center text-lg font-semibold text-primary">
              Outcome: A new generation of cultural leaders representing Ethiopia.
            </p>
          </div>
        </section> */}

        <Separator />

        {/* Award Categories Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center mb-12">
              <h2 className="font-headline text-3xl font-bold md:text-4xl text-primary">
                Award Categories
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the discipline where your talent shines.
              </p>
            </div>
            <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {AWARD_CATEGORIES.map((category) => (
                <Link href={`/nominees?category=${category.id}`} key={category.id} className="group block">
                  <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <h3 className="font-headline text-lg font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{category.description}</p>
                      <span className="mt-3 text-sm font-medium text-primary flex items-center gap-1">
                        View Nominees <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
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

        {/* <section id="timeline" className="py-12 md:py-20 bg-secondary">
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
        </section> */}

        <section id="partners" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 space-y-16">

            {/* Partners — 1 to 3 */}
            <div>
              <h2 className="font-headline text-3xl font-bold md:text-4xl text-primary text-center mb-2">Our Partners</h2>
              <p className="text-center text-lg text-muted-foreground mb-10">Proudly supported by Ethiopia's leading institutions.</p>
              <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="relative h-28 w-44 md:h-36 md:w-56 transition-all hover:scale-105 duration-300 ring-2 ring-primary rounded-xl p-2 bg-white shadow-md">
                    <Image src={`/partners/${n}.jpg`} alt={`Partner ${n}`} fill className="object-contain p-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Platinum Sponsors — 4 to 7 */}
            <div>
              <div className="text-center mb-10">
                <span className="inline-block px-4 py-1 rounded-full bg-yellow-400 text-yellow-900 text-sm font-semibold tracking-wide uppercase mb-3">Platinum Sponsors</span>
                <h3 className="font-headline text-2xl font-bold text-primary">Our Platinum Sponsors</h3>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                {[4, 5, 6, 7].map((n) => (
                  <div key={n} className="relative h-24 w-40 md:h-32 md:w-52 transition-all hover:scale-105 duration-300 ring-2 ring-yellow-400 rounded-xl p-2 bg-white shadow-md">
                    <Image src={`/partners/${n}.jpg`} alt={`Platinum Sponsor ${n}`} fill className="object-contain p-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsors — 8 to 15 */}
            <div>
              <div className="text-center mb-10">
                <span className="inline-block px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-wide uppercase mb-3">Sponsors</span>
                <h3 className="font-headline text-2xl font-bold text-primary">Our Sponsors</h3>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {[8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                  <div key={n} className="relative h-20 w-32 md:h-28 md:w-44 transition-all hover:scale-105 duration-300 ring-2 ring-primary/40 rounded-xl p-2 bg-white shadow-md">
                    <Image src={`/partners/${n}.jpg`} alt={`Sponsor ${n}`} fill className="object-contain p-1" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
