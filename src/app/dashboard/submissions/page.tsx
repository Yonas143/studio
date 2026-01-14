'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Submission {
    id: string;
    title: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    fileUrl?: string;
}

export default function MySubmissionsPage() {
    const { user, loading: userLoading } = useUser();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                const response = await fetch(`/api/submissions?email=${encodeURIComponent(user.email)}`);
                const data = await response.json();

                if (data.success) {
                    setSubmissions(data.data);
                } else {
                    throw new Error(data.error || 'Failed to fetch submissions');
                }
            } catch (error) {
                console.error('Error fetching submissions:', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not load your submissions.',
                });
            } finally {
                setLoading(false);
            }
        };

        if (!userLoading && user) {
            fetchSubmissions();
        } else if (!userLoading && !user) {
            setLoading(false);
        }
    }, [user, userLoading, toast]);

    if (userLoading || loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-96 flex-col items-center justify-center space-y-4 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Authentication Required</h2>
                <p className="text-muted-foreground">Please log in to view your submissions.</p>
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Submissions</h1>
                <p className="text-muted-foreground">
                    Track the status of your submitted works.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Submission History</CardTitle>
                    <CardDescription>
                        A list of all your submissions to the Cultural Ambassador Award.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date Submitted</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        You haven't made any submissions yet.
                                        <div className="mt-4">
                                            <Button asChild variant="outline">
                                                <Link href="/submit">Submit a Work</Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">{submission.title}</TableCell>
                                        <TableCell>{submission.category}</TableCell>
                                        <TableCell>
                                            {format(new Date(submission.createdAt), 'MMM d, yyyy')}
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
                                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                            </Badge>
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
