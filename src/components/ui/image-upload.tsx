'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    className?: string;
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = async (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                variant: 'destructive',
                title: 'Invalid file type',
                description: 'Please upload an image file.',
            });
            return;
        }

        // Validate file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                variant: 'destructive',
                title: 'File too large',
                description: 'Image must be less than 5MB.',
            });
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            onChange(data.url);

            toast({
                title: 'Image uploaded',
                description: 'Your image has been uploaded successfully.',
            });
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                variant: 'destructive',
                title: 'Upload failed',
                description: error.message || 'There was an error uploading your image.',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={onInputChange}
                disabled={disabled || isUploading}
            />

            {!value ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-colors",
                        isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50",
                        (disabled || isUploading) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2 text-center">
                            <div className="p-4 bg-muted rounded-full">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-medium">Click to upload or drag and drop</p>
                                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
                    <Image
                        src={value}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={handleRemove}
                            disabled={disabled}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
