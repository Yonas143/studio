'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

interface Popup {
    id: string;
    type: 'video' | 'image' | 'text';
    title: string;
    description?: string;
    videoUrl?: string;
    imageUrl?: string;
    imageLink?: string;
    isActive: boolean;
    delaySeconds: number;
    storageKey: string;
}

export default function PopupsPage() {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        type: 'text' as 'video' | 'image' | 'text',
        title: '',
        description: '',
        videoUrl: '',
        imageUrl: '',
        imageLink: '',
        isActive: true,
        delaySeconds: 2,
        storageKey: '',
    });

    const firestore = useFirestore();
    const { toast } = useToast();

    useEffect(() => {
        loadPopups();
    }, []);

    const loadPopups = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'popups'));
            const popupsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Popup[];
            setPopups(popupsData);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load popups',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const popupData = {
                type: formData.type,
                title: formData.title,
                description: formData.description || null,
                videoUrl: formData.videoUrl || null,
                imageUrl: formData.imageUrl || null,
                imageLink: formData.imageLink || null,
                isActive: formData.isActive,
                delaySeconds: formData.delaySeconds,
                storageKey: formData.storageKey || `popup-${Date.now()}`,
            };

            console.log('Submitting popup data:', popupData);

            if (editingId) {
                await updateDoc(doc(firestore, 'popups', editingId), popupData);
                console.log('Popup updated:', editingId);
                toast({ title: 'Success', description: 'Popup updated successfully' });
            } else {
                const docRef = await addDoc(collection(firestore, 'popups'), popupData);
                console.log('Popup created with ID:', docRef.id);
                toast({ title: 'Success', description: 'Popup created successfully' });
            }

            resetForm();
            await loadPopups();
        } catch (error) {
            console.error('Error saving popup:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Failed to save popup: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (popup: Popup) => {
        setEditingId(popup.id);
        setFormData({
            type: popup.type,
            title: popup.title,
            description: popup.description || '',
            videoUrl: popup.videoUrl || '',
            imageUrl: popup.imageUrl || '',
            imageLink: popup.imageLink || '',
            isActive: popup.isActive,
            delaySeconds: popup.delaySeconds,
            storageKey: popup.storageKey,
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this popup?')) return;

        try {
            await deleteDoc(doc(firestore, 'popups', id));
            toast({ title: 'Success', description: 'Popup deleted successfully' });
            loadPopups();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete popup',
            });
        }
    };

    const toggleActive = async (popup: Popup) => {
        try {
            await updateDoc(doc(firestore, 'popups', popup.id), {
                isActive: !popup.isActive,
            });
            toast({ title: 'Success', description: `Popup ${!popup.isActive ? 'activated' : 'deactivated'}` });
            loadPopups();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update popup status',
            });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            type: 'text',
            title: '',
            description: '',
            videoUrl: '',
            imageUrl: '',
            imageLink: '',
            isActive: true,
            delaySeconds: 2,
            storageKey: '',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Popup Management"
                description="Create and manage announcement popups, ads, and video popups"
            />

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Popup' : 'Create New Popup'}</CardTitle>
                        <CardDescription>Configure popup content and behavior</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Popup Type</Label>
                                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Text Announcement</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="image">Image/Ad</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            {formData.type === 'text' && (
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                    />
                                </div>
                            )}

                            {formData.type === 'video' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="videoUrl">Video URL or Upload</Label>
                                        <Input
                                            id="videoUrl"
                                            placeholder="YouTube embed URL or /files/video.mp4"
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="videoFile">Or Upload Video (.mp4)</Label>
                                        <Input
                                            id="videoFile"
                                            type="file"
                                            accept="video/mp4"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const fileName = `${Date.now()}-${file.name}`;
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    formData.append('fileName', fileName);

                                                    try {
                                                        const response = await fetch('/api/upload', {
                                                            method: 'POST',
                                                            body: formData,
                                                        });

                                                        if (response.ok) {
                                                            const data = await response.json();
                                                            setFormData(prev => ({ ...prev, videoUrl: data.url }));
                                                            toast({ title: 'Success', description: 'Video uploaded successfully' });
                                                        } else {
                                                            toast({ variant: 'destructive', title: 'Error', description: 'Failed to upload video' });
                                                        }
                                                    } catch (error) {
                                                        toast({ variant: 'destructive', title: 'Error', description: 'Upload failed' });
                                                    }
                                                }
                                            }}
                                        />
                                        {formData.videoUrl && formData.videoUrl.startsWith('/files/') && (
                                            <p className="text-sm text-muted-foreground">Uploaded: {formData.videoUrl}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            {formData.type === 'image' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="imageUrl">Image URL or Upload</Label>
                                        <Input
                                            id="imageUrl"
                                            placeholder="/path/to/image.jpg"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="imageFile">Or Upload Image</Label>
                                        <Input
                                            id="imageFile"
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const fileName = `${Date.now()}-${file.name}`;
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    formData.append('fileName', fileName);

                                                    try {
                                                        const response = await fetch('/api/upload', {
                                                            method: 'POST',
                                                            body: formData,
                                                        });

                                                        if (response.ok) {
                                                            const data = await response.json();
                                                            setFormData(prev => ({ ...prev, imageUrl: data.url }));
                                                            toast({ title: 'Success', description: 'Image uploaded successfully' });
                                                        } else {
                                                            toast({ variant: 'destructive', title: 'Error', description: 'Failed to upload image' });
                                                        }
                                                    } catch (error) {
                                                        toast({ variant: 'destructive', title: 'Error', description: 'Upload failed' });
                                                    }
                                                }
                                            }}
                                        />
                                        {formData.imageUrl && formData.imageUrl.startsWith('/files/') && (
                                            <p className="text-sm text-muted-foreground">Uploaded: {formData.imageUrl}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="imageLink">Link (Optional)</Label>
                                        <Input
                                            id="imageLink"
                                            placeholder="https://example.com"
                                            value={formData.imageLink}
                                            onChange={(e) => setFormData({ ...formData, imageLink: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="delaySeconds">Delay (seconds)</Label>
                                <Input
                                    id="delaySeconds"
                                    type="number"
                                    min="0"
                                    value={formData.delaySeconds}
                                    onChange={(e) => setFormData({ ...formData, delaySeconds: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="storageKey">Storage Key (unique identifier)</Label>
                                <Input
                                    id="storageKey"
                                    placeholder="popup-2025-announcement"
                                    value={formData.storageKey}
                                    onChange={(e) => setFormData({ ...formData, storageKey: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="isActive">Active</Label>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingId ? 'Update' : 'Create'} Popup
                                </Button>
                                {editingId && (
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold">Active Popups</h3>
                    {popups.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                No popups created yet
                            </CardContent>
                        </Card>
                    ) : (
                        popups.map((popup) => (
                            <Card key={popup.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold">{popup.title}</h4>
                                                <span className={`text-xs px-2 py-1 rounded ${popup.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {popup.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Type: {popup.type} • Delay: {popup.delaySeconds}s
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => toggleActive(popup)}
                                            >
                                                <Switch checked={popup.isActive} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(popup)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(popup.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
