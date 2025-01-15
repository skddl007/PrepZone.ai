import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';

const LogIn = ({ handleLogin }) => {
  const [userType, setUserType] = useState('admin');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const handleUserTypeChange = (val) => {
    setUserType(val);
    setFormData({ username: '', password: '' });
    setLoginError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const response = await axios.post('/api/login', {
          email: formData.username,
          password: formData.password,
        });

        if (response.data.message === 'Login successful') {
          handleLogin(userType);
          navigate('/dashboard');
        } else {
          setLoginError(response.data.error || 'Invalid email or password');
        }
      } catch (error) {
        setLoginError('An error occurred while logging in. Please try again.');
        console.error('Login error:', error);
      }
    }
  };

  return (
    <Container className="login-container mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Log In</h2>
          <ToggleButtonGroup type="radio" name="userType" value={userType} onChange={handleUserTypeChange} className="mb-4 w-100">
            <ToggleButton id="admin-radio" value="admin" variant="outline-primary">Admin</ToggleButton>
            <ToggleButton id="student-radio" value="student" variant="outline-primary">Student</ToggleButton>
          </ToggleButtonGroup>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>{userType === 'admin' ? 'Email ID' : 'Library Unique ID'}</Form.Label>
              <Form.Control
                type="text"
                placeholder={userType === 'admin' ? 'Enter Email ID' : 'Enter Library Unique ID'}
                name="username"
                value={formData.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            {loginError && (
              <div className="text-danger mt-3">
                {loginError}
              </div>
            )}

            <Button variant="primary" type="submit" className="w-100 mt-3">Log In</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LogIn;
