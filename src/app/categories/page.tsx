'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 'traditional-dance',
    name: 'Traditional Dance',
    description: "This category celebrates performers who bring Ethiopia's traditional dances to life with authenticity, skill, and emotional power. Entries should reflect the unique movement styles, cultural expressions, and regional identities embedded in Ethiopia's diverse dance heritage.",
    imageUrl: '/files/dance-category.png',
  },
  {
    id: 'traditional-music',
    name: 'Traditional Music',
    description: "This award honors outstanding musicians who preserve and elevate Ethiopia's cultural soundscape through traditional melodies, rhythms, and vocal styles. Performances should showcase cultural authenticity, strong musicality, and a deep respect for the roots of Ethiopian music.",
    imageUrl: '/files/vocal-category.png',
  },
  {
    id: 'traditional-instruments',
    name: 'Traditional Instruments',
    description: "This category recognizes mastery of Ethiopia's iconic traditional instruments — such as the Masinko, Begena, Washint, Kirar, and Kebero and others. Entries should highlight technical skill, tone quality, cultural accuracy, and the instrument's ability to communicate emotion and heritage.",
    imageUrl: '/files/instruments-category.png',
  },
  {
    id: 'traditional-poetry',
    name: 'Traditional Poetry (Qiné, Wax & Gold, Spoken Traditions)',
    description: 'This award celebrates the poetic voices who carry forward Ethiopia\'s oral traditions — from Qiné and "Wax & Gold" (Sem Ena Werq) to folk storytelling and rhythmic spoken art. Entries must reflect linguistic creativity, cultural depth, layered meaning, and strong delivery.',
    imageUrl: '/files/poetry-category.png',
  },
  {
    id: 'product-design',
    name: 'Ethiopian Product Design & Presentation Award',
    description: 'Honors excellence in Ethiopian-made products that blend heritage with innovation. Recognizes designers, artisans, and companies turning tradition into high-quality, market-ready creations. Rewards originality, cultural authenticity, and global appeal while boosting value, competitiveness, and Ethiopia’s creative profile.',
    imageUrl: '/files/design.png'
  },
  {
    id: 'cultural-acting',
    name: 'Cultural Discovery Acting Award',
    description: ' Honors performers who bring Ethiopia’s heritage and stories to life with creativity, depth, and skill. Celebrates acts that entertain, educate, and preserve cultural identity while elevating Ethiopia’s visibility locally and globally. Contestants must provide a government-issued affidavit confirming cultural authenticity.',
    imageUrl: '/files/acting.png',
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Award Categories
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore the diverse fields of Ethiopian cultural expression we celebrate.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {categories.map((category) => (
          <Link href={`/nominees?category=${category.id}`} key={category.id} className="group block">
            <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 h-full flex flex-col sm:flex-row">
              <CardHeader className="p-0 sm:w-1/3">
                <div className="relative h-48 sm:h-full w-full">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex flex-col justify-between sm:w-2/3">
                <div>
                  <h2 className="font-headline text-2xl font-bold">{category.name}</h2>
                  <p className="mt-2 text-muted-foreground">{category.description}</p>
                </div>
                <Button variant="link" className="p-0 mt-4 self-start text-primary">
                  View Nominees <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
