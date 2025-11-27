'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Nominee, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const nomineeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  region: z.string().min(1, 'Region is required'),
  bio: z.string().min(1, 'Bio is required'),
  imageId: z.string().optional(),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false),
}).refine(data => data.imageId || data.imageUrl, {
  message: "Either an Image ID or an uploaded Image is required",
  path: ["imageUrl"],
});

type NomineeFormData = z.infer<typeof nomineeSchema>;

export default function AdminNomineesPage() {
  const { data: nominees, loading: nomineesLoading } = useCollection<Nominee>('nominees');
  const { data: categories, loading: categoriesLoading } = useCollection<Category>('categories');
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNominee, setEditingNominee] = useState<Nominee | null>(null);

  const loading = nomineesLoading || categoriesLoading;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<NomineeFormData>({
    resolver: zodResolver(nomineeSchema),
    defaultValues: {
      featured: false,
    }
  });

  useEffect(() => {
    if (editingNominee) {
      setValue('name', editingNominee.name);
      setValue('category', editingNominee.category);
      setValue('region', editingNominee.region);
      setValue('bio', editingNominee.bio);
      setValue('imageId', editingNominee.imageId);
      setValue('imageUrl', editingNominee.imageUrl);
      setValue('featured', editingNominee.featured || false);
    } else {
      reset({ name: '', category: '', region: '', bio: '', imageId: '', imageUrl: '', featured: false });
    }
  }, [editingNominee, setValue, reset]);


  const handleOpenDialog = (nominee: Nominee | null = null) => {
    setEditingNominee(nominee);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingNominee(null);
    setIsDialogOpen(false);
    reset();
  }


  const onSubmit = async (data: NomineeFormData) => {
    setIsSubmitting(true);
    try {
      if (editingNominee) {
        // Update existing nominee
        const nomineeDoc = doc(firestore, 'nominees', editingNominee.id);
        await updateDoc(nomineeDoc, data);
        toast({
          title: 'Nominee Updated',
          description: `Successfully updated "${data.name}".`,
        });
        handleCloseDialog();
      } else {
        // Add new nominee
        await addDoc(collection(firestore, 'nominees'), { ...data, votes: 0, media: [] });
        toast({
          title: 'Nominee Added',
          description: `Successfully added "${data.name}".`,
        });
        handleCloseDialog();
      }
    } catch (error: any) {
      console.error('Nominee operation error:', error);
      toast({
        variant: 'destructive',
        title: editingNominee ? 'Update Failed' : 'Add Failed',
        description: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (nomineeId: string) => {
    try {
      const nomineeDoc = doc(firestore, 'nominees', nomineeId);
      await deleteDoc(nomineeDoc);
      toast({
        title: 'Nominee Deleted',
        description: 'The nominee has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error.message || 'Failed to delete nominee. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Nominees</h1>
          <p className="text-muted-foreground">Add, edit, or remove award nominees.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          if (!isOpen) handleCloseDialog();
          else setIsDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Nominee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNominee ? 'Edit Nominee' : 'Add a New Nominee'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nominee Name</Label>
                <Input id="name" {...register('name')} placeholder="e.g., Aster Aweke" />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={categoriesLoading}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map(c => (
                          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" {...register('region')} placeholder="e.g., Addis Ababa" />
                {errors.region && <p className="text-sm text-destructive">{errors.region.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" {...register('bio')} placeholder="A short biography of the nominee." />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Nominee Image</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">Upload Image</Label>
                    <Controller
                      name="imageUrl"
                      control={control}
                      render={({ field }) => (
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageId" className="text-xs text-muted-foreground">Or use Placeholder ID</Label>
                    <Input id="imageId" {...register('imageId')} placeholder="e.g., nominee-1" />
                    <p className="text-xs text-muted-foreground">
                      Find available IDs in <code className='bg-muted p-1 rounded-sm'>src/lib/placeholder-images.json</code>.
                    </p>
                  </div>
                </div>
                {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="featured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="featured">Feature this nominee on the homepage</Label>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingNominee ? 'Save Changes' : 'Add Nominee'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Nominees</CardTitle>
          <CardDescription>A list of all current award nominees.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : nominees && nominees.length > 0 ? (
                nominees.map((nominee) => (
                  <TableRow key={nominee.id}>
                    <TableCell className="font-medium">{nominee.name}</TableCell>
                    <TableCell>{nominee.category}</TableCell>
                    <TableCell>{nominee.region}</TableCell>
                    <TableCell>{nominee.featured ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(nominee)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the nominee "{nominee.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(nominee.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No nominees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
