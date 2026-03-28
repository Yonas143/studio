'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Submission {
    id: string;
    title: string;
    description?: string;
    category: string;
    fileUrl?: string;
    portfolioUrl?: string;
    fullName: string;
    email: string;
    phone?: string;
    status: string;
    createdAt: string;
}

export default function AdminSubmissionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params?.id as string;

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/submissions/${id}`)
            .then(r => r.json())
            .then(d => {
                if (d.success) setSubmission(d.data);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleApprove = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`/api/submissions/${id}/approve`, { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                toast({ title: 'Approved', description: 'Nominee created successfully.' });
                setSubmission(prev => prev ? { ...prev, status: 'approved' } : prev);
            } else throw new Error(data.error);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`/api/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Rejected' }),
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: 'Rejected', description: 'Submission has been rejected.' });
                setSubmission(prev => prev ? { ...prev, status: 'rejected' } : prev);
            } else throw new Error(data.error);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    );

    if (!submission) return (
        <div className="text-center py-20">
            <p className="text-muted-foreground">Submission not found.</p>
            <Button asChild variant="outline" className="mt-4"><Link href="/admin/submissions">Back</Link></Button>
        </div>
    );

    const statusVariant = submission.status === 'approved' ? 'default' : submission.status === 'rejected' ? 'destructive' : 'secondary';

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/submissions"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Submissions</Link>
                </Button>
                {submission.status === 'pending' && (
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleApprove} disabled={processing}>
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="mr-1 h-4 w-4" /> Approve</>}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={handleReject} disabled={processing}>
                            <X className="mr-1 h-4 w-4" /> Reject
                        </Button>
                    </div>
                )}
            </div>

            <div>
                <h1 className="text-3xl font-bold font-headline">{submission.title}</h1>
                <div className="flex items-center gap-4 mt-2">
                    <Badge variant={statusVariant}>{submission.status}</Badge>
                    <span className="text-sm text-muted-foreground">Category: <strong className="text-foreground">{submission.category}</strong></span>
                    {submission.createdAt && (
                        <span className="text-sm text-muted-foreground">Submitted: <strong className="text-foreground">{format(new Date(submission.createdAt), 'PPP')}</strong></span>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Submitter Information</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Name:</strong> {submission.fullName}</p>
                    <p><strong>Email:</strong> {submission.email}</p>
                    {submission.phone && <p><strong>Phone:</strong> {submission.phone}</p>}
                    {submission.portfolioUrl && (
                        <p><strong>Portfolio:</strong> <a href={submission.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{submission.portfolioUrl}</a></p>
                    )}
                </CardContent>
            </Card>

            {submission.description && (
                <Card>
                    <CardHeader><CardTitle>Description / Cultural Relevance</CardTitle></CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-line text-muted-foreground">{submission.description}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Attached file or photo for this submission.</CardDescription>
                </CardHeader>
                <CardContent>
                    {submission.fileUrl ? (
                        <div className="rounded-lg overflow-hidden border">
                            {submission.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img src={submission.fileUrl} alt="Submission media" className="w-full max-h-96 object-contain" />
                            ) : (
                                <div className="p-6 text-center">
                                    <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">View Attached File</a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No media attached.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
