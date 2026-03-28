"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

const submissionSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  nomineeName: z.string().min(1, "Nominee name is required"),
  category: z.string().min(1, "Category is required"),
  biography: z.string().min(100, "Biography must be at least 100 characters"),
  culturalRelevance: z.string().min(100, "Cultural relevance statement must be at least 100 characters"),
  mediaUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  photoUrl: z.string().url("Please upload a photo").optional().or(z.literal("")),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

export default function SubmitPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.data || []))
      .catch(() => {});
  }, []);

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      nomineeName: "",
      category: "",
      biography: "",
      culturalRelevance: "",
      mediaUrl: "",
      photoUrl: "",
    },
  });

  const onSubmit = async (values: SubmissionFormValues) => {
    setIsSubmitting(true);
    try {
      // Combine biography and cultural relevance for the description field
      const description = `BIOGRAPHY:\n${values.biography}\n\nCULTURAL RELEVANCE:\n${values.culturalRelevance}`;

      const payload = {
        title: values.nomineeName,
        description: description,
        category: values.category,
        fileUrl: values.photoUrl,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        portfolioUrl: values.mediaUrl,
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      toast({
        title: "Submission successful!",
        description: "Thank you for your submission. It is now pending review.",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "There was an error processing your submission. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Submit a Nomination</CardTitle>
          <CardDescription>
            Complete the form below to nominate a cultural ambassador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., +251 911 234 567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <h3 className="text-xl font-semibold font-headline">Nominee Details</h3>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="nomineeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nominee&apos;s Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nominee&apos;s Photo</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, high-quality headshot is recommended.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category of Nomination</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(c => (
                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="biography"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nominee Biography</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed biography of the nominee..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include their background, achievements, and contributions to their cultural field.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="culturalRelevance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cultural Relevance Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain why this nominee is a significant cultural ambassador..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Focus on their impact, influence, and the importance of their work in a modern context.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mediaUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supporting Media Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/media" {...field} />
                      </FormControl>
                      <FormDescription>
                        A link to a portfolio, video, or other relevant online media.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} size="lg">
                  {isSubmitting ? "Submitting..." : "Submit Nomination"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
function Separator() {
  return <hr className="my-8 border-border" />;
}
