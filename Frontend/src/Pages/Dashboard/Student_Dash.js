import React from 'react';
import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import './Student_Dash.css';

const StudentDash = () => {
  return (
    <Container fluid className="p-4 student-dash-container">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Student Dashboard</h1>
        </Col>
      </Row>
      
      {/* Exam Preparation Tracking */}
      <Row className="mb-4">
        <Col>
          <Card className="custom-card">
            <Card.Header className="custom-card-header">Exam Preparation Tracking</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="examName">
                  <Form.Label>Exam Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter the name of the exam" />
                </Form.Group>
                <Form.Group controlId="examDate" className="mt-3">
                  <Form.Label>Exam Date</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
                <Button variant="primary" className="mt-3">Add Exam</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Competitive Course Details */}
      <Row className="mb-4">
        <Col>
          <Card className="custom-card">
            <Card.Header className="custom-card-header">Competitive Course Details</Card.Header>
            <Card.Body>
              <Table striped bordered hover className="custom-table">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Description</th>
                    <th>Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Course 1</td>
                    <td>Detailed description of Course 1</td>
                    <td>Daily Schedule for Course 1</td>
                  </tr>
                  <tr>
                    <td>Course 2</td>
                    <td>Detailed description of Course 2</td>
                    <td>Daily Schedule for Course 2</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Daily Attendance Portal */}
      <Row className="mb-4">
        <Col>
          <Card className="custom-card">
            <Card.Header className="custom-card-header">Daily Attendance Portal</Card.Header>
            <Card.Body>
              <Button variant="success">Mark Attendance</Button>
              <p className="mt-3">Location access and sensor technology will ensure precision and ease in attendance management.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Progress Report Generation */}
      <Row className="mb-4">
        <Col>
          <Card className="custom-card">
            <Card.Header className="custom-card-header">Progress Report Generation</Card.Header>
            <Card.Body>
              <Button variant="info">Generate Progress Report</Button>
              <p className="mt-3">Generate progress reports based on your attendance and study schedules to foster self-improvement and accountability.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentDash;
