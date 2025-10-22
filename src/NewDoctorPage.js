import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from './api';
import './index.css';

function NewDoctorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: '',
    email: '',
    slots_per_day: ''
  });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await doctorAPI.addDoctor({
        name: doctorForm.name,
        specialty: doctorForm.specialty,
        email: doctorForm.email,
        slots_per_day: parseInt(doctorForm.slots_per_day)
      });

            showMessage('✅ Doctor added successfully! A welcome email has been sent to their email address. Welcome to our team!', 'success');
      setDoctorForm({ name: '', specialty: '', email: '', slots_per_day: '' });
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      showMessage('❌ Error adding doctor: ' + (error.response?.data?.detail || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>✨ Healthcare Appointment Booking System</h1>
        <p>Add qualified medical professionals to your team</p>
        <button
          className="btn btn-primary check-availability-btn"
          onClick={() => navigate('/availability')}
        >
          👩‍⚕️ Check Availability
        </button>
      </header>

      <div className="container">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {loading && <div className="loading">Adding doctor to the system...</div>}

        <div className="section">
          <h2>👨‍⚕️ Add New Doctor</h2>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            Register a new medical professional to expand our healthcare services
          </p>
          
          <form onSubmit={handleAddDoctor}>
            <div className="form-group">
              <label>👤 Doctor Name:</label>
              <input
                type="text"
                value={doctorForm.name}
                onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                required
                placeholder="e.g., Dr. Sarah Johnson"
              />
            </div>
            <div className="form-group">
              <label>📧 Email Address:</label>
              <input
                type="email"
                value={doctorForm.email}
                onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                required
                placeholder="e.g., dr.sarah.johnson@hospital.com"
              />
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#718096' }}>
                Email notifications will be sent to this address for new appointments
              </small>
            </div>
            <div className="form-group">
              <label>🏥 Medical Specialty:</label>
              <input
                type="text"
                value={doctorForm.specialty}
                onChange={(e) => setDoctorForm({...doctorForm, specialty: e.target.value})}
                required
                placeholder="e.g., Cardiology, Dermatology, Pediatrics"
              />
            </div>
            <div className="form-group">
              <label>📅 Daily Appointment Slots:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={doctorForm.slots_per_day}
                onChange={(e) => setDoctorForm({...doctorForm, slots_per_day: e.target.value})}
                required
                placeholder="e.g., 10"
              />
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#718096' }}>
                Number of patients this doctor can see per day
              </small>
            </div>
            
            <div className="navigation-buttons">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Adding Doctor...' : '✅ Add Doctor'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                🏠 Back to Home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewDoctorPage;
