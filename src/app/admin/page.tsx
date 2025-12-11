'''
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
  FileText,
  Vote,
} from 'lucide-react';
import type { Submission, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SeedDataButton } from '@/components/admin/seed-data-button';

type AdminStats = {
  participants: number;
  submissions: number;
  votes: number;
  categories: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, submissionsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/submissions?limit=5&orderBy=createdAt&order=desc'),
          fetch('/api/categories')
        ]);

        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        const submissionsData = await submissionsRes.json();
        if (submissionsData.success) {
            setRecentSubmissions(submissionsData.data);
        }

        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
            setCategories(categoriesData.data);
        }

      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Participants', value: stats?.participants ?? 0, icon: Users, loading },
    { title: 'Total Submissions', value: stats?.submissions ?? 0, icon: FileText, loading },
    { title: 'Total Votes Cast', value: stats?.votes ?? 0, icon: Vote, loading },
  ];

  const categoryMap = useMemo(() => {
    if (!categories) return new Map();
    return new Map(categories.map(c => [c.id, c.name]));
  }, [categories]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          A real-time overview of the ABN Cultural Awards.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-6 sm:grid-cols-2">
            {statCards.map((stat) => (
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
        </div>
        <div>
          <SeedDataButton />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-.tsx">
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
                ) : recentSubmissions && recentSubmissions.length > 0 ? (
                  recentSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.title}</TableCell>
                      <TableCell>{categoryMap.get(submission.categoryId) || submission.categoryId}</TableCell>
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
    </div >
  );
}
'''