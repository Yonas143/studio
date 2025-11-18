'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoringForm } from '@/components/judge/scoring-form';
import { useDoc } from '@/firebase';
import type { JudgeSubmission } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function JudgeSubmissionPage({ params }: { params: { id: string } }) {
  const { data: submission, loading } = useDoc<JudgeSubmission>(`submissions/${params.id}`);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-5 w-3/4 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
              <CardContent><Skeleton className="h-24 w-full" /></CardContent>
            </Card>
            <Card>
              <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
              <CardContent><Skeleton className="aspect-video w-full" /></CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[700px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Review Submission</h1>
        <p className="text-muted-foreground">Title: <span className="font-semibold text-foreground">{submission.title}</span> | Category: <span className="font-semibold text-foreground">{submission.categoryId}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Submission Content</CardTitle>
              <CardDescription>Cultural Relevance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <p>{submission.culturalRelevance}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Associated media for this submission.</CardDescription>
            </CardHeader>
            <CardContent>
                {submission.mediaUrl ? (
                    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                        {/* A real app would use a proper media player */}
                        <a href={submission.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Media</a>
                    </div>
                ): (
                    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">No media attached.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <ScoringForm submission={submission} />
        </div>
      </div>
    </div>
  );
}
