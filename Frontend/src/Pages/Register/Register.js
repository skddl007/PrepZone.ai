import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Register.css'; // Import custom CSS for additional styling

const Register = () => {
  const [formData, setFormData] = useState({
    libraryName: '',
    ownerName: '',
    seatsAvailable: '',
    mobileNumber: '',
    email: '',
    address: '',
    password: '', // Add password field in the formData state
  });

  const navigate = useNavigate(); // Create navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/register', { // Update this to your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is okay (status in the range 200-299)
      if (response.ok) {
        // Redirect to login page after successful registration
        navigate('/LogIn'); // Ensure the path matches your route configuration
      } else {
        // Log or alert the error message from the response
        const errorData = await response.json(); // Assuming your API returns JSON
        console.error('Registration failed:', errorData.message || 'Unknown error');
        alert('Registration failed. Please try again.'); // Notify the user
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error with the registration. Please try again.'); // Notify the user
    }
  };

  return (
    <Container className="register-container mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Register Your Library</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formLibraryName">
              <Form.Label>Reading Library Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Library Name"
                name="libraryName"
                value={formData.libraryName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formOwnerName">
              <Form.Label>Owner Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Owner Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSeatsAvailable">
              <Form.Label>No. of Seats Available</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter No. of Seats"
                name="seatsAvailable"
                value={formData.seatsAvailable}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formMobileNumber">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
