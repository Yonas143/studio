'use client';

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
import {
  Users,
  Gavel,
  FileText,
  Vote,
} from 'lucide-react';
import { useCollection } from '@/firebase';
import type { Submission, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';


export default function AdminDashboardPage() {
    const { data: users, loading: usersLoading } = useCollection<UserProfile>('users');
    const { data: submissions, loading: submissionsLoading } = useCollection<Submission>('submissions');
    const { data: votes, loading: votesLoading } = useCollection('votes');

    const loading = usersLoading || submissionsLoading || votesLoading;

    const stats = [
        { title: 'Total Participants', value: users?.filter(u => u.role === 'participant').length ?? 0, icon: Users, loading },
        { title: 'Total Submissions', value: submissions?.length ?? 0, icon: FileText, loading },
        { title: 'Registered Judges', value: users?.filter(u => u.role === 'judge').length ?? 0, icon: Gavel, loading },
        { title: 'Total Votes Cast', value: votes?.length ?? 0, icon: Vote, loading },
    ];

    const recentSubmissions = submissions?.slice(0, 5) || [];


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          A real-time overview of the ABN Cultural Awards.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {stat.loading ? <Skeleton className="h-8 w-20" /> : (
                    <div className="text-2xl font-bold">{stat.value}</div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Recent Submissions</CardTitle>
                    <CardDescription>The latest five entries from participants.</CardDescription>
                </div>
                <Button asChild variant="outline">
                    <Link href="/admin/submissions">View all submissions <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            </TableRow>
                        ))
                    ): recentSubmissions.length > 0 ? (
                        recentSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.title}</TableCell>
                            <TableCell>{submission.categoryId}</TableCell>
                            <TableCell>
                               <Badge variant={submission.status === 'Pending' ? 'secondary' : submission.status === 'Approved' ? 'default' : 'destructive'}>
                                {submission.status}
                               </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">No submissions yet.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
