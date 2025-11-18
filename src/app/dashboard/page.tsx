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
import { Badge } from '@/components/ui/badge';
import { userSubmissions } from '@/lib/data';
import type { Submission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const statusVariant: { [key in Submission['status']]: 'default' | 'secondary' | 'destructive' } = {
  Approved: 'default',
  Pending: 'secondary',
  Rejected: 'destructive',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome, Jane!</h1>
          <p className="text-muted-foreground">Here's an overview of your submissions.</p>
        </div>
        <Button asChild>
          <Link href="/submit">
            <PlusCircle className="mr-2 h-4 w-4" /> New Submission
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Submission Status</CardTitle>
          <CardDescription>Track the review process of your submitted work.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.title}</TableCell>
                  <TableCell>{submission.category}</TableCell>
                  <TableCell>{submission.submissionDate}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[submission.status]}>{submission.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
