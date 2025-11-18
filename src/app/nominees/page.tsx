'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { useCollection } from '@/firebase';
import type { Nominee, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

const { placeholderImages } = placeholderImagesData;

export default function NomineesPage() {
  const { data: nominees, loading: nomineesLoading } = useCollection<Nominee>('nominees');
  const { data: categories, loading: categoriesLoading } = useCollection<Category>('categories');

  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortMethod, setSortMethod] = useState('trending');

  const allRegions = useMemo(() => {
    if (!nominees) return [];
    return [...new Set(nominees.map(n => n.region))];
  }, [nominees]);

  const filteredNominees = useMemo(() => {
    if (!nominees) return [];

    let filtered = nominees;

    if (searchTerm) {
      filtered = filtered.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(n => n.category.toLowerCase().replace(/\s/g, '-') === selectedCategory);
    }
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(n => n.region === selectedRegion);
    }
    
    // sorting logic can be added here based on `sortMethod`
    if (sortMethod === 'trending') {
        filtered.sort((a,b) => (b.votes || 0) - (a.votes || 0));
    } else if(sortMethod === 'newest') {
        // Assuming createdAt field exists. If not, this needs adjustment.
        // filtered.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }


    return filtered;
  }, [nominees, searchTerm, selectedCategory, selectedRegion, sortMethod]);
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
        params.delete('category');
    } else {
        params.set('category', value);
    }
    router.push(`/nominees?${params.toString()}`);
  }


  const loading = nomineesLoading || categoriesLoading;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Meet the Nominees
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover the talented individuals and groups nominated for this year's awards.
        </p>
      </div>

      <Card className="mb-8 p-4 bg-secondary">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search nominees..." className="pl-10" onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Region" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {allRegions.map(region => (
                         <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={sortMethod} onValueChange={setSortMethod}>
                <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading && [...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
                <Skeleton className="h-60 w-full" />
                <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/3 mt-2" />
                </CardContent>
            </Card>
        ))}
        {filteredNominees?.map((nominee) => {
          const nomineeImage = placeholderImages.find(p => p.id === nominee.imageId);
          return (
            <Card key={nominee.id} className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="relative h-60 w-full">
                  {nomineeImage && (
                    <Image
                      src={nomineeImage.imageUrl}
                      alt={`Photo of ${nominee.name}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={nomineeImage.imageHint}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-headline text-lg font-semibold truncate">{nominee.name}</h3>
                <p className="text-sm text-muted-foreground">{nominee.category}</p>
                <Button asChild variant="link" className="p-0 mt-2">
                  <Link href={`/nominees/${nominee.id}`}>View Profile <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
