'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Use dynamic import for react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const insightSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().optional(),
});

type InsightFormData = z.infer<typeof insightSchema>;

export default function AdminInsightsPage() {
  const { data: insights, loading } = useCollection<Insight>('insights', { orderBy: ['createdAt', 'desc'] });
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);

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
    const collectionRef = collection(firestore, 'insights');

    try {
      if (editingInsight) {
        const docRef = doc(firestore, 'insights', editingInsight.id);
        await updateDoc(docRef, { ...data });
        toast({ title: 'Insight Updated', description: `Successfully updated the article "${data.title}".` });
      } else {
        await addDoc(collectionRef, { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Insight Added', description: `Successfully added the article "${data.title}".` });
      }
      handleCloseDialog();
    } catch (err: any) {
        const permissionError = new FirestorePermissionError({
            path: editingInsight ? `insights/${editingInsight.id}` : collectionRef.path,
            operation: editingInsight ? 'update' : 'create',
            requestResourceData: data
        });
        errorEmitter.emit('permission-error', permissionError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (insightId: string) => {
    const docRef = doc(firestore, 'insights', insightId);
    try {
        await deleteDoc(docRef);
        toast({ title: 'Insight Deleted', description: 'The article has been successfully deleted.' });
    } catch (err: any) {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete'
        });
        errorEmitter.emit('permission-error', permissionError);
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
                  <TableCell>{insight.createdAt?.seconds ? new Date(insight.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
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
