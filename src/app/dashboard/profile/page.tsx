'use client';

import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
    const { user, userProfile, loading } = useUser();

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/4" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="grid gap-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user || !userProfile) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Profile</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and account settings.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Your account details as they appear on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-2 border-border">
                            <AvatarImage
                                src={userProfile.photoURL || user.user_metadata?.avatar_url || `https://picsum.photos/seed/${user.id}/100/100`}
                                alt={userProfile.name}
                            />
                            <AvatarFallback className="text-2xl">{userProfile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 text-center md:text-left">
                            <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mt-2">
                                {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                defaultValue={userProfile.name}
                                readOnly
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                Display name for your account.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                defaultValue={user.email}
                                readOnly
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                Email used for notifications and login.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
