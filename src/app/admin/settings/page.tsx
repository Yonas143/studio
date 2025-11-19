'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your award program settings.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Program Settings</CardTitle>
          <CardDescription>
            These settings control the overall behavior of the awards program.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="program-name">Program Name</Label>
            <Input id="program-name" defaultValue="ABN Studio Cultural Awards" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voting-start">Voting Start Date</Label>
            <Input id="voting-start" type="date" defaultValue="2024-09-01" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voting-end">Voting End Date</Label>
            <Input id="voting-end" type="date" defaultValue="2024-10-31" />
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
