const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
    const { 
        libraryName, 
        ownerName, 
        seatsAvailable, 
        mobileNumber, 
        email, 
        password, 
        address 
    } = req.body;

    // Validate required fields
    const requiredFields = {
        libraryName,
        ownerName,
        seatsAvailable,
        mobileNumber,
        email,
        password,
        address
    };

    for (const [field, value] of Object.entries(requiredFields)) {
        if (!value) {
            return res.status(400).json({
                error: `${field} is required`
            });
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email format'
        });
    }

    // Validate mobile number (assuming 10-digit format)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
        return res.status(400).json({
            error: 'Invalid mobile number format'
        });
    }

    // Validate seats (must be positive number)
    if (isNaN(seatsAvailable) || seatsAvailable <= 0) {
        return res.status(400).json({
            error: 'Seats must be a positive number'
        });
    }

    const registerQuery = `
        INSERT INTO library_admins (
            library_name, 
            owner_name, 
            seats, 
            mobile, 
            email, 
            password, 
            address
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        registerQuery,
        [libraryName, ownerName, seatsAvailable, mobileNumber, email, password, address],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        error: 'Email already registered'
                    });
                }

                return res.status(500).json({
                    error: 'Error during registration',
                    details: err.message
                });
            }

            // Initialize student counter for this library
            const initCounterQuery = `
                INSERT INTO student_counter (library_id, last_number) 
                VALUES (?, 0)
            `;

            db.query(initCounterQuery, [result.insertId], (err) => {
                if (err) {
                    console.error('Error initializing student counter:', err);
                    // Continue anyway as this is not critical
                }
            });

            res.status(201).json({
                message: 'Registration successful',
                libraryId: result.insertId
            });
        }
    );
});

module.exports = router;