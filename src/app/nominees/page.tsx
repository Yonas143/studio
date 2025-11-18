import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { nominees, categories } from '@/lib/data';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const { placeholderImages } = placeholderImagesData;

export default function NomineesPage({ searchParams }: { searchParams: { category?: string }}) {
  const allRegions = [...new Set(nominees.map(n => n.region))];

  const filteredNominees = nominees.filter(nominee => 
    !searchParams.category || nominee.category.toLowerCase().replace(/\s/g, '-') === searchParams.category
  );

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
                <Input placeholder="Search nominees..." className="pl-10" />
            </div>
            <Select defaultValue={searchParams.category}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Region" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {allRegions.map(region => (
                         <SelectItem key={region} value={region.toLowerCase()}>{region}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="most-viewed">Most Viewed</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredNominees.map((nominee) => {
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
