import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, getChatHistory } from './api';

const ChatBot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Generate or retrieve session ID
    useEffect(() => {
        let storedSessionId = localStorage.getItem('chatbot_session_id');
        if (!storedSessionId) {
            storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('chatbot_session_id', storedSessionId);
        }
        setSessionId(storedSessionId);
        
        // Load conversation history
        loadConversationHistory(storedSessionId);
        
        // Add welcome message if no history
        if (messages.length === 0) {
            setMessages([{
                id: 'welcome',
                text: "👋 Hello! I'm MedBot, your healthcare assistant. I can help you with medical questions, suggest doctors from our system, and provide health information. How can I assist you today?",
                sender: 'bot',
                timestamp: new Date().toISOString(),
                isWelcome: true
            }]);
        }
    }, []);

    // Auto scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadConversationHistory = async (sessionId) => {
        try {
            const history = await getChatHistory(sessionId);
            if (history.exists && history.recent_messages) {
                const formattedMessages = history.recent_messages.map((msg, index) => ({
                    id: `history_${index}`,
                    text: msg.content,
                    sender: msg.role === 'user' ? 'user' : 'bot',
                    timestamp: msg.timestamp || new Date().toISOString()
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.log('No previous conversation found');
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: `user_${Date.now()}`,
            text: inputMessage.trim(),
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await sendChatMessage(userMessage.text, sessionId);
            
            setTimeout(() => {
                setIsTyping(false);
                const botMessage = {
                    id: `bot_${Date.now()}`,
                    text: response.response,
                    sender: 'bot',
                    timestamp: response.timestamp,
                    success: response.success
                };
                setMessages(prev => [...prev, botMessage]);
                setIsLoading(false);
            }, 800); // Simulate typing delay
            
        } catch (error) {
            setIsTyping(false);
            const errorMessage = {
                id: `error_${Date.now()}`,
                text: "I'm sorry, I'm experiencing technical difficulties. Please try again in a moment.",
                sender: 'bot',
                timestamp: new Date().toISOString(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([{
            id: 'welcome',
            text: "👋 Hello! I'm MedBot, your healthcare assistant. I can help you with medical questions, suggest doctors from our system, and provide health information. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date().toISOString(),
            isWelcome: true
        }]);
        localStorage.removeItem('chatbot_session_id');
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chatbot_session_id', newSessionId);
        setSessionId(newSessionId);
    };

    const formatMessage = (text) => {
        // Convert basic markdown formatting
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        
        return { __html: formatted };
    };

    if (!isOpen) return null;

    return (
        <div className="chatbot-overlay">
            <div className="chatbot-container">
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">🤖</div>
                        <div>
                            <h3>MedBot</h3>
                            <p>Healthcare Assistant</p>
                        </div>
                    </div>
                    <div className="chatbot-header-actions">
                        <button 
                            className="chatbot-clear-btn"
                            onClick={clearChat}
                            title="Clear conversation"
                        >
                            🗑️
                        </button>
                        <button 
                            className="chatbot-close-btn"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="chatbot-messages">
                    {messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`message ${message.sender} ${message.isWelcome ? 'welcome' : ''} ${message.isError ? 'error' : ''}`}
                        >
                            <div className="message-content">
                                <div 
                                    className="message-text"
                                    dangerouslySetInnerHTML={formatMessage(message.text)}
                                />
                                <div className="message-timestamp">
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="message bot typing">
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chatbot-input">
                    <div className="input-container">
                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me about your health concerns, symptoms, or our doctors..."
                            disabled={isLoading}
                            rows="1"
                        />
                        <button 
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="send-button"
                        >
                            {isLoading ? '⏳' : '➤'}
                        </button>
                    </div>
                    <div className="input-hint">
                        💡 Try asking: "I have a headache, which doctor should I see?" or "What are the symptoms of diabetes?"
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;