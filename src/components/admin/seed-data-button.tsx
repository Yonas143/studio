'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

export function SeedDataButton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Seed Demo Data
                </CardTitle>
                <CardDescription>
                    Seeding is now managed via the CLI.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Please run <code>npm run seed</code> in your terminal to populate the database.
                </p>
            </CardContent>
        </Card>
    );
}
