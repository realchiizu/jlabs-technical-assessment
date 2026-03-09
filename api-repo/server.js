const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;

// This allows your React app to talk to this API
app.use(cors());
// This allows the API to read the JSON data you send
app.use(express.json());

// --- THE SEEDER (Your Fake Database) ---
const users = [
    {
        email: "test@example.com",
        password: "password123"
    }
];

// --- LOGIN API URL: http://localhost:8000/api/login ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists in our "database"
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.status(200).json({ 
            message: "Login successful!", 
            success: true,
            token: "fake-jwt-token-for-now" // This is the "VIP Pass" for the frontend
        });
    } else {
        res.status(401).json({ 
            message: "Invalid email or password", 
            success: false 
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});