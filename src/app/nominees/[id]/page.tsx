'use client';

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoteButton } from '@/components/voting/vote-button';
import { Share2, MapPin, PlayCircle, Music, Image as ImageIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Nominee } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

const { placeholderImages } = placeholderImagesData;

export default function NomineeProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchNominee = async () => {
      try {
        const response = await fetch(`/api/nominees/${id}`);
        if (response.ok) {
          const data = await response.json();
          setNominee(data);
        } else {
          setNominee(null);
        }
      } catch (error) {
        console.error('Failed to fetch nominee:', error);
        setNominee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNominee();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="overflow-hidden sticky top-24">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4 text-center space-y-2">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-5 w-1/2 mx-auto" />
                <Skeleton className="h-5 w-1/3 mx-auto" />
              </CardContent>
            </Card>
            <div className="mt-4 flex flex-col gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
            <Separator className="my-8" />
            <Skeleton className="h-8 w-1/2 mb-4" />
            <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!nominee) {
    notFound();
  }

  const nomineeImage = placeholderImages.find(p => p.id === nominee.imageId);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="overflow-hidden sticky top-24">
            {nomineeImage && (
              <div className="relative aspect-square w-full">
                <Image
                  src={nomineeImage.imageUrl}
                  alt={`Portrait of ${nominee.name}`}
                  fill
                  className="object-cover"
                  data-ai-hint={nomineeImage.imageHint}
                />
              </div>
            )}
            <CardContent className="p-4 text-center">
              <h1 className="font-headline text-2xl font-bold">{nominee.name}</h1>
              <p className="text-md text-muted-foreground">{nominee.category}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{nominee.region}</span>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 flex flex-col gap-2">
            <VoteButton
              nomineeId={nominee.id!}
              nomineeName={nominee.name}
              voteCount={nominee.votes}
              className="w-full"
            />
            <Button size="lg" variant="outline" className="w-full">
              <Share2 className="mr-2 h-5 w-5" /> Share Profile
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">About {nominee.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{nominee.bio}</p>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <h2 className="font-headline text-2xl font-bold mb-4">Media Gallery</h2>

          {nominee.media && nominee.media.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {nominee.media.map((item, index) => (
                <Card key={index} className="group overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-48 w-full sm:w-1/3 flex-shrink-0">
                      <Image src={item.thumbnail} alt={item.description} fill className="object-cover" data-ai-hint={item.hint} />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.type === 'video' && <PlayCircle className="h-12 w-12 text-white" />}
                        {item.type === 'audio' && <Music className="h-12 w-12 text-white" />}
                        {item.type === 'image' && <ImageIcon className="h-12 w-12 text-white" />}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-headline font-semibold">{item.description}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Type: {item.type}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex items-center justify-center h-40 border-dashed">
              <p className="text-muted-foreground">No media submitted yet.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
