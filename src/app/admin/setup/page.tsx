'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminSetupPage() {
    const { user, userProfile, supabase } = useUser();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleBecomeAdmin = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Check if user exists in DB
            const { data: existingUser } = await supabase
                .from('User')
                .select('*')
                .eq('id', user.id)
                .single();

            if (existingUser) {
                const { error } = await supabase
                    .from('User')
                    .update({ role: 'admin' })
                    .eq('id', user.id);
                if (error) throw error;
            } else {
                // Insert new user
                const { error } = await supabase
                    .from('User')
                    .insert({
                        id: user.id,
                        email: user.email!, // Email is required in Supabase Auth usually
                        name: user.user_metadata?.full_name || 'User',
                        role: 'admin',
                    });
                if (error) throw error;
            }

            toast({
                title: "Success",
                description: "You are now an Admin. You can manage categories and nominees.",
            });

            // Force reload to update context
            window.location.reload();

        } catch (error: any) {
            console.error("Error updating role:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update role.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        Admin Setup
                    </CardTitle>
                    <CardDescription>
                        Fix permission issues by granting yourself Admin privileges.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Current Status:</p>
                            <p className="text-lg">{userProfile?.role || 'Guest'}</p>
                            <p className="text-xs text-muted-foreground mt-1">User ID: {user?.id}</p>
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleBecomeAdmin}
                            disabled={isLoading || !user}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Make Me Admin"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
