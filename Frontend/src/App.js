import axios from 'axios'; // Import axios
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react'; // Import useEffect
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AboutPage from './Pages/About/AboutPage';
import Contact from './Pages/Contact/Contact';
import Admin_Dash from './Pages/Dashboard/Admin_Dash';
import Student_Dash from './Pages/Dashboard/Student_Dash';
import HomePage from './Pages/Home/Home';
import LogIn from './Pages/LogIn/LogIn';
import RegisterPage from './Pages/Register/Register';
import Services from './Pages/Services/Services';

function App() {
  // State to track login status and user role
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'student'
  const [apiData, setApiData] = useState(null); // State to store API data

  // Simulated login function (replace with actual logic)
  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  // Fetch data from the Express API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/data'); // Fetching data from Express
        setApiData(response.data.message); // Storing the response in state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          {/* Display fetched data (for testing purposes) */}
          {apiData && <div className="alert alert-info">{apiData}</div>}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<Services />} />
            
            {/* Dashboard Routing based on user role */}
            <Route 
              path="/dashboard" 
              element={
                isLoggedIn ? (
                  userRole === 'admin' ? <Admin_Dash /> : <Student_Dash />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Redirecting undefined paths to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
