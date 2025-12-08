'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
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

// Define explicit types matching the API response
interface ApiCategory {
  id: string;
  name: string;
}

interface ApiNominee {
  id: string;
  name: string;
  category: string; // The category Name
  // We might not get categoryId back in the transformed response if we rely on the public GET.
  // BUT the public GET returns `category: name`.
  // Wait, for editing, we need the `categoryId`.
  // The current public GET API transforms `category` to a string name.
  // We should probaby check what GET /api/nominees returns exactly.
  // It returns:
  // category: nomineeWithRelations.category.name,
  // This is a problem for editing - we won't know the ID of the category unless we look it up by name or change the API.
  // However, for now let's assume we can match by name or I'll just save the category Name as the value?
  // NO, the form needs categoryId.
  // I need to update the GET /api/nominees to include categoryId in the response? Or I can just match the name against the categories list.

  region: string;
  scope: string;
  bio: string;
  imageUrl: string | null;
  votes: number;
  featured: boolean;
}

// But wait, the `GET` endpoint returns `category` as a string name.
// And `categories` list has `id` and `name`.
// So I can find the ID from the name if the name is unique.

const nomineeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  region: z.string().min(1, 'Region is required'),
  bio: z.string().min(1, 'Bio is required'),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false),
  scope: z.enum(['ethiopia', 'worldwide']).default('ethiopia'),
});

type NomineeFormData = z.infer<typeof nomineeSchema>;

export default function AdminNomineesPage() {
  const { toast } = useToast();
  const [nominees, setNominees] = useState<ApiNominee[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNominee, setEditingNominee] = useState<ApiNominee | null>(null);

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
      scope: 'ethiopia',
    }
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [nomineesRes, categoriesRes] = await Promise.all([
        fetch('/api/nominees?scope=all'), // Fetch all nominees
        fetch('/api/categories')
      ]);

      if (!nomineesRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch data');

      const nomineesData = await nomineesRes.json();
      const categoriesData = await categoriesRes.json();

      // Handle potential API wrappers
      // Check if the response is an array or wrapped in { data: ... }
      const finalNominees = Array.isArray(nomineesData) ? nomineesData : (nomineesData.data || []);
      const finalCategories = Array.isArray(categoriesData) ? categoriesData : (categoriesData.data || []);

      setNominees(finalNominees);
      setCategories(finalCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load nominees or categories.'
      });
      // Set empty arrays to prevent crashes in map()
      setNominees([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (editingNominee) {
      setValue('name', editingNominee.name);

      // Find category ID from the name
      const category = categories.find(c => c.name === editingNominee.category);
      if (category) {
        setValue('categoryId', category.id);
      }

      setValue('region', editingNominee.region);
      setValue('bio', editingNominee.bio);
      setValue('imageUrl', editingNominee.imageUrl || '');
      setValue('featured', editingNominee.featured || false);
      setValue('scope', (editingNominee.scope as 'ethiopia' | 'worldwide') || 'ethiopia');
    } else {
      reset({
        name: '',
        categoryId: '',
        region: 'Ethiopia',
        bio: '',
        imageUrl: '',
        featured: false,
        scope: 'ethiopia'
      });
    }
  }, [editingNominee, setValue, reset, categories]);


  const handleOpenDialog = (nominee: ApiNominee | null = null) => {
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
      let response;
      if (editingNominee) {
        // Update
        response = await fetch(`/api/nominees/${editingNominee.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        // Create
        response = await fetch('/api/nominees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Operation failed');
      }

      toast({
        title: editingNominee ? 'Nominee Updated' : 'Nominee Added',
        description: `Successfully ${editingNominee ? 'updated' : 'added'} "${data.name}".`,
      });

      handleCloseDialog();
      fetchData(); // Refresh list
    } catch (error: any) {
      console.error('Nominee operation error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (nomineeId: string) => {
    try {
      const response = await fetch(`/api/nominees/${nomineeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast({
        title: 'Nominee Deleted',
        description: 'The nominee has been successfully deleted.',
      });

      fetchData();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: 'Failed to delete nominee. Please try again.',
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
                <Label htmlFor="categoryId">Category</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="categoryId">
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scope">Scope</Label>
                  <Controller
                    name="scope"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="scope">
                          <SelectValue placeholder="Select scope..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethiopia">Ethiopia</SelectItem>
                          <SelectItem value="worldwide">Worldwide</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" {...register('region')} placeholder="e.g., Addis Ababa" />
                  {errors.region && <p className="text-sm text-destructive">{errors.region.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" {...register('bio')} placeholder="A short biography of the nominee." />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Nominee Image</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">Upload Image</Label>
                    <Controller
                      name="imageUrl"
                      control={control}
                      render={({ field }) => (
                        <ImageUpload
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      )}
                    />
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
