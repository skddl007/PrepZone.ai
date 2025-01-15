const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Handle login
router.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }

    const query = 'SELECT id, library_name, owner_name FROM library_admins WHERE email = ? AND password = ?';
    
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Error during login',
                details: err.message
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // In a production environment, you should:
        // 1. Never store plain-text passwords
        // 2. Use password hashing (e.g., bcrypt)
        // 3. Implement proper session management
        // 4. Use JWT or similar token-based authentication

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: results[0].id,
                libraryName: results[0].library_name,
                ownerName: results[0].owner_name
            }
        });
    });
});

module.exports = router;