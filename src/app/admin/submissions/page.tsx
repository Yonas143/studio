'use client';

import { useCollection } from '@/firebase';
import type { Submission } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export default function AdminSubmissionsPage() {
    const { data: submissions, loading } = useCollection<Submission>('submissions');
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleStatusChange = async (id: string, status: 'Approved' | 'Rejected') => {
        const submissionRef = doc(firestore, 'submissions', id);
        try {
            await updateDoc(submissionRef, { status });
            toast({
                title: 'Status Updated',
                description: `Submission has been ${status.toLowerCase()}.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error updating status',
                description: error.message,
            });
        }
    };


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Manage Submissions</h1>
                <p className="text-muted-foreground">Approve, reject, and review all entries.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Submissions</CardTitle>
                    <CardDescription>A complete list of all submissions from participants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Submitter ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : submissions && submissions.length > 0 ? (
                                submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">{submission.title}</TableCell>
                                        <TableCell>{submission.categoryId}</TableCell>
                                        <TableCell className="font-mono text-xs">{submission.submitterId}</TableCell>
                                        <TableCell>
                                            <Badge variant={submission.status === 'Pending' ? 'secondary' : submission.status === 'Approved' ? 'default' : 'destructive'}>
                                                {submission.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {submission.status === 'Pending' && (
                                                <>
                                                    <Button variant="ghost" size="icon" onClick={() => handleStatusChange(submission.id!, 'Approved')}>
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleStatusChange(submission.id!, 'Rejected')}>
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </>
                                            )}
                                             <Button variant="outline" size="sm">
                                                View <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No submissions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
