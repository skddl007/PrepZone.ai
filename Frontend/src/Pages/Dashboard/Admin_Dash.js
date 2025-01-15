import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { FaChair, FaChartBar, FaClipboardList, FaFileAlt, FaUsers } from 'react-icons/fa';
import './Admin_Dash.css';

const Dash_Admin = () => {
  // State to handle modal visibility
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [studentData, setStudentData] = useState({ name: '', mobileNo: '', address: '' });
  const [newStudent, setNewStudent] = useState({ id: '', password: '' });
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    studentsPresentToday: 0,
    totalSeats: 0,
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSuccessClose = () => setShowSuccess(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, mobileNo, address } = studentData;

    if (!name || !mobileNo || !address) {
      alert("Please fill all fields");
      return;
    }

    const student = {
      name,
      mobileNo,
      address,
    };

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Error adding student');
      }

      const data = await response.json();
      const studentID = `${data.libraryName.slice(0, 4)}${mobileNo.slice(-4)}`;
      const studentPassword = Math.random().toString(36).slice(-8);

      // Update dashboard data
      const updatedData = await fetch('/api/dashboard').then(res => res.json());
      setDashboardData(updatedData);

      setNewStudent({ id: studentID, password: studentPassword });
      setShowSuccess(true);
      handleClose();
      setStudentData({ name: '', mobileNo: '', address: '' });

    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const { totalStudents, studentsPresentToday, totalSeats } = dashboardData;

  return (
    <Container fluid className="dashboard">
      <h1 className="text-center my-4">Admin Dashboard</h1>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow mb-4">
            <Card.Body>
              <Card.Title><FaUsers /> Add Student</Card.Title>
              <Card.Text>
                <h2>{totalStudents}</h2>
              </Card.Text>
              <Button variant="primary" onClick={handleShow}>Add Student</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow mb-4">
            <Card.Body>
              <Card.Title><FaUsers /> Students Present Today / Total Students</Card.Title>
              <Card.Text>
                <h2>{studentsPresentToday} / {totalStudents}</h2>
              </Card.Text>
              <Button variant="primary">View Details</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow mb-4">
            <Card.Body>
              <Card.Title><FaChair /> Seat Availability</Card.Title>
              <Card.Text>
                <h2>{totalSeats - studentsPresentToday} Seats Available</h2>
              </Card.Text>
              <Button variant="primary">Manage Seats</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow mb-4">
            <Card.Body>
              <Card.Title><FaClipboardList /> Daily Attendance Portal</Card.Title>
              <Card.Text>
                <p>Automatic attendance tracking is enabled.</p>
                <Button variant="primary">Track Attendance</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow mb-4">
            <Card.Body>
              <Card.Title><FaChartBar /> Dashboard & Data Analysis</Card.Title>
              <Card.Text>
                <p>Access robust analytical data on library usage.</p>
                <Button variant="primary">View Analytics</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow mb-4">
            <Card.Body>
              <Card.Title><FaFileAlt /> Analysis Report Generation</Card.Title>
              <Card.Text>
                <p>Generate detailed reports for insights.</p>
                <Button variant="primary">Generate Report</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for adding student */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formStudentName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="Enter student's name" value={studentData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formStudentMobileNo">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control type="text" name="mobileNo" placeholder="Enter mobile number" value={studentData.mobileNo} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formStudentAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" placeholder="Enter address" value={studentData.address} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">Add Student</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success Modal for displaying student ID and password */}
      <Modal show={showSuccess} onHide={handleSuccessClose}>
        <Modal.Header closeButton>
          <Modal.Title>Student Added Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Student ID:</strong> {newStudent.id}</p>
          <p><strong>Password:</strong> {newStudent.password}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSuccessClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dash_Admin;
