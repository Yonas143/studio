'use server';

/**
 * @fileOverview A flow for suggesting relevant context and information about the cultural background of a submission to judges.
 *
 * - suggestContent - A function that suggests content for judges based on the submission.
 * - JudgeContentSuggestionsInput - The input type for the suggestContent function.
 * - JudgeContentSuggestionsOutput - The return type for the suggestContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JudgeContentSuggestionsInputSchema = z.object({
  submissionText: z.string().describe('The text content of the submission.'),
  category: z.string().describe('The category of the submission (e.g., Poetry, Music, Dance).'),
});
export type JudgeContentSuggestionsInput = z.infer<typeof JudgeContentSuggestionsInputSchema>;

const JudgeContentSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggestions for the judge to consider.'),
});
export type JudgeContentSuggestionsOutput = z.infer<typeof JudgeContentSuggestionsOutputSchema>;

export async function suggestContent(input: JudgeContentSuggestionsInput): Promise<JudgeContentSuggestionsOutput> {
  return judgeContentSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'judgeContentSuggestionsPrompt',
  input: {schema: JudgeContentSuggestionsInputSchema},
  output: {schema: JudgeContentSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping judges evaluate cultural submissions.

  The judge is reviewing a submission with the following text:
  {{submissionText}}

  The submission belongs to the following category:
  {{category}}

  Suggest relevant context and information about the cultural background of this submission that the judge should consider to better evaluate its cultural relevance and authenticity.  Provide the suggestions as a list of strings.
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const judgeContentSuggestionsFlow = ai.defineFlow(
  {
    name: 'judgeContentSuggestionsFlow',
    inputSchema: JudgeContentSuggestionsInputSchema,
    outputSchema: JudgeContentSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
