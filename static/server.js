const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

// In-memory user store
const users = {};

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: 'Username and password required.' });
    }
    if (users[username]) {
        return res.json({ success: false, message: 'Username already exists.' });
    }
    users[username] = { password };
    return res.json({ success: true });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: 'Username and password required.' });
    }
    if (!users[username] || users[username].password !== password) {
        return res.json({ success: false, message: 'Invalid credentials.' });
    }
    return res.json({ success: true });
});

// Add these endpoints for index.html functionality

// Mock /ask endpoint
app.post('/ask', (req, res) => {
    let query = req.body.query || req.query.query;
    if (!query && req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        // Parse body if not already parsed
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            query = params.get('query');
            res.json({ answer: `Echo: ${query}` });
        });
    } else {
        res.json({ answer: `Echo: ${query}` });
    }
});

// Mock /upload endpoint
app.post('/upload', (req, res) => {
    res.json({ message: 'File uploaded (mock response).' });
});

// Mock /reload endpoint
app.post('/reload', (req, res) => {
    res.json({ message: 'Data reloaded (mock response).' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 