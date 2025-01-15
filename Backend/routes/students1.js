const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add a new student
router.post('/', (req, res) => {
    const { name, seat_number, mobile_number, address } = req.body;

    // Validate required fields
    if (!name || !seat_number || !mobile_number || !address) {
        return res.status(400).json({
            error: 'All fields are required: name, seat_number, mobile_number, address'
        });
    }

    // Validate mobile number format
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile_number)) {
        return res.status(400).json({
            error: 'Invalid mobile number format'
        });
    }

    // Check capacity and generate student ID
    const capacityCheck = `
        SELECT 
            la.id as library_id,
            la.library_name,
            la.seats,
            COUNT(s.id) as current_students
        FROM library_admins la
        LEFT JOIN students s ON 1=1
        GROUP BY la.id, la.library_name, la.seats
        LIMIT 1
    `;

    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({
                error: 'Transaction error',
                details: err.message
            });
        }

        db.query(capacityCheck, (err, results) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({
                        error: 'Error checking capacity',
                        details: err.message
                    });
                });
            }

            if (results.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({
                        error: 'No library configuration found'
                    });
                });
            }

            const { library_id, library_name, seats, current_students } = results[0];

            if (current_students >= seats) {
                return db.rollback(() => {
                    res.status(400).json({
                        error: 'Cannot add more students, total seats exceeded'
                    });
                });
            }

            // Update counter and get new student ID
            const updateCounter = `
                UPDATE student_counter 
                SET last_number = last_number + 1 
                WHERE library_id = ?
            `;

            db.query(updateCounter, [library_id], (err) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({
                            error: 'Error updating counter',
                            details: err.message
                        });
                    });
                }

                // Get the updated counter value
                db.query(
                    'SELECT last_number FROM student_counter WHERE library_id = ?',
                    [library_id],
                    (err, counterResult) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({
                                    error: 'Error getting counter value',
                                    details: err.message
                                });
                            });
                        }

                        const sequentialNumber = counterResult[0].last_number;
                        const paddedNumber = String(sequentialNumber).padStart(3, '0');
                        const studentUniqueId = `${library_name.slice(0, 3).toUpperCase()}${paddedNumber}`;

                        // Insert new student
                        const insertStudent = `
                            INSERT INTO students (
                                name,
                                seat_number,
                                mobile_number,
                                address,
                                student_unique_id
                            ) VALUES (?, ?, ?, ?, ?)
                        `;

                        db.query(
                            insertStudent,
                            [name, seat_number, mobile_number, address, studentUniqueId],
                            (err, result) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({
                                            error: 'Error adding student',
                                            details: err.message
                                        });
                                    });
                                }

                                db.commit(err => {
                                    if (err) {
                                        return db.rollback(() => {
                                            res.status(500).json({
                                                error: 'Error committing transaction',
                                                details: err.message
                                            });
                                        });
                                    }

                                    res.status(201).json({
                                        message: 'Student added successfully',
                                        studentId: result.insertId,
                                        studentUniqueId: studentUniqueId
                                    });
                                });
                            }
                        );
                    }
                );
            });
        });
    });
});

// Fetch all students
router.get('/', (req, res) => {
    const query = `
        SELECT 
            id,
            student_unique_id,
            name,
            seat_number,
            mobile_number,
            address,
            created_at
        FROM students
        ORDER BY created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: 'Error fetching students',
                details: err.message
            });
        }

        res.status(200).json(results);
    });
});

// Get a specific student by ID
router.get('/:id', (req, res) => {
    const query = `
        SELECT 
            id,
            student_unique_id,
            name,
            seat_number,
            mobile_number,
            address,
            created_at
        FROM students
        WHERE id = ?
    `;

    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: 'Error fetching student',
                details: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.status(200).json(results[0]);
    });
});

module.exports = router;