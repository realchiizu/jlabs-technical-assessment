const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;


app.use(cors());

app.use(express.json());


const users = [
    {
        email: "test@example.com",
        password: "password123"
    }
];


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;


    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.status(200).json({ 
            message: "Login successful!", 
            success: true,
            token: "demo-session-token" 
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

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}


module.exports = app;