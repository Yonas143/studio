'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (transactionId: string) => void;
    nomineeName: string;
    amount?: number;
}

export function PaymentModal({ isOpen, onClose, onSuccess, nomineeName, amount = 5 }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handlePayment = async (method: 'chapa' | 'telebirr') => {
        setIsProcessing(true);

        // Simulate payment processing delay
        setTimeout(() => {
            setIsProcessing(false);
            const mockTransactionId = `tx-${Math.random().toString(36).substring(2, 10)}`;

            toast({
                title: 'Payment Successful',
                description: `Thank you for supporting ${nomineeName}!`,
            });

            onSuccess(mockTransactionId);
            onClose();
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isProcessing && !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cast Your Vote</DialogTitle>
                    <DialogDescription>
                        Voting for <strong>{nomineeName}</strong> requires a small fee to support the platform.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <span className="text-sm font-medium">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">{amount} ETB</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                            onClick={() => handlePayment('chapa')}
                            disabled={isProcessing}
                        >
                            <CreditCard className="h-6 w-6 mb-1" />
                            <span>Chapa</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                            onClick={() => handlePayment('telebirr')}
                            disabled={isProcessing}
                        >
                            <Wallet className="h-6 w-6 mb-1" />
                            <span>Telebirr</span>
                        </Button>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    {isProcessing && (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing secure payment...
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
