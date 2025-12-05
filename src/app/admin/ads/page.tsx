'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Save, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

interface AdConfig {
    imageUrl: string;
    linkUrl: string;
    active: boolean;
}

interface AdsData {
    leftAd: AdConfig;
    rightAd: AdConfig;
}

const defaultAd: AdConfig = {
    imageUrl: '/files/10gif-1.gif',
    linkUrl: 'https://example.com',
    active: true,
};

export default function AdManagementPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [ads, setAds] = useState<AdsData>({
        leftAd: { ...defaultAd, imageUrl: '/files/10gif-1.gif' },
        rightAd: { ...defaultAd, imageUrl: '/files/10gif-1.gif' },
    });
    const { toast } = useToast();

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch('/api/ads');
                if (res.ok) {
                    const data = await res.json();
                    setAds(data);
                }
            } catch (error) {
                console.error('Error fetching ads:', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load ad configuration.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [toast]);

    const handleImageUpload = async (file: File, side: 'leftAd' | 'rightAd') => {
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setAds(prev => ({
                ...prev,
                [side]: {
                    ...prev[side],
                    imageUrl: data.url,
                },
            }));

            toast({
                title: 'Image Uploaded',
                description: 'Don\'t forget to save your changes.',
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'Could not upload the image.',
            });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ads),
            });

            if (!res.ok) throw new Error('Failed to save');

            toast({
                title: 'Changes Saved',
                description: 'Ad configuration has been updated successfully.',
            });
        } catch (error) {
            console.error('Error saving ads:', error);
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'Could not save changes.',
            });
        } finally {
            setSaving(false);
        }
    };

    const updateAd = (side: 'leftAd' | 'rightAd', field: keyof AdConfig, value: any) => {
        setAds(prev => ({
            ...prev,
            [side]: {
                ...prev[side],
                [field]: value,
            },
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ad Management</h1>
                    <p className="text-muted-foreground">Manage the bottom banner advertisements displayed on the website.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Ad Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Left Bottom Ad
                            <Switch
                                checked={ads.leftAd.active}
                                onCheckedChange={(checked) => updateAd('leftAd', 'active', checked)}
                            />
                        </CardTitle>
                        <CardDescription>
                            {ads.leftAd.active ? 'Currently Active (Bottom Left)' : 'Currently Inactive'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Ad Image</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] relative bg-muted/20">
                                {ads.leftAd.imageUrl ? (
                                    <div className="relative w-full h-[300px]">
                                        <Image
                                            src={ads.leftAd.imageUrl}
                                            alt="Left Ad"
                                            fill
                                            className="object-contain"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => updateAd('leftAd', 'imageUrl', '')}
                                        >
                                            <EyeOff className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground mb-2">Upload an image (300x100 recommended)</p>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="max-w-xs mx-auto"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file, 'leftAd');
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="left-link">Target URL</Label>
                            <Input
                                id="left-link"
                                placeholder="https://example.com"
                                value={ads.leftAd.linkUrl}
                                onChange={(e) => updateAd('leftAd', 'linkUrl', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Right Ad Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Right Bottom Ad
                            <Switch
                                checked={ads.rightAd.active}
                                onCheckedChange={(checked) => updateAd('rightAd', 'active', checked)}
                            />
                        </CardTitle>
                        <CardDescription>
                            {ads.rightAd.active ? 'Currently Active (Bottom Right)' : 'Currently Inactive'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Ad Image</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] relative bg-muted/20">
                                {ads.rightAd.imageUrl ? (
                                    <div className="relative w-full h-[300px]">
                                        <Image
                                            src={ads.rightAd.imageUrl}
                                            alt="Right Ad"
                                            fill
                                            className="object-contain"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => updateAd('rightAd', 'imageUrl', '')}
                                        >
                                            <EyeOff className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground mb-2">Upload an image (300x100 recommended)</p>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="max-w-xs mx-auto"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file, 'rightAd');
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="right-link">Target URL</Label>
                            <Input
                                id="right-link"
                                placeholder="https://example.com"
                                value={ads.rightAd.linkUrl}
                                onChange={(e) => updateAd('rightAd', 'linkUrl', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
