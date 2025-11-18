'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2 } from 'lucide-react';
import { getAiSuggestions } from '@/app/judge/submission/[id]/actions';
import type { JudgeSubmission } from '@/lib/types';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    const result = await getAiSuggestions({
      submissionText: submission.submissionText,
      category: submission.category,
    });
    if (result.success && result.data) {
      setSuggestions(result.data);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline">Scorecard</CardTitle>
        <CardDescription>Rate the submission from 1 to 10.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {scoringCriteria.map(criteria => (
          <div key={criteria.id} className="space-y-3">
            <Label htmlFor={criteria.id}>{criteria.label}</Label>
            <div className="flex items-center gap-4">
              <Slider
                id={criteria.id}
                defaultValue={[5]}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="w-6 text-center font-mono text-sm">5</span>
            </div>
          </div>
        ))}
        <div className="space-y-2">
            <Label htmlFor="feedback">Qualitative Feedback</Label>
            <Textarea id="feedback" placeholder="Provide constructive feedback..." rows={4} />
        </div>
        <div className="space-y-4 pt-4 border-t">
          <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
            {isLoading ? (
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
        <Button className="w-full font-bold">Submit Score</Button>
      </CardFooter>
    </Card>
  );
}
