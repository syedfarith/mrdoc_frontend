import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from './api';
import './index.css';

function BookAppointmentPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [appointmentForm, setAppointmentForm] = useState({
    doctor_id: '',
    patient_name: '',
    appointment_date: '',
    time_slot: ''
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      showMessage('❌ Error loading doctors: ' + (error.response?.data?.detail || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await doctorAPI.bookAppointment(appointmentForm.doctor_id, {
        patient_name: appointmentForm.patient_name,
        appointment_date: appointmentForm.appointment_date,
        time_slot: appointmentForm.time_slot
      });

      showMessage('🎉 Appointment booked successfully! The doctor has been notified via email. You will receive a confirmation soon.', 'success');
      setAppointmentForm({ doctor_id: '', patient_name: '', appointment_date: '', time_slot: '' });
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (error) {
      showMessage('❌ Error booking appointment: ' + (error.response?.data?.detail || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of ['00', '30']) {
        if (hour === 17 && minute === '30') break;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
        let displayTime = hour > 12 ? `${hour - 12}:${minute} PM` : `${hour}:${minute} AM`;
        if (hour === 12) displayTime = `12:${minute} PM`;
        slots.push({ value: timeString, display: displayTime });
      }
    }
    return slots;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getSelectedDoctor = () => {
    return doctors.find(d => d.id.toString() === appointmentForm.doctor_id);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>✨ Healthcare Appointment Booking System</h1>
        <p>Schedule your appointment with our qualified medical professionals</p>
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

        {loading && <div className="loading">Processing your appointment request...</div>}

        <div className="section">
          <h2>📅 Book New Appointment</h2>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            Fill in the details below to schedule your medical appointment
          </p>
          
          <form onSubmit={handleBookAppointment}>
            <div className="form-group">
              <label>👨‍⚕️ Select Doctor:</label>
              <select
                value={appointmentForm.doctor_id}
                onChange={(e) => setAppointmentForm({...appointmentForm, doctor_id: e.target.value})}
                required
              >
                <option value="">Choose your preferred doctor</option>
                {doctors.filter(doc => doc.available_slots > 0).map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialty} ({doctor.available_slots} slots available)
                  </option>
                ))}
              </select>
              {getSelectedDoctor() && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  padding: '0.75rem', 
                  background: 'rgba(102, 126, 234, 0.1)', 
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#4a5568'
                }}>
                  🏥 <strong>{getSelectedDoctor().specialty}</strong> specialist with {getSelectedDoctor().available_slots} available slots
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>👤 Patient Name:</label>
              <input
                type="text"
                value={appointmentForm.patient_name}
                onChange={(e) => setAppointmentForm({...appointmentForm, patient_name: e.target.value})}
                required
                placeholder="Enter your full name (e.g., Alice Johnson)"
              />
            </div>
            
            <div className="form-group">
              <label>📅 Appointment Date:</label>
              <input
                type="date"
                value={appointmentForm.appointment_date}
                onChange={(e) => setAppointmentForm({...appointmentForm, appointment_date: e.target.value})}
                min={getTomorrowDate()}
                required
              />
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#718096' }}>
                📌 Appointments can be scheduled from tomorrow onwards
              </small>
            </div>
            
            <div className="form-group">
              <label>🕐 Time Slot:</label>
              <select
                value={appointmentForm.time_slot}
                onChange={(e) => setAppointmentForm({...appointmentForm, time_slot: e.target.value})}
                required
              >
                <option value="">Choose your preferred time</option>
                {generateTimeSlots().map(slot => (
                  <option key={slot.value} value={slot.value}>{slot.display}</option>
                ))}
              </select>
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#718096' }}>
                ⏰ Available hours: 9:00 AM - 5:00 PM
              </small>
            </div>
            
            <div className="navigation-buttons">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || doctors.filter(d => d.available_slots > 0).length === 0}
              >
                {loading ? '⏳ Booking Appointment...' : '✅ Confirm Booking'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                🏠 Back to Home
              </button>
            </div>
          </form>
          
          {doctors.filter(d => d.available_slots > 0).length === 0 && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#718096',
              background: 'rgba(229, 62, 62, 0.1)',
              borderRadius: '12px',
              marginTop: '1rem',
              border: '1px solid rgba(229, 62, 62, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>😔</div>
              <h3>No Available Slots</h3>
              <p>All doctors are currently fully booked. Please check back later or contact us for assistance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointmentPage;
