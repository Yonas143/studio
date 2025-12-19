
async function testVote() {
    const nomineeId = '9c104e7b-c393-47a3-abf1-171887e1f1ca'; // Mulatu Astatke
    const fingerprint = 'test-fingerprint-' + Math.random().toString(36).substring(7);

    try {
        console.log(`Voting for nominee ${nomineeId}...`);
        const response = await fetch('http://localhost:9002/api/votes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nomineeId,
                fingerprint
            }),
        });

        const data = await response.json();
        console.log('Vote response:', response.status, data);
    } catch (error: any) {
        console.error('Vote failed:', error.message);
    }
}

testVote();
