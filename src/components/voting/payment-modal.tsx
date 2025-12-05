'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (transactionId: string) => void;
    nomineeName: string;
}

export function PaymentModal({ isOpen, onClose, onSuccess, nomineeName }: PaymentModalProps) {
    const [processing, setProcessing] = useState(false);
    const { toast } = useToast();

    const handlePayment = async (method: 'chapa' | 'telebirr') => {
        setProcessing(true);

        // Simulate payment processing delay
        setTimeout(() => {
            setProcessing(false);
            onClose();

            // Generate a mock transaction ID
            const mockTransactionId = `tx-${Math.random().toString(36).substring(2, 15)}`;

            toast({
                title: "Payment Successful",
                description: `Your payment via ${method === 'chapa' ? 'Chapa' : 'Telebirr'} was successful.`,
            });

            onSuccess(mockTransactionId);
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !processing && !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cast Your Vote</DialogTitle>
                    <DialogDescription>
                        To vote for <strong>{nomineeName}</strong>, a small fee is required.
                        Please select your preferred payment method.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Button
                        variant="outline"
                        className="h-16 justify-start px-4 gap-4 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all"
                        onClick={() => handlePayment('chapa')}
                        disabled={processing}
                    >
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold">Pay with Chapa</span>
                            <span className="text-xs text-muted-foreground">Credit/Debit Cards, Banks</span>
                        </div>
                        {processing && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
                    </Button>

                    <Button
                        variant="outline"
                        className="h-16 justify-start px-4 gap-4 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
                        onClick={() => handlePayment('telebirr')}
                        disabled={processing}
                    >
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Smartphone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold">Pay with Telebirr</span>
                            <span className="text-xs text-muted-foreground">Mobile Money</span>
                        </div>
                        {processing && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
                    </Button>
                </div>

                <div className="text-xs text-center text-muted-foreground mt-2">
                    Secured by Chapa & Telebirr. No login required.
                </div>
            </DialogContent>
        </Dialog>
    );
}
