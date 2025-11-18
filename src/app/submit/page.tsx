import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { categories } from '@/lib/data';
import { UploadCloud } from 'lucide-react';

export default function SubmitPage() {
  return (
    <div className="bg-secondary">
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl md:text-4xl">Submit Your Work</CardTitle>
                    <CardDescription className="text-lg">Share your cultural expression with Ethiopia and the world.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-base">Submission Title</Label>
                            <Input id="title" placeholder="e.g., 'The Soul of the Krar'" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-base">Category</Label>
                            <Select>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cultural-relevance" className="text-base">Cultural Relevance</Label>
                          <Textarea 
                            id="cultural-relevance" 
                            placeholder="Explain the cultural significance of your submission. What traditions, stories, or values does it represent?"
                            rows={5}
                          />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="submission-file" className="text-base">Upload Your Submission</Label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="submission-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">Video, Audio, Text, or Images</p>
                                    </div>
                                    <Input id="submission-file" type="file" className="hidden" />
                                </label>
                            </div> 
                        </div>

                        <div className="text-center pt-4">
                            <Button type="submit" size="lg" className="w-full md:w-auto font-bold">Submit for Review</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
