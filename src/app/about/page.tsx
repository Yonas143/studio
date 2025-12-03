'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Globe, Lightbulb, Award, Megaphone, GraduationCap, Handshake, Music, Mic, Guitar, BookOpen } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32">
                <div className="container relative z-10">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                            Cultural Ambassador Award 2025/26
                        </h1>
                        <p className="mt-6 text-xl text-muted-foreground md:text-2xl">
                            Celebrating Ethiopia's culture  with   traditional dance,traditional instruments,
                            traditional music, poetry.
                        </p>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Where tradition meets digital creativity.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg">
                                <Link href="/submit">Apply Now</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/categories">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </section>

            {/* About the Initiative */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">About the Initiative</h2>
                        <div className="mt-6 space-y-4 text-lg text-muted-foreground">
                            <p>
                                Ethiopia holds a deep cultural beauty music, dance, poetry, storytelling, traditional instruments and digital creativity. The ABN Studio Cultural Ambassadors Award is a national program designed to identify, elevate, and empower talented young creators, giving them a platform to showcase their art to Ethiopia and the world.
                            </p>
                            <p>
                                We celebrate youth who preserve culture while innovating through digital media, performance, literature and creative expression. The goal is to build a new generation of Cultural Ambassadors who will inspire pride and lead Ethiopia's cultural future.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Stand For */}
            <section className="bg-secondary/30 py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">What We Stand For</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We empower cultural youth through creativity, mentorship & visibility. Our mission is built on four pillars:
                        </p>
                    </div>
                    <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Trophy className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mt-4 font-headline text-lg font-semibold">Recognition of Talent & Excellence</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Globe className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mt-4 font-headline text-lg font-semibold">Cultural Heritage + Digital Innovation</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mt-4 font-headline text-lg font-semibold">Empowerment & Capacity Building</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Lightbulb className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mt-4 font-headline text-lg font-semibold">National & International Visibility</h3>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Award Categories */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">Award Categories</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Young creators may compete in four major disciplines:
                        </p>
                    </div>
                    <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Music className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl font-semibold">Traditional Dance </h3>
                                        <p className="mt-2 text-muted-foreground">Traditional & contemporary dance, music & drama.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Mic className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl font-semibold">cultural Music & Vocal Innovation</h3>
                                        <p className="mt-2 text-muted-foreground">Modern production fused with Ethiopian sound.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Guitar className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl font-semibold">Traditional Instruments</h3>
                                        <p className="mt-2 text-muted-foreground">Creative instrumental performance & presentation.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <BookOpen className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-xl font-semibold">Literary & Poetry Excellence</h3>
                                        <p className="mt-2 text-muted-foreground">This award celebrates the poetic voices who carry forward Ethiopia’s oral traditions — from Qiné and “Wax & Gold” (Sem Ena Werq) to folk storytelling and rhythmic spoken art. Entries must reflect linguistic creativity, cultural depth, layered meaning, and strong delivery.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-8 text-center">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/categories">View Full Award Details</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Who Can Participate */}
            <section className="bg-secondary/30 py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">Objectives</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            The ABN Studio Cultural Ambassadors initiative is designed to empower Ethiopia’s youth by providing a platform that recognizes creativity, innovation, cultural excellence and support. The objectives focus on celebrating talent, promoting national and international visibility, building capacity, and fostering the integration of traditional arts with modern digital technologies. Through these objectives, the program aims to create a sustainable network of young leaders who serve as advocates and role models for Ethiopia’s rich cultural heritage.
                        </p>
                        <ul className="mt-6 space-y-3 text-lg">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-primary">✔</span>
                                <span>Honor young individuals and groups demonstrating creativity, innovation, and social impact.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-primary">✔</span>
                                <span>Amplify the voices of Ethiopia’s creative youth through media, digital platforms, and public engagement.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-primary">✔</span>
                                <span>Offer mentorship, training, and workshops to strengthen artistic skills and digital innovation.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-primary">✔</span>
                                <span>Encourage the integration of traditional Ethiopian arts with modern technologies to preserve heritage and inspire creativity.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-primary">✔</span>
                                <span>Establish a community of Cultural Ambassadors who serve as role models, advocates, and leaders for Ethiopian culture.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Expected Outcomes */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl text-center mb-12">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">Expected Outcomes & Impacts</h2>
                    </div>
                    <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-headline text-xl font-semibold mb-3">Recognition of Talent & Creativity</h3>
                                <p className="text-muted-foreground mb-2">Young creatives gain formal acknowledgment for their artistic excellence, innovation, and cultural contribution.</p>
                                <p className="text-muted-foreground">Awardees are celebrated nationally and internationally, inspiring peers and emerging artists.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-headline text-xl font-semibold mb-3">Capacity Building & Skills Development</h3>
                                <p className="text-muted-foreground mb-2">Participants acquire enhanced skills in performing arts, digital innovation, creative expression, and cultural leadership.</p>
                                <p className="text-muted-foreground">Mentorship and workshops strengthen professional growth and open pathways to career opportunities.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-headline text-xl font-semibold mb-3">Cultural Preservation & Innovation</h3>
                                <p className="text-muted-foreground mb-2">Traditional Ethiopian arts, music, dance, literature, and instruments are preserved and promoted.</p>
                                <p className="text-muted-foreground mb-2">Integration of modern digital techniques encourages innovative expression while respecting heritage.</p>
                                <p className="text-primary font-medium"></p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-headline text-xl font-semibold mb-3">National & International Visibility</h3>
                                <p className="text-muted-foreground mb-2">Participants’ work is amplified through ABN Studio platforms, media coverage, cultural events, and digital channels.</p>
                                <p className="text-muted-foreground">Ethiopia’s creative youth gain recognition as ambassadors of the nation’s artistic and cultural excellence.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-headline text-xl font-semibold mb-3">Sustainable Network of Ambassadors</h3>
                                <p className="text-muted-foreground mb-2">A lasting community of young leaders is established, fostering collaboration, mentorship, and ongoing cultural initiatives.</p>
                                <p className="text-muted-foreground">Ambassadors serve as advocates for Ethiopian culture, inspiring social impact and youth participation in the arts.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-headline text-xl font-semibold mb-3">Societal & Economic Impact</h3>
                                <p className="text-muted-foreground mb-2">Promotion of cultural arts contributes to social cohesion, national pride, and community engagement.</p>
                                <p className="text-muted-foreground">Creative and digital innovation provides pathways for employment, entrepreneurship, and cultural tourism opportunities.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Program Benefits */}
            <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">Program Benefits</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Winners receive:</p>
                    </div>
                    <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Award className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mt-4 font-semibold">Trophy & Certificate of Excellence</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Megaphone className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mt-4 font-semibold">Media exposure and national visibility</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mt-4 font-semibold">Mentorship, workshops & growth opportunities</h3>
                            </CardContent>
                        </Card>
                        <Card className="border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Handshake className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mt-4 font-semibold">Networking with industry leaders & institutions</h3>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-12 text-center">
                        <Button asChild size="lg">
                            <Link href="/register">Register for the Award</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* About ABN Studio */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl">About ABN Studio</h2>
                        <p className="mt-6 text-lg text-muted-foreground">
                            ABN Studio is a leading creative hub in Ethiopia, dedicated to empowering
                            youth, promoting cultural excellence, and fostering innovation across the arts.
                            As a sister company of Abyssinia Business Network (ABN) Magazine and
                            Africa for Africans, ABN Studio leverages a strong media and cultural
                            network to provide artists, performers, writers, and innovators with
                            opportunities to showcase their talents, develop professionally, and reach
                            national and international audiences.


                            <br />
                            <br />
                            <br />
                            The studio operates with the highest standards of professionalism, ensuring all
                            creative projects meet international benchmarks in production quality, digital
                            media, and cultural presentation. ABN Studio specializes in a wide range of
                            services, including:





                            Through initiatives such as the ABN Studio Cultural Ambassadors Award, the
                            studio blends traditional Ethiopian heritage with modern digital technologies,
                            creating platforms that celebrate culture, encourage innovation, and amplify
                            the voices of Ethiopia’s creative youth. ABN Studio is committed to nurturing
                            cultural leaders and ambassadors, inspiring creativity, innovation, and pride in
                            Ethiopia’s rich artistic legacy.
                        </p>
                    </div>
                </div>
            </section >
        </div >
    );
}
