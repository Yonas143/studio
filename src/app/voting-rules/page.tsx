export default function VotingRulesPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="font-headline text-4xl font-bold mb-8">Cultural Ambassador Award – Official Voting Rule</h1>

            <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground mb-8">
                    The Cultural Ambassador Award recognizes individuals or groups whose work significantly promotes, preserves, innovates, or elevates Ethiopian cultural heritage. The voting system is designed to ensure fairness, transparency, public engagement, and credibility.
                </p>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">1. Eligibility for Voting</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Voting is open to the general public, Ethiopians at home and abroad.</li>
                        <li>Each individual is allowed one vote per category, verified through a unique identifier (email, phone number, or platform account).</li>
                        <li>Votes from automated systems, bots, or mass-generated accounts will be removed.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">2. Voting Process</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Voting takes place exclusively through the official Award Website and designated SMS or partner platforms (if activated).</li>
                        <li>A voter must select one nominee only in each category.</li>
                        <li>Once submitted, votes cannot be edited, replaced, or withdrawn.</li>
                        <li>The voting period will run for a clearly communicated timeline, after which voting will automatically close.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">3. Verification and Anti-Fraud Measures</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>All votes undergo automated and manual verification to detect duplicates, suspicious activity, and irregular patterns.</li>
                        <li>Any vote submitted using fraudulent methods—multiple emails, fake phone numbers, VPN manipulation, automated tools—will be disqualified.</li>
                        <li>The Award Committee reserves the right to invalidate votes, suspend accounts, or remove entire vote batches if fraud is detected.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">4. Weighting of Votes</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Final results are determined using a hybrid evaluation system:
                            <ul className="list-disc pl-6 mt-2">
                                <li>70% Public Vote</li>
                                <li>30% Jury Score</li>
                            </ul>
                        </li>
                        <li>The professional jury consists of cultural experts, researchers, practitioners, and industry professionals selected by the organizing body.</li>
                        <li>The jury evaluation remains confidential and is based on merit, impact, authenticity, community significance, and innovation.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">5. Announcement of Results</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>The winner in each category is the nominee with the highest combined (public + jury) score.</li>
                        <li>Results will be announced only on the officially designated date and platforms.</li>
                        <li>The organizing body's decision is final and cannot be contested.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">6. Transparency</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Summary voting results (percentage breakdown, not voter data) may be publicly released to ensure transparency.</li>
                        <li>Voter identities and contact details will remain confidential in accordance with the Award's Privacy Policy.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="font-headline text-2xl font-bold mb-4">7. Rights of the Organizers</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>The organizing body reserves the right to suspend voting, modify timelines, or adjust rules if necessary due to technical issues, fraud, or unforeseen circumstances.</li>
                        <li>Participation in the voting process automatically indicates acceptance of all rules stated herein.</li>
                    </ol>
                </section>
            </div>
        </div>
    );
}
