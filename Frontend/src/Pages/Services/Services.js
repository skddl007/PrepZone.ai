import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import './Services.css'; // Import custom CSS for additional styling

const services = [
  {
    title: "Admin/Manager Portal Services",
    details: [
      {
        name: "Student Presence Tracking",
        description: "Empower admins and managers to monitor the real-time presence of students within the library premises.",
        image: "https://via.placeholder.com/150/0000FF/808080?text=Student+Presence+Tracking"
      },
      {
        name: "Seat Availability Management",
        description: "Facilitate efficient seat allocation by allowing admins and managers to check and manage the availability of seats easily.",
        image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Seat+Availability+Management"
      },
      {
        name: "Dashboard and Data Analysis",
        description: "Access a robust dashboard offering comprehensive analytical data on library usage, student attendance, and more, enabling informed decision-making.",
        image: "https://via.placeholder.com/150/00FF00/000000?text=Dashboard+and+Data+Analysis"
      },
      {
        name: "Daily Attendance Portal",
        description: "Leverage automatic attendance tracking through location access and sensors, ensuring accurate and real-time monitoring.",
        image: "https://via.placeholder.com/150/FFFF00/000000?text=Daily+Attendance+Portal"
      },
      {
        name: "Analysis Report Generation",
        description: "Generate detailed analytical reports for admins and managers, providing insights into student availability, attendance trends, and other key metrics.",
        image: "https://via.placeholder.com/150/00FFFF/000000?text=Analysis+Report+Generation"
      }
    ]
  },
  {
    title: "Student Portal Services",
    details: [
      {
        name: "Login and Authentication",
        description: "Secure student access through unique library IDs and passwords, ensuring privacy and security.",
        image: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Login+and+Authentication"
      },
      {
        name: "Exam Preparation Tracking",
        description: "Allow students to specify the exams they are preparing for, helping tailor their study plans.",
        image: "https://via.placeholder.com/150/800080/FFFFFF?text=Exam+Preparation+Tracking"
      },
      {
        name: "Competitive Course Details",
        description: "Provide students with information on competitive courses, assisting in the creation of effective daily study schedules.",
        image: "https://via.placeholder.com/150/000080/FFFFFF?text=Competitive+Course+Details"
      },
      {
        name: "Daily Attendance Portal",
        description: "Automate attendance management with location access and sensor technology, ensuring precision and ease.",
        image: "https://via.placeholder.com/150/008080/FFFFFF?text=Daily+Attendance+Portal"
      },
      {
        name: "Progress Report Generation",
        description: "Enable students to generate progress reports based on their attendance and study schedules, fostering self-improvement and accountability.",
        image: "https://via.placeholder.com/150/FFA500/FFFFFF?text=Progress+Report+Generation"
      }
    ]
  },
  {
    title: "Additional Services and Features",
    details: [
      {
        name: "Automatic Attendance Management",
        description: "Eliminate the need for manual register entries by automating attendance tracking, thereby enhancing operational efficiency.",
        image: "https://via.placeholder.com/150/FF6347/FFFFFF?text=Automatic+Attendance+Management"
      },
      {
        name: "Centralized Franchise System",
        description: "Connect libraries across various cities into a single, cohesive system, making it easier for students to find and join libraries based on their preferences.",
        image: "https://via.placeholder.com/150/7FFF00/FFFFFF?text=Centralized+Franchise+System"
      },
      {
        name: "Advertising and Promotion",
        description: "Increase library admissions through targeted advertising and promotional activities, attracting more students to the facilities.",
        image: "https://via.placeholder.com/150/DC143C/FFFFFF?text=Advertising+and+Promotion"
      },
      {
        name: "Elimination of Manual Record Keeping",
        description: "Reduce manpower requirements by automating record-keeping processes, streamlining operations and cutting costs.",
        image: "https://via.placeholder.com/150/00BFFF/FFFFFF?text=Elimination+of+Manual+Record+Keeping"
      }
    ]
  },
  {
    title: "Main Objectives",
    details: [
      {
        name: "Simplify Student Admissions",
        description: "Streamline the admission process across libraries, making it hassle-free for students to enroll.",
        image: "https://via.placeholder.com/150/FFD700/FFFFFF?text=Simplify+Student+Admissions"
      },
      {
        name: "Enhance Library Management",
        description: "Provide tools and insights for better resource management and efficient oversight of student activities.",
        image: "https://via.placeholder.com/150/BDB76B/FFFFFF?text=Enhance+Library+Management"
      },
      {
        name: "Improve Student Learning Experience",
        description: "Offer features that support students in exam preparation and study planning, enhancing their overall learning experience.",
        image: "https://via.placeholder.com/150/FF1493/FFFFFF?text=Improve+Student+Learning+Experience"
      },
      {
        name: "Connect Libraries Across Cities",
        description: "Create a franchise system that interconnects multiple libraries, providing a unified and consistent experience for students nationwide.",
        image: "https://via.placeholder.com/150/1E90FF/FFFFFF?text=Connect+Libraries+Across+Cities"
      }
    ]
  }
];

const Services = () => (
  <Container className="mt-5">
    {services.map((service, index) => (
      <div key={index}>
        <h2 className="service-title mb-4">{service.title}</h2>
        <Row>
          {service.details.map((detail, idx) => (
            <Col md={6} lg={4} key={idx} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Img variant="top" src={detail.image} />
                <Card.Body>
                  <Card.Title className="text-primary">{detail.name}</Card.Title>
                  <Card.Text>{detail.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    ))}
  </Container>
);

export const AdminManagerServices = () => (
  <Container className="mt-5">
    <h2 className="text-center mb-4">Our Services</h2>
    <div>
      <h2 className="service-title mb-4">{services[0].title}</h2>
      <Row>
        {services[0].details.map((detail, idx) => (
          <Col md={6} lg={4} key={idx} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img variant="top" src={detail.image} />
              <Card.Body>
                <Card.Title className="text-primary">{detail.name}</Card.Title>
                <Card.Text>{detail.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  </Container>
);

export default Services;
