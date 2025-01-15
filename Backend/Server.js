const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret in production

app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Skd6397@@',
  database: 'prepzone'
};

// Database connection pool
const pool = mysql.createPool(dbConfig);

// Function to create tables if they don't exist
async function createTablesIfNotExist() {
  const connection = await pool.getConnection();
  try {
    // Create library_admins table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS library_admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        library_name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        seats INT NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        student_unique_id VARCHAR(10) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create student_counter table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_counter (
        library_id INT PRIMARY KEY,
        last_number INT DEFAULT 0,
        FOREIGN KEY (library_id) REFERENCES library_admins(id)
      )
    `);

    console.log('Tables created or already exist');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    connection.release();
  }
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  });
};

// Admin Registration
app.post('/api/admin/register', async (req, res) => {
  const { libraryName, ownerName, seatsAvailable, mobileNumber, email, password, address } = req.body;

  // Input validation
  if (!libraryName || !ownerName || !seatsAvailable || !mobileNumber || !email || !password || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        'INSERT INTO library_admins (library_name, owner_name, seats, mobile, email, password, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [libraryName, ownerName, seatsAvailable, mobileNumber, email, hashedPassword, address]
      );

      await connection.execute('INSERT INTO student_counter (library_id, last_number) VALUES (?, 0)', [result.insertId]);

      await connection.commit();
      res.status(201).json({ message: 'Admin registered successfully', adminId: result.insertId });
    } catch (error) {
      await connection.rollback();
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already registered' });
      }
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error during registration' });
  }
});

// Login (for both Admin and Student)
app.post('/api/login', async (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res.status(400).json({ error: 'Username, password, and user type are required' });
  }

  try {
    const connection = await pool.getConnection();
    let query, params;

    if (userType === 'admin') {
      query = 'SELECT id, library_name, owner_name, password FROM library_admins WHERE email = ?';
      params = [username];
    } else if (userType === 'student') {
      query = 'SELECT id, name, password FROM students WHERE student_unique_id = ?';
      params = [username];
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const [rows] = await connection.execute(query, params);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, type: userType }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      userType,
      userName: userType === 'admin' ? user.library_name : user.name,
      ownerName: userType === 'admin' ? user.owner_name : null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

// Add Student (Admin only)
app.post('/api/admin/add-student', verifyToken, async (req, res) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { name, mobileNo, address } = req.body;

  if (!name || !mobileNo || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Get library name and increment student counter
      const [adminRows] = await connection.execute('SELECT library_name FROM library_admins WHERE id = ?', [req.userId]);
      const [counterRows] = await connection.execute('SELECT last_number FROM student_counter WHERE library_id = ?', [req.userId]);
      
      const libraryPrefix = adminRows[0].library_name.slice(0, 3).toUpperCase();
      const newStudentNumber = counterRows[0].last_number + 1;
      const studentUniqueId = `${libraryPrefix}${newStudentNumber.toString().padStart(3, '0')}`;

      // Hash the mobile number to use as password
      const hashedPassword = await bcrypt.hash(mobileNo, 10);

      // Insert new student
      await connection.execute(
        'INSERT INTO students (name, mobile_number, address, student_unique_id, password) VALUES (?, ?, ?, ?, ?)',
        [name, mobileNo, address, studentUniqueId, hashedPassword]
      );

      // Update student counter
      await connection.execute('UPDATE student_counter SET last_number = ? WHERE library_id = ?', [newStudentNumber, req.userId]);

      await connection.commit();

      res.status(201).json({
        message: 'Student added successfully',
        studentId: studentUniqueId,
        password: mobileNo // In a real-world scenario, you might want to send this securely or not send it at all
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ error: 'Error adding student' });
  }
});

// Get Dashboard Data (Admin)
app.get('/api/admin/dashboard', verifyToken, async (req, res) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM students) as totalStudents,
        la.seats as totalSeats,
        la.library_name,
        la.owner_name
      FROM library_admins la
      WHERE la.id = ?
    `, [req.userId]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const dashboardData = {
      totalStudents: rows[0].totalStudents,
      totalSeats: rows[0].totalSeats,
      seatsAvailable: rows[0].totalSeats - rows[0].totalStudents,
      libraryName: rows[0].library_name,
      ownerName: rows[0].owner_name
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

// Get Student Dashboard Data
app.get('/api/student/dashboard', verifyToken, async (req, res) => {
  if (req.userType !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT name, student_unique_id FROM students WHERE id = ?', [req.userId]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // You can add more student-specific data here
    const dashboardData = {
      name: rows[0].name,
      studentId: rows[0].student_unique_id,
      // Add more student-specific data as needed
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Student dashboard data error:', error);
    res.status(500).json({ error: 'Error fetching student dashboard data' });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    await createTablesIfNotExist();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();

