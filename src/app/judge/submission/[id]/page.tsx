import { notFound } from 'next/navigation';
import { judgeSubmissions } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoringForm } from '@/components/judge/scoring-form';

export default function JudgeSubmissionPage({ params }: { params: { id: string } }) {
  const submission = judgeSubmissions.find(s => s.id === params.id);

  if (!submission) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Review Submission</h1>
        <p className="text-muted-foreground">Nominee: <span className="font-semibold text-foreground">{submission.nomineeName}</span> | Category: <span className="font-semibold text-foreground">{submission.category}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Submission Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <p>{submission.submissionText}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Associated media for this submission.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">[Media Player Placeholder]</p>
              </div>
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
