'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AWARD_CATEGORIES } from '@/lib/categories-data';

const categories = AWARD_CATEGORIES;

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
