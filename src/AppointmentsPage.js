import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from './api';
import './index.css';

function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [filter, setFilter] = useState('all'); // all, active, cancelled

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      showMessage('❌ Error loading appointments: ' + (error.response?.data?.detail || error.message), 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      await appointmentAPI.cancelAppointment(appointmentId);

      showMessage('✅ Appointment cancelled successfully! The doctor has been notified via email about this cancellation.', 'success');
      loadAppointments();
    } catch (error) {
      showMessage('❌ Error cancelling appointment: ' + (error.response?.data?.detail || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'active') return !appointment.is_cancelled;
    if (filter === 'cancelled') return appointment.is_cancelled;
    return true; // all
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAppointmentStats = () => {
    const total = appointments.length;
    const active = appointments.filter(a => !a.is_cancelled).length;
    const cancelled = appointments.filter(a => a.is_cancelled).length;
    return { total, active, cancelled };
  };

  const stats = getAppointmentStats();

  return (
    <div className="App">
      <header className="header">
        <h1>✨ Healthcare Appointment Booking System</h1>
        <p>Manage and track all medical appointments</p>
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

        {loading && <div className="loading">Processing appointment changes...</div>}

        {/* Appointment Statistics */}
        <div className="section">
          <h2>📊 Appointment Overview</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</div>
              <div>📅 Total Appointments</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.active}</div>
              <div>✅ Active Appointments</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.cancelled}</div>
              <div>❌ Cancelled Appointments</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-small ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              📋 All ({stats.total})
            </button>
            <button 
              className={`btn btn-small ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('active')}
            >
              ✅ Active ({stats.active})
            </button>
            <button 
              className={`btn btn-small ${filter === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('cancelled')}
            >
              ❌ Cancelled ({stats.cancelled})
            </button>
          </div>
        </div>

        <div className="section">
          <h2>📋 Appointment Details</h2>
          <div className="appointments-list">
            {filteredAppointments.map(appointment => (
              <div
                key={appointment.id}
                className={`appointment-item ${appointment.is_cancelled ? 'appointment-cancelled' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '1.1rem' }}>
                        {appointment.is_cancelled ? '❌' : '✅'} #{appointment.id}
                      </strong>
                      <span style={{ 
                        background: appointment.is_cancelled ? 'rgba(229, 62, 62, 0.1)' : 'rgba(72, 187, 120, 0.1)',
                        color: appointment.is_cancelled ? '#e53e3e' : '#38a169',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {appointment.is_cancelled ? 'CANCELLED' : 'ACTIVE'}
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>👤 Patient:</strong> {appointment.patient_name}
                    </div>
                    
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>👨‍⚕️ Doctor:</strong> Dr. {appointment.doctor_name}
                    </div>
                    
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>🏥 Specialty:</strong> {appointment.doctor_specialty}
                    </div>
                    
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>📅 Date:</strong> {formatDate(appointment.appointment_date)}
                    </div>
                    
                    <div>
                      <strong>🕐 Time:</strong> {formatTime(appointment.time_slot)}
                    </div>
                  </div>
                  
                  {!appointment.is_cancelled && (
                    <div>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel the appointment for ${appointment.patient_name}?`)) {
                            cancelAppointment(appointment.id);
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? '⏳ Cancelling...' : '🗑️ Cancel'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredAppointments.length === 0 && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#718096',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '16px',
              border: '2px dashed #e2e8f0'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {filter === 'active' ? '📅' : filter === 'cancelled' ? '❌' : '📋'}
              </div>
              <h3>
                {filter === 'active' ? 'No Active Appointments' : 
                 filter === 'cancelled' ? 'No Cancelled Appointments' : 
                 'No Appointments Found'}
              </h3>
              <p>
                {filter === 'active' ? 'There are no active appointments at the moment.' :
                 filter === 'cancelled' ? 'No appointments have been cancelled yet.' :
                 'Start by booking your first appointment.'}
              </p>
              {filter === 'all' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/book-appointment')}
                >
                  📅 Book First Appointment
                </button>
              )}
            </div>
          )}
        </div>

        <div className="navigation-buttons">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            🏠 Back to Home
          </button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/book-appointment')}>
            📅 Book New Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentsPage;
