'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UploadCloud } from 'lucide-react';
import { useCollection, useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import type { Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const submissionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  categoryId: z.string().min(1, 'Category is required'),
  culturalRelevance: z.string().min(20, 'Please provide more detail on cultural relevance'),
  submissionFile: z.instanceof(File).optional(),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

export default function SubmitPage() {
  const { data: categories, loading: categoriesLoading } = useCollection<Category>('categories');
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const storage = getStorage();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  const { control, handleSubmit, register, setValue, formState: { errors } } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const onSubmit = async (data: SubmissionFormData) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not Authenticated', description: 'Please log in to make a submission.' });
      return router.push('/login');
    }
    
    setIsSubmitting(true);
    let mediaUrl = '';
    
    try {
      if (data.submissionFile) {
        const fileRef = ref(storage, `submissions/${user.uid}/${data.submissionFile.name}`);
        const snapshot = await uploadBytes(fileRef, data.submissionFile);
        mediaUrl = await getDownloadURL(snapshot.ref);
      }
      
      await addDoc(collection(firestore, 'submissions'), {
        title: data.title,
        categoryId: data.categoryId,
        culturalRelevance: data.culturalRelevance,
        mediaUrl: mediaUrl,
        submitterId: user.uid,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
      
      toast({ title: 'Submission Successful', description: 'Your work has been submitted for review.' });
      router.push('/dashboard');
      
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Submission Failed', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
      return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="bg-secondary">
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl md:text-4xl">Submit Your Work</CardTitle>
                    <CardDescription className="text-lg">Share your cultural expression with Ethiopia and the world.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-base">Submission Title</Label>
                            <Input id="title" placeholder="e.g., 'The Soul of the Krar'" {...register('title')} />
                            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-base">Category</Label>
                            <Controller
                              name="categoryId"
                              control={control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={categoriesLoading}>
                                  <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories?.map(cat => (
                                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cultural-relevance" className="text-base">Cultural Relevance</Label>
                          <Textarea 
                            id="cultural-relevance" 
                            placeholder="Explain the cultural significance of your submission. What traditions, stories, or values does it represent?"
                            rows={5}
                            {...register('culturalRelevance')}
                          />
                           {errors.culturalRelevance && <p className="text-sm text-destructive">{errors.culturalRelevance.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="submission-file" className="text-base">Upload Your Submission (Optional)</Label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="submission-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                        {fileName ? (
                                          <p className="font-semibold text-primary">{fileName}</p>
                                        ) : (
                                          <>
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">Video, Audio, Text, or Images</p>
                                          </>
                                        )}
                                    </div>
                                    <input 
                                      id="submission-file" 
                                      type="file" 
                                      className="hidden" 
                                      {...register('submissionFile', {
                                        onChange: (e) => setFileName(e.target.files?.[0]?.name || '')
                                      })}
                                    />
                                </label>
                            </div> 
                        </div>

                        <div className="text-center pt-4">
                            <Button type="submit" size="lg" className="w-full md:w-auto font-bold" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit for Review
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
