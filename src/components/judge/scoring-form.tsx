'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2 } from 'lucide-react';
import { getAiSuggestions } from '@/app/judge/submission/[id]/actions';
import type { JudgeSubmission } from '@/lib/types';
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type ScoringFormProps = {
  submission: JudgeSubmission;
};

const scoringCriteria = [
  { id: 'relevance', label: 'Cultural Relevance' },
  { id: 'creativity', label: 'Creativity' },
  { id: 'quality', label: 'Technical Quality' },
  { id: 'authenticity', label: 'Authenticity' },
  { id: 'impact', label: 'Impact' },
];

export function ScoringForm({ submission }: ScoringFormProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      relevance: 5,
      creativity: 5,
      quality: 5,
      authenticity: 5,
      impact: 5,
      feedback: '',
    },
  });

  const scores = watch();

  const handleGetSuggestions = async () => {
    setIsAISuggesting(true);
    setError(null);
    setSuggestions([]);
    const result = await getAiSuggestions({
      submissionText: submission.culturalRelevance,
      category: submission.categoryId,
    });
    if (result.success && result.data) {
      setSuggestions(result.data);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsAISuggesting(false);
  };
  
  const onSubmit = async (data: any) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to score.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const submissionRef = doc(firestore, 'submissions', submission.id!);
      await updateDoc(submissionRef, {
        status: 'Scored',
      });
      
      const scoreRef = doc(firestore, 'scores', `${submission.id!}_${user.uid}`);
      await setDoc(scoreRef, {
        ...data,
        submissionId: submission.id,
        judgeId: user.uid,
        createdAt: serverTimestamp(),
      });
      
      toast({ title: 'Success', description: 'Your score has been submitted.' });

    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error submitting score', description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="sticky top-24">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="font-headline">Scorecard</CardTitle>
          <CardDescription>Rate the submission from 1 to 10.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {scoringCriteria.map(criteria => (
            <div key={criteria.id} className="space-y-3">
              <Label htmlFor={criteria.id}>{criteria.label}</Label>
              <div className="flex items-center gap-4">
                <Controller
                  name={criteria.id as any}
                  control={control}
                  render={({ field }) => (
                    <Slider
                      id={criteria.id}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                  )}
                />
                <span className="w-6 text-center font-mono text-sm">{scores[criteria.id as keyof typeof scores]}</span>
              </div>
            </div>
          ))}
          <div className="space-y-2">
              <Label htmlFor="feedback">Qualitative Feedback</Label>
              <Controller
                name="feedback"
                control={control}
                render={({ field }) => (
                  <Textarea id="feedback" placeholder="Provide constructive feedback..." rows={4} {...field} />
                )}
              />
          </div>
          <div className="space-y-4 pt-4 border-t">
            <Button onClick={handleGetSuggestions} type="button" disabled={isAISuggesting} className="w-full">
              {isAISuggesting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Lightbulb className="mr-2 h-4 w-4" /> Get AI Suggestions</>
              )}
            </Button>
            {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            {suggestions.length > 0 && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Cultural Context Suggestions</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                    {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Score
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
