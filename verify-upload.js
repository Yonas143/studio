
const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        const formData = new FormData();
        const blob = new Blob(['test content'], { type: 'text/plain' });
        formData.append('file', blob, 'test-upload.txt');

        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error('Upload failed with status:', response.status);
            const text = await response.text();
            console.error('Response:', text);
        } else {
            const data = await response.json();
            console.log('Upload successful:', data);
        }
    } catch (error) {
        console.error('Test script error:', error);
    }
}

testUpload();
