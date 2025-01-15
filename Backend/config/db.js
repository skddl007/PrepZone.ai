const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Skd6397@@',
  database: 'prepzone'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');

  // Create library_admins table if it doesn't exist
  const createLibraryAdminsTableQuery = `
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
    );
  `;

  // Create students table if it doesn't exist
  const createStudentsTableQuery = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      seat_number VARCHAR(255) NOT NULL,
      mobile_number VARCHAR(20) NOT NULL,
      address TEXT NOT NULL,
      student_unique_id VARCHAR(10) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create student_counter table if it doesn't exist
  const createStudentCounterTableQuery = `
    CREATE TABLE IF NOT EXISTS student_counter (
      library_id INT PRIMARY KEY,
      last_number INT DEFAULT 0,
      FOREIGN KEY (library_id) REFERENCES library_admins(id)
    );
  `;

  // Execute table creation queries in sequence
  db.query(createLibraryAdminsTableQuery, (err) => {
    if (err) {
      console.error('Error creating table "library_admins":', err);
      return;
    }
    console.log('Table "library_admins" exists or created successfully.');

    db.query(createStudentsTableQuery, (err) => {
      if (err) {
        console.error('Error creating table "students":', err);
        return;
      }
      console.log('Table "students" exists or created successfully.');

      db.query(createStudentCounterTableQuery, (err) => {
        if (err) {
          console.error('Error creating table "student_counter":', err);
          return;
        }
        console.log('Table "student_counter" exists or created successfully.');
      });
    });
  });
});

module.exports = db;