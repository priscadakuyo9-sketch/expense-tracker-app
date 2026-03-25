const https = require('https');

function request(url, options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function run() {
    try {
        const loginData = await request('https://expense-tracker-app-biq1.onrender.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { 
            email: 'test@example.com', 
            password: 'password123' 
        });

        if (!loginData.access_token) return;

        const token = loginData.access_token;
        const statusData = await request('https://expense-tracker-app-biq1.onrender.com/budgets/status', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        console.log('HAS_BUDGET:', statusData.hasBudget);
        console.log('LIMIT_AMOUNT:', statusData.limitAmount);
        console.log('TOTAL_SPENT:', statusData.totalSpent);
        console.log('PERIOD:', statusData.period);
        console.log('DEBUG_USER:', statusData.debug?.userId);
        console.log('DEBUG_PERIOD:', statusData.debug?.period);

    } catch (e) {
        console.error('Error:', e.message);
    }
    process.exit(0);
}

run();
