export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="font-headline text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last Updated: November 2024</p>

            <div className="prose prose-lg max-w-none">
                <p className="text-lg mb-8">
                    This Privacy Policy explains how the Cultural Ambassador Award collects, uses, protects, and manages personal information submitted by participants, voters, nominees, judges, and visitors on the Award Website or associated platforms.
                </p>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">1. Information We Collect</h2>
                    <p className="mb-4">We collect the following types of information:</p>

                    <h3 className="font-semibold text-xl mb-2">1.1 Personal Identification Data</h3>
                    <ul className="list-disc pl-6 space-y-1 mb-4">
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Country/region</li>
                        <li>Verification details (for voting authenticity)</li>
                    </ul>

                    <h3 className="font-semibold text-xl mb-2">1.2 Nominee & Submission Data</h3>
                    <ul className="list-disc pl-6 space-y-1 mb-4">
                        <li>Biographical information</li>
                        <li>Photos, videos, and documents submitted for participation</li>
                        <li>Statements, descriptions, or cultural works provided by nominees</li>
                    </ul>

                    <h3 className="font-semibold text-xl mb-2">1.3 Technical Data</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>IP addresses</li>
                        <li>Device information</li>
                        <li>Browser type</li>
                        <li>Usage analytics and cookies</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                    <p className="mb-4">We collect and use data for the following purposes:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Vote Verification:</strong> To ensure each vote is genuine, unique, and compliant with the voting rules.</li>
                        <li><strong>Communication:</strong> To notify voters, nominees, or applicants about updates, confirmations, and official announcements.</li>
                        <li><strong>Award Management:</strong> Processing entries, juror evaluations, and final results.</li>
                        <li><strong>Platform Improvement:</strong> Monitoring usage to enhance website performance and security.</li>
                        <li><strong>Legal & Security Purposes:</strong> Detecting fraud, preventing abuse of the platform, and complying with legal obligations.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">3. How We Protect Your Data</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>All personal data is stored on secure servers with encryption and restricted access.</li>
                        <li>Voting data is anonymized during counting to protect voter identity.</li>
                        <li>Only authorized award administrators and technical partners can access necessary information.</li>
                        <li>We do not sell, lease, or share personal data with third parties for marketing purposes.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">4. Sharing Information</h2>
                    <p className="mb-4">We may share limited, necessary data only with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Technical service providers (for verification and secure data processing)</li>
                        <li>Regulatory bodies if legally required</li>
                        <li>The award jury, but only nominee-related data—not voter identities</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
                    <p>We use cookies to improve user experience, maintain login sessions, and analyze website traffic. Users may accept or decline cookies through their browser settings.</p>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">6. Data Retention</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Voting-related data is retained only for the duration necessary to verify and confirm award integrity.</li>
                        <li>Nominee submissions may be retained for documentation, archives, and future promotional purposes, unless the nominee requests removal.</li>
                        <li>Users may request deletion of their information at any time, subject to legal or operational limitations.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">7. Your Rights</h2>
                    <p className="mb-4">Users have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Request access to their personal data</li>
                        <li>Request correction or deletion</li>
                        <li>Withdraw consent for communications</li>
                        <li>Request anonymization of voting or submission data</li>
                    </ul>
                    <p className="mt-4">All such requests can be directed to the Award Secretariat at: <a href="tel:+251945443450" className="text-primary hover:underline">+251 945 44 34 50</a></p>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">8. Policy Updates</h2>
                    <p>We may revise this policy to reflect improvements or legal updates. Any changes will be posted on the official website with an updated date.</p>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">9. Acceptance</h2>
                    <p>By using the Award Website, submitting entries, or participating in voting, users agree to this Privacy Policy.</p>
                </section>
            </div>
        </div>
    );
}
