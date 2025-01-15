const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Fetch dashboard statistics
router.get('/', (req, res) => {
    const dashboardQuery = `
        SELECT 
            (SELECT COUNT(*) FROM students) as totalStudents,
            la.seats as totalSeats,
            la.library_name,
            la.owner_name
        FROM library_admins la
        LIMIT 1
    `;

    db.query(dashboardQuery, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                error: 'Error fetching dashboard data',
                details: err.message 
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'No library configuration found'
            });
        }

        const dashboardData = {
            totalStudents: results[0].totalStudents,
            totalSeats: results[0].totalSeats,
            seatsAvailable: results[0].totalSeats - results[0].totalStudents,
            libraryName: results[0].library_name,
            ownerName: results[0].owner_name
        };

        res.status(200).json(dashboardData);
    });
});

module.exports = router;