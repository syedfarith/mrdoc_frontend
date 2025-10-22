import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from './api';
import './index.css';

function AvailabilityPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityStatus = (doctor) => {
    if (doctor.available_slots > 5) return { status: 'high', emoji: '🟢', text: 'High Availability' };
    if (doctor.available_slots > 2) return { status: 'medium', emoji: '🟡', text: 'Limited Availability' };
    if (doctor.available_slots > 0) return { status: 'low', emoji: '🟠', text: 'Few Slots Left' };
    return { status: 'none', emoji: '🔴', text: 'Fully Booked' };
  };

  return (
    <div className="App">
      <header className="header">
        <h1>✨ Healthcare Appointment Booking System</h1>
        <p>Real-time availability of our medical professionals</p>
        <button
          className="btn btn-primary check-availability-btn"
          onClick={() => navigate('/availability')}
        >
          🔄 Refresh Availability
        </button>
      </header>

      <div className="container">
        {loading && <div className="loading">Loading doctor availability...</div>}

        <div className="section">
          <h2>👩‍⚕️ Available Doctors</h2>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            Browse our qualified medical professionals and their current availability
          </p>
          
          <div className="doctors-grid">
            {doctors.map(doctor => {
              const availability = getAvailabilityStatus(doctor);
              return (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-name">{doctor.name}</div>
                  <div className="doctor-specialty">🏥 {doctor.specialty}</div>
                  <div className={`doctor-slots slots-${availability.status === 'none' ? 'unavailable' : 'available'}`}>
                    {availability.emoji} {availability.text}
                    <br />
                    <strong>{doctor.available_slots} / {doctor.slots_per_day}</strong> slots available
                  </div>
                  <small>👤 Doctor ID: {doctor.id} | 📧 {doctor.email.split('@')[0]}@***</small>
                  
                  {doctor.available_slots > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => navigate('/book-appointment')}
                      >
                        📅 Book with {doctor.name.split(' ').pop()}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {doctors.length === 0 && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#718096',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '16px',
              border: '2px dashed #e2e8f0'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
              <h3>No Doctors Available</h3>
              <p>Add some doctors to get started with appointments.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/new-doctor')}
              >
                ➕ Add First Doctor
              </button>
            </div>
          )}
        </div>

        <div className="navigation-buttons">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            🏠 Back to Home
          </button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/book-appointment')}>
            📅 Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityPage;
