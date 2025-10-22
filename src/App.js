import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import NewDoctorPage from './NewDoctorPage';
import BookAppointmentPage from './BookAppointmentPage';
import AvailabilityPage from './AvailabilityPage';
import AppointmentsPage from './AppointmentsPage';
import ChatBot from './ChatBot';

function App() {
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-doctor" element={<NewDoctorPage />} />
        <Route path="/book-appointment" element={<BookAppointmentPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
      </Routes>
      
      {/* Chatbot Float Button */}
      {!isChatBotOpen && (
        <button 
          className="chatbot-float-btn pulse"
          onClick={() => setIsChatBotOpen(true)}
          title="Chat with MedBot - Your Healthcare Assistant"
        >
          🤖
        </button>
      )}
      
      {/* Chatbot Component */}
      <ChatBot 
        isOpen={isChatBotOpen} 
        onClose={() => setIsChatBotOpen(false)} 
      />
    </div>
  );
}

export default App;