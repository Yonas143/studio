'use server';

import { suggestContent, type JudgeContentSuggestionsInput } from '@/ai/flows/judge-content-suggestions';

export async function getAiSuggestions(
  input: JudgeContentSuggestionsInput
): Promise<{ success: boolean; data?: string[]; error?: string }> {
  try {
    const result = await suggestContent(input);
    return { success: true, data: result.suggestions };
  } catch (error) {
    console.error('AI suggestion error:', error);
    // In a real app, you'd want more robust error handling and logging
    return { success: false, error: 'Failed to get AI suggestions. Please try again.' };
  }
}
