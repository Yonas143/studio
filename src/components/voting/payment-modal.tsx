'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Mail, User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    nomineeId: string;
    nomineeName: string;
    fingerprint?: string;
}

export function PaymentModal({ isOpen, onClose, nomineeId, nomineeName, fingerprint }: PaymentModalProps) {
    const [processing, setProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const { toast } = useToast();

    const handlePayment = async () => {
        setProcessing(true);

        try {
            const response = await fetch('/api/payments/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nomineeId,
                    email: email || undefined,
                    firstName: firstName || undefined,
                    lastName: lastName || undefined,
                    phone: phone || undefined,
                    fingerprint,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initialize payment');
            }

            // Redirect to Chapa checkout
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error: any) {
            console.error('Payment initialization error:', error);
            toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: error.message || 'Failed to initialize payment. Please try again.',
            });
            setProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !processing && !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cast Your Vote</DialogTitle>
                    <DialogDescription>
                        Vote for <strong>{nomineeName}</strong> for just <strong>10 ETB</strong>.
                        Fill in your details below (optional) and proceed to payment.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email (optional)
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={processing}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={processing}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone (optional)
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="09xxxxxxxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={processing}
                        />
                    </div>

                    <Button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-2 h-5 w-5" />
                                Pay 10 ETB (CBE Birr / Telebirr)
                            </>
                        )}
                    </Button>
                </div>

                <div className="text-xs text-center text-muted-foreground">
                    <p>Secure payment powered by Chapa</p>
                    <p className="mt-1 font-medium text-primary">Supports: CBE Birr • Telebirr • M-Pesa • Cards</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
