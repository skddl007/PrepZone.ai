const express = require('express');
const bodyParser = require('body-parser');
const registerRoute = require('./routes/register1');
const loginRoute = require('./routes/login1');
const studentsRouter = require('./routes/students1');
const dashboardRouter = require('./routes/dashboard1');

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Use routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/students', studentsRouter);
app.use('/dashboard', dashboardRouter); // Ensure this route exists

module.exports = app;
