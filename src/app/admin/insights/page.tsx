'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Insight } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// Use dynamic import for react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const insightSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().optional(),
});

type InsightFormData = z.infer<typeof insightSchema>;

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('CulturalInsight')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setInsights((data as unknown as Insight[]) || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast({ title: 'Error', description: 'Failed to fetch insights', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<InsightFormData>({
    resolver: zodResolver(insightSchema),
  });

  const contentValue = watch('content');

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const handleOpenDialog = (insight: Insight | null = null) => {
    if (insight) {
      setEditingInsight(insight);
      setValue('title', insight.title);
      setValue('content', insight.content);
      setValue('imageUrl', insight.imageUrl);
    } else {
      reset();
      setEditingInsight(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingInsight(null);
    setIsDialogOpen(false);
    reset();
  }

  const onSubmit = async (data: InsightFormData) => {
    setIsSubmitting(true);
    try {
      if (editingInsight) {
        const { error } = await supabase.from('CulturalInsight').update({
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
          updatedAt: new Date().toISOString()
        }).eq('id', editingInsight.id);

        if (error) throw error;

        toast({ title: 'Insight Updated', description: `Successfully updated the article "${data.title}".` });
      } else {
        const { error } = await supabase.from('CulturalInsight').insert({
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
          isPublished: true, // Defaulting to true as per previous logic implied immediate publish
        });

        if (error) throw error;
        toast({ title: 'Insight Added', description: `Successfully added the article "${data.title}".` });
      }
      handleCloseDialog();
      fetchInsights();
    } catch (err: any) {
      console.error('Error saving insight:', err);
      toast({ title: 'Error', description: 'Failed to save insight.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (insightId: string) => {
    try {
      const { error } = await supabase.from('CulturalInsight').delete().eq('id', insightId);
      if (error) throw error;

      toast({ title: 'Insight Deleted', description: 'The article has been successfully deleted.' });
      fetchInsights();
    } catch (err: any) {
      console.error('Error deleting insight:', err);
      toast({ title: 'Error', description: 'Failed to delete insight.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Insights</h1>
          <p className="text-muted-foreground">Add, edit, or remove articles.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Insight
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{editingInsight ? 'Edit Insight' : 'Add a New Insight'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input {...register('title')} placeholder="Article Title" className="text-lg font-semibold" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}

              <ImageUpload value={watch('imageUrl')} onChange={(url) => setValue('imageUrl', url)} />

              <ReactQuill
                value={contentValue}
                onChange={(value) => setValue('content', value, { shouldValidate: true })}
                modules={quillModules}
                className="h-64 mb-12"
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}

              <div className="flex justify-end pt-8">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingInsight ? 'Save Changes' : 'Publish Insight'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Articles</CardTitle>
          <CardDescription>A list of all current cultural insight articles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {insights?.map((insight) => (
                <TableRow key={insight.id}>
                  <TableCell className="font-medium">{insight.title}</TableCell>
                  <TableCell>{insight.createdAt ? new Date(insight.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="ghost" size="icon"><Link href={`/cultural-insight/${insight.id}`} target="_blank"><Edit className="h-4 w-4" /></Link></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(insight)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete the article "{insight.title}".</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(insight.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && insights?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">No articles found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
