import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="header">
        <h1>✨ Healthcare Appointment Booking System</h1>
        <p>Experience seamless healthcare management with our modern platform</p>
        <button
          className="btn btn-primary check-availability-btn"
          onClick={() => navigate('/availability')}
        >
          👩‍⚕️ Check Availability
        </button>
      </header>

      <div className="container">
        <div className="home-content">
          <h2>🏥 Welcome to Modern Healthcare</h2>
          <p>
            Streamline your healthcare experience with our intuitive appointment booking system. 
            Connect with qualified doctors, manage your appointments, and take control of your health journey.
          </p>

          <div className="home-buttons">
            <button
              className="btn btn-primary home-btn"
              onClick={() => navigate('/new-doctor')}
            >
              👨‍⚕️ Add New Doctor
            </button>
            <button
              className="btn btn-primary home-btn"
              onClick={() => navigate('/book-appointment')}
            >
              📅 Book Appointment
            </button>
            <button
              className="btn btn-secondary home-btn"
              onClick={() => navigate('/appointments')}
            >
              📋 View All Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
