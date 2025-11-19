'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoc, useUser } from '@/firebase';
import type { Submission, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminSubmissionDetailPage({ params }: { params: { id: string } }) {
  const { data: submission, loading: submissionLoading } = useDoc<Submission>(`submissions/${params.id}`);
  const { data: submitter, loading: submitterLoading } = useDoc<UserProfile>(submission?.submitterId ? `users/${submission.submitterId}` : null);
  
  const loading = submissionLoading || (submission?.submitterId && submitterLoading);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-5 w-3/4 mt-2" />
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!submission) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{submission.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <Badge variant={submission.status === 'Pending' ? 'secondary' : submission.status === 'Approved' ? 'default' : 'destructive'}>
                {submission.status}
            </Badge>
            <span>Category: <span className="font-semibold text-foreground">{submission.categoryId}</span></span>
            {submission.createdAt && (
                <span>Submitted on: <span className="font-semibold text-foreground">{format(new Date(submission.createdAt), 'PPP')}</span></span>
            )}
        </div>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Submitter Information</CardTitle>
        </CardHeader>
        <CardContent>
            {submitter ? (
                <div className="space-y-1">
                    <p><strong>Name:</strong> {submitter.name}</p>
                    <p><strong>Email:</strong> {submitter.email}</p>
                    <p><strong>User ID:</strong> <span className="font-mono text-sm">{submitter.uid}</span></p>
                </div>
            ) : (
                <p>This submission was made anonymously.</p>
            )}
        </CardContent>
       </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cultural Relevance Statement</CardTitle>
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
                    <a href={submission.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Media File</a>
                </div>
            ): (
                <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">No media was attached to this submission.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
