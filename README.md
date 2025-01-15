PrepZone.ai

A React-based web application featuring user authentication and role-based dashboards (admin and student). It integrates with an Express.js backend for data fetching and leverages React Router for seamless navigation between pages.

## Features

- **User Authentication**: Handles login and role-based navigation.
- **Role-Based Dashboards**: Distinct views for Admin and Student users.
- **API Integration**: Fetches data from an Express.js API.
- **Routing**: Implements React Router for SPA navigation.
- **Responsive UI**: Uses Bootstrap for consistent and responsive design.

## File Structure

```
.
├── components
│   ├── Footer
│   │   └── Footer.js
│   ├── Header
│       └── Header.js
├── Pages
│   ├── About
│   │   └── AboutPage.js
│   ├── Contact
│   │   └── Contact.js
│   ├── Dashboard
│   │   ├── Admin_Dash.js
│   │   └── Student_Dash.js
│   ├── Home
│   │   └── HomePage.js
│   ├── LogIn
│   │   └── LogIn.js
│   ├── Register
│   │   └── RegisterPage.js
│   └── Services
│       └── Services.js
├── App.css
├── App.js
├── index.js
└── package.json
```

## Installation

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Steps

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the Application**
   ```bash
   npm start
   # or
   yarn start
   ```

   The application will be available at `http://localhost:3000/`.

4. **Run the Backend (Express.js)**
   Ensure the backend is running at `http://localhost:8000` for the API to function properly.

## API Integration

The app fetches data from the Express.js API endpoint:

- **Endpoint**: `http://localhost:8000/api/data`
- **Purpose**: Displays a message from the backend on the homepage.
- **Error Handling**: Logs errors to the console if the API call fails.

## Routing

### Routes

| Path           | Component          | Description                                   |
|----------------|--------------------|-----------------------------------------------|
| `/`            | HomePage           | Landing page of the application              |
| `/register`    | RegisterPage       | User registration page                       |
| `/login`       | LogIn              | Login page with role selection functionality |
| `/contact`     | Contact            | Contact information page                     |
| `/about`       | AboutPage          | About the application                        |
| `/services`    | Services           | Services offered                             |
| `/dashboard`   | Admin_Dash/Student_Dash | Role-based dashboards                     |
| `*`            | Redirect to `/login` | Handles undefined routes                    |

### Protected Routes
- Access to `/dashboard` is restricted to authenticated users. The displayed dashboard depends on the user's role (`admin` or `student`).

## Tech Stack

- **Frontend**: React.js, React Router, Bootstrap
- **Backend**: Express.js (API integration)
- **Styling**: Bootstrap, Custom CSS

## How to Use

1. **Register**: Navigate to `/register` to create an account.
2. **Login**: Use `/login` to sign in and select your role (admin or student).
3. **Dashboard**: Access personalized content based on your role via `/dashboard`.
4. **API Data**: Observe the fetched API data displayed as an alert on the homepage.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

