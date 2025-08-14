import { useState, useEffect } from 'react';
import ChatInput from '../components/chatinput';
import MessageBubble from '../components/messagebubble';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { getApiUrl } from '../config';

// ChatPage component for user interaction with the FAQ system
// It allows users to ask questions and get answers based on FAQs

function ChatPage({ user, onLogout }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hello ${user?.username}! I am your AI assistant. How can I help you today?` }
  ]);

  // Session management state
  const [currentSession, setCurrentSession] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    satisfied: true,
    rating: 5,
    comment: ''
  });

  const [topQuestions, setTopQuestions] = useState([]);

  useEffect(() => {
    // Fetch top questions for suggestions
    axios.get(`${getApiUrl()}/top-questions`, {
      withCredentials: true
    })
    .then(response => {
      setTopQuestions(response.data);
    })
    .catch(error => {
      console.error('Error fetching top questions:', error);
    });
  }, []);

  // Start new session
  const startNewSession = async () => {
    try {
      const response = await axios.post(`${getApiUrl()}/session/start`, {}, {
        withCredentials: true
      });
      if (response.data.success) {
        setCurrentSession(response.data.session_id);
        setIsSessionActive(true);
        setMessages([
          { role: 'bot', text: `Session started! You can now ask continuous questions, and I will remember our conversation. When you finish all your questions, please click "End Chat" for overall evaluation.` }
        ]);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start session, please try again');
    }
  };

  // End session
  const endSession = () => {
    if (currentSession) {
      setShowFeedbackModal(true);
    }
  };

  // Submit feedback and end session
  const submitFeedbackAndEndSession = async () => {
    try {
      const response = await axios.post(`${getApiUrl()}/session/end`, {
        session_id: currentSession,
        satisfied: feedbackData.satisfied,
        rating: feedbackData.rating,
        comment: feedbackData.comment
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setCurrentSession(null);
        setIsSessionActive(false);
        setShowFeedbackModal(false);
        setMessages(prev => [
          ...prev,
          { role: 'bot', text: 'Thank you for your feedback! Session ended. You can start a new conversation.' }
        ]);
        // Reset feedback data
        setFeedbackData({ satisfied: true, rating: 5, comment: '' });
      }
    } catch (error) {
      console.error('Failed to end session:', error);
      alert('Failed to end session, please try again');
    }
  };

  // Old single feedback function (only used in non-session mode)
  const sendFeedback = async (satisfied) => {
    if (!isSessionActive) {
      await axios.post(`${getApiUrl()}/feedback`, {
        satisfied: satisfied
      }, {
        withCredentials: true
      });
    }
  };



  const handleSend = async (input) => {
    setMessages([
      ...messages,
      { role: 'user', text: input }
    ]);
    
    try {
      // Build request data, include session_id if there's an active session
      const requestData = {
        question: input
      };
      
      if (isSessionActive && currentSession) {
        requestData.session_id = currentSession;
      }
      
      // Call the AI chat API
      const response = await axios.post(`${getApiUrl()}/chat`, requestData, {
        withCredentials: true
      });
      
      const result = response.data;
      let botMessage = result.answer;
      
      // Check if human assistance is required
      if (result.requires_human) {
        setMessages(msgs => [
          ...msgs,
          {
            role: 'bot',
            text: botMessage,
            confidence: result.confidence,
            source: result.source,
            similarity: result.similarity,
            requiresHuman: true,
            emotionAnalysis: result.emotion_analysis,
            sessionId: result.session_id
          }
        ]);
      } else {
        setMessages(msgs => [
          ...msgs,
          {
            role: 'bot',
            text: botMessage,
            confidence: result.confidence,
            source: result.source,
            similarity: result.similarity,
            requiresHuman: false,
            emotionAnalysis: result.emotion_analysis,
            sessionId: result.session_id
          }
        ]);
      }
      
    } catch (err) {
      console.error('Chat API error:', err);
      setMessages(msgs => [
        ...msgs,
        { 
          role: 'bot', 
          text: 'Sorry, the AI service is temporarily unavailable. Please try again later or contact support.',
          source: 'error'
        }
      ]);
    }
  };

  return (
    <>
      <header className="chat-header">
          <div className="logo-title">AI FAQ Assistant</div>
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.username}!</span>
            {user?.role === 'admin' && (
              <Link to="/admin" className="admin-link">Admin Dashboard</Link>
            )}
            <button onClick={onLogout} className="logout-btn">Log out</button>
          </div>
      </header>

      <main className="chat-container">
        <section className="chat-sidebar">
          {/* Session Control Area */}
          <div className="session-controls">
            <h3>Conversation Session</h3>
            {!isSessionActive ? (
              <button 
                className="session-btn start-session" 
                onClick={startNewSession}
              >
                Start Continuous Chat
              </button>
            ) : (
              <div className="active-session">
                <div className="session-status">
                  <span className="status-indicator active">●</span>
                  <span>Session Active</span>
                </div>
                <button 
                  className="session-btn end-session" 
                  onClick={endSession}
                >
                  ✅ End Chat & Rate
                </button>
              </div>
            )}
          </div>
          
          <hr className="sidebar-divider" />
          
          <p><strong>Welcome! Try one of these popular questions:</strong></p>
          <div className="quick-questions">
            {topQuestions.slice(0, 5).map((item, index) => (
              <button key={index} onClick={() => handleSend(item.question)}>
                {item.question}
              </button>
            ))}
          </div>
        </section>

        <section className="chat-main">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role}`}>
              <MessageBubble 
                role={msg.role} 
                text={msg.text} 
                requiresHuman={msg.requiresHuman}
                emotionAnalysis={msg.emotionAnalysis}
              />
              {/* Show instant feedback buttons only in non-session mode */}
              {msg.role === 'bot' && !isSessionActive && (
                <div className="feedback-buttons">
                  <button onClick={() => sendFeedback(true)}>👍</button>
                  <button onClick={() => sendFeedback(false)}>👎</button>
                </div>
              )}
            </div>
          ))}
          <ChatInput onSend={handleSend} disabled={showFeedbackModal} />
        </section>
      </main>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <h3>Conversation Rating</h3>
            <p>Please rate this complete conversation:</p>
            
            <div className="feedback-section">
              <label>Overall Satisfaction:</label>
              <div className="satisfaction-buttons">
                <button 
                  className={feedbackData.satisfied ? 'active' : ''}
                  onClick={() => setFeedbackData({...feedbackData, satisfied: true})}
                >
                  😊 Satisfied
                </button>
                <button 
                  className={!feedbackData.satisfied ? 'active' : ''}
                  onClick={() => setFeedbackData({...feedbackData, satisfied: false})}
                >
                  😞 Unsatisfied
                </button>
              </div>
            </div>

            <div className="feedback-section">
              <label>Rating (1-5 stars):</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className={`star ${feedbackData.rating >= star ? 'active' : ''}`}
                    onClick={() => setFeedbackData({...feedbackData, rating: star})}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="feedback-section">
              <label>Comments (Optional):</label>
              <textarea
                value={feedbackData.comment}
                onChange={(e) => setFeedbackData({...feedbackData, comment: e.target.value})}
                placeholder="Please share your thoughts about this conversation..."
                rows={3}
              />
            </div>

            <div className="modal-buttons">
              <button 
                className="btn-secondary" 
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={submitFeedbackAndEndSession}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatPage;
