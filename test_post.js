const url = 'https://script.google.com/macros/s/AKfycbx5BMTuGLS-w02SjJUIG0rwrdiV8C_oyurViWu4G1406fA1-CUM6Kkx8IstmM7kY1-o2w/exec';

const payload = {
    referenceNumber: "12345",
    name: "Test User",
    fatherName: "Test Father",
    place: "Test Place",
    phone: "11" + Date.now().toString().slice(-8), // random 10-digit number
    email: "test@example.com",
    answers: { "q1": "a" },
    submittedAt: new Date().toISOString()
};

async function testPost() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}

testPost();
