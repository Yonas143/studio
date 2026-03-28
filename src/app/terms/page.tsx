'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold font-headline mb-4">Terms of Service</h1>
                <p className="text-muted-foreground">Last Updated: 2026</p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">1. Introduction</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                        Welcome to the Cultural Ambassador Award platform. By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to all of the terms and conditions, you may not access the service.
                    </p>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">2. User Eligibility</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                        You must be at least 18 years old or have the consent of a legal guardian to participate in the voting or nomination process. We reserve the right to verify eligibility at any time.
                    </p>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">3. Voting Rules</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                        Each user is permitted to cast one vote per nominee. Any attempt to manipulate the voting system through multiple accounts, bots, or any other automated means will result in the disqualification of your votes and potential suspension of your account.
                    </p>
                    <p>
                        For detailed information on the voting process, please refer to our <a href="/voting-rules" className="text-primary hover:underline">Voting Rules</a>.
                    </p>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">4. Nomination Submissions</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                        By submitting a nomination, you represent and warrant that the information provided is accurate and that you have the right to share any uploaded media. The Cultural Ambassador Award committee reserves the right to reject submissions that are incomplete, inaccurate, or inappropriate.
                    </p>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">5. Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                        All content on this platform, including text, graphics, logos, and software, is the property of ABN Studio or its content suppliers and is protected by international copyright laws.
                    </p>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">6. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                        In no event shall ABN Studio be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the service.
                    </p>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground mt-12">
                <p>If you have any questions about these Terms, please contact us at <a href="mailto:yoni.win.yw@gmail.com" className="text-primary hover:underline">yoni.win.yw@gmail.com</a></p>
            </div>
        </div>
    );
}
