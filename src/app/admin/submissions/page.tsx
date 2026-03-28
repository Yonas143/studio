'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Check, Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Submission {
    id: string;
    title: string;
    category: string;
    fullName: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    fileUrl?: string;
}

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const fetchSubmissions = async () => {
        try {
            const response = await fetch('/api/submissions');
            const data = await response.json();
            if (data.success) {
                setSubmissions(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load submissions',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            const response = await fetch(`/api/submissions/${id}/approve`, {
                method: 'POST',
            });
            const data = await response.json();

            if (data.success) {
                toast({ title: 'Success', description: 'Submission approved and nominee created' });
                fetchSubmissions();
            } else {
                throw new Error(data.error || 'Failed to approve');
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            const response = await fetch(`/api/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Rejected' }),
            });
            const data = await response.json();
            if (data.success) {
                toast({ title: 'Rejected', description: 'Submission has been rejected.' });
                fetchSubmissions();
            } else {
                throw new Error(data.error || 'Failed to reject');
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Submissions</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Nominee Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Submitted By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No submissions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>
                                            {format(new Date(submission.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell className="font-medium">{submission.title}</TableCell>
                                        <TableCell>{submission.category}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{submission.fullName}</span>
                                                <span className="text-xs text-muted-foreground">{submission.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    submission.status === 'approved'
                                                        ? 'default'
                                                        : submission.status === 'rejected'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                }
                                            >
                                                {submission.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {submission.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(submission.id)}
                                                        disabled={!!processingId}
                                                    >
                                                        {processingId === submission.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <><Check className="mr-1 h-4 w-4" /> Approve</>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleReject(submission.id)}
                                                        disabled={!!processingId}
                                                    >
                                                        <X className="mr-1 h-4 w-4" /> Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
