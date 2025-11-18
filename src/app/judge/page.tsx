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
import { judgeSubmissions } from '@/lib/data';
import type { JudgeSubmission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const statusVariant: { [key in JudgeSubmission['status']]: 'default' | 'secondary' | 'destructive' } = {
  Scored: 'default',
  'Feedback Provided': 'default',
  Pending: 'secondary',
};

export default function JudgeDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Judge's Portal</h1>
        <p className="text-muted-foreground">Submissions awaiting your review.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Submissions</CardTitle>
          <CardDescription>Review and score the following submissions based on the criteria provided.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nominee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {judgeSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.nomineeName}</TableCell>
                  <TableCell>{submission.category}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[submission.status]}>{submission.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="default" size="sm">
                        <Link href={`/judge/submission/${submission.id}`}>
                          Review Submission <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
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
