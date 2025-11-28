'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminSetupPage() {
    const { user, userProfile } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleBecomeAdmin = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const userRef = doc(firestore, 'users', user.uid);

            // Check if doc exists first
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                await updateDoc(userRef, {
                    role: 'admin',
                    updatedAt: new Date().toISOString()
                });
            } else {
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || 'User',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                });
            }

            toast({
                title: "Success",
                description: "You are now an Admin. You can manage categories and nominees.",
            });

            // Force reload to update claims/profile context if needed
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
                            <p className="text-xs text-muted-foreground mt-1">User ID: {user?.uid}</p>
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
