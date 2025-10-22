import axios from 'axios';

const API_BASE_URL = 'https://mrdoc-backend.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const doctorAPI = {
  // Get all doctors
  getDoctors: () => api.get('/doctors/'),
  
  // Get doctor by ID
  getDoctor: (id) => api.get(`/doctors/${id}`),
  
  // Add new doctor
  addDoctor: (doctorData) => api.post('/doctors/', doctorData),
  
  // Book appointment
  bookAppointment: (doctorId, appointmentData) => 
    api.post(`/doctors/${doctorId}/appointments/`, appointmentData),
};

export const appointmentAPI = {
  // Get all appointments
  getAppointments: () => api.get('/appointments/'),
  
  // Cancel appointment
  cancelAppointment: (appointmentId) => api.delete(`/appointments/${appointmentId}`),
};

// Chatbot API functions
export const sendChatMessage = async (message, sessionId = null) => {
  try {
    const response = await api.post('/chatbot/message', {
      message: message,
      session_id: sessionId
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export const getChatHistory = async (sessionId) => {
  try {
    const response = await api.get(`/chatbot/conversation/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

export const suggestDoctors = async (condition) => {
  try {
    const response = await api.post('/chatbot/suggest-doctors', null, {
      params: { condition }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting doctor suggestions:', error);
    throw error;
  }
};

export const clearChatHistory = async (sessionId) => {
  try {
    const response = await api.delete(`/chatbot/conversation/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};

export default api;