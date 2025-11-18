import { Button } from '@/components/ui/button';
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
  PlayCircle,
  Megaphone,
} from 'lucide-react';

const stats = [
  { title: 'Total Participants', value: '1,284', icon: Users, change: '+12.5%' },
  { title: 'Total Submissions', value: '3,402', icon: FileText, change: '+8.2%' },
  { title: 'Registered Judges', value: '48', icon: Gavel, change: '+4' },
  { title: 'Total Votes Cast', value: '1.2M', icon: Vote, change: '+21.7%' },
];

const recentActivity = [
    { description: 'New submission in "Poetry" by Sara Abera.', time: '5m ago'},
    { description: 'Judge Kafu scored "Gondar Awakening".', time: '1h ago'},
    { description: 'Vote fraud detection system flagged 120 votes.', time: '3h ago'},
    { description: 'New user "Dawit G." registered.', time: '5h ago'},
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor the ABN Cultural Awards.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlayCircle className="mr-2 h-4 w-4" /> Launch New Round
          </Button>
          <Button>
            <Megaphone className="mr-2 h-4 w-4" /> Publish Winners
          </Button>
        </div>
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last round</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>An overview of the latest events.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableBody>
                    {recentActivity.map((activity, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="font-medium">{activity.description}</div>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-sm">{activity.time}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button variant="secondary">Manage Participants</Button>
            <Button variant="secondary">Manage Judges</Button>
            <Button variant="secondary">View Vote Analytics</Button>
            <Button variant="secondary">Detect Vote Fraud</Button>
            <Button variant="destructive">Emergency Stop</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
