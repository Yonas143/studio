'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Heart } from 'lucide-react';

type VerificationStatus = 'loading' | 'success' | 'failed' | 'error';

interface VerificationResult {
    message: string;
    nomineeName?: string;
    voteId?: string;
}

function PaymentCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<VerificationStatus>('loading');
    const [result, setResult] = useState<VerificationResult | null>(null);

    useEffect(() => {
        const txRef = searchParams.get('tx_ref');

        if (!txRef) {
            setStatus('error');
            setResult({ message: 'No transaction reference found' });
            return;
        }

        // Verify the payment
        const verifyPayment = async () => {
            try {
                const response = await fetch(`/api/payments/verify?tx_ref=${txRef}`);
                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    setStatus('success');
                    setResult({
                        message: data.message,
                        nomineeName: data.nomineeName,
                        voteId: data.voteId,
                    });

                    // Update local storage to mark as voted
                    const nomineeId = searchParams.get('nominee_id');
                    if (nomineeId) {
                        const votedNominees = JSON.parse(localStorage.getItem('votedNominees') || '[]');
                        if (!votedNominees.includes(nomineeId)) {
                            votedNominees.push(nomineeId);
                            localStorage.setItem('votedNominees', JSON.stringify(votedNominees));
                        }
                    }
                } else {
                    setStatus('failed');
                    setResult({ message: data.error || 'Payment verification failed' });
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setResult({ message: 'Failed to verify payment. Please try again.' });
            }
        };

        verifyPayment();
    }, [searchParams]);

    const handleGoBack = () => {
        router.push('/nominees');
    };

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    {status === 'loading' && (
                        <>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                            <CardTitle>Verifying Payment</CardTitle>
                            <CardDescription>Please wait while we confirm your payment...</CardDescription>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <CardTitle className="text-green-600">Vote Recorded!</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Your vote for <strong>{result?.nomineeName}</strong> has been successfully recorded.
                            </CardDescription>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                                <XCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <CardTitle className="text-red-600">Payment Failed</CardTitle>
                            <CardDescription className="text-base mt-2">
                                {result?.message || 'Your payment could not be verified.'}
                            </CardDescription>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mb-4">
                                <XCircle className="h-8 w-8 text-yellow-600" />
                            </div>
                            <CardTitle className="text-yellow-600">Something Went Wrong</CardTitle>
                            <CardDescription className="text-base mt-2">
                                {result?.message || 'An unexpected error occurred.'}
                            </CardDescription>
                        </>
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    {status === 'success' && (
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                            <Heart className="h-6 w-6 text-green-600 fill-current mx-auto mb-2" />
                            <p className="text-sm text-green-700">
                                Thank you for your contribution to preserving Ethiopian culture!
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Button onClick={handleGoBack} className="w-full">
                            {status === 'success' ? 'Vote for More Nominees' : 'Try Again'}
                        </Button>
                        <Button variant="outline" onClick={handleGoHome} className="w-full">
                            Go to Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        }>
            <PaymentCallbackContent />
        </Suspense>
    );
}
