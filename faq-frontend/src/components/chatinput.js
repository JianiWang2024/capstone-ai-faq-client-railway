import { useState, useRef, useEffect } from 'react';

// Enhanced Chat Input Component with Enter key support and better UX
// This component handles user input and sends messages to the chat.
function ChatInput({ onSend, disabled = false, placeholder = "Ask a question..." }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSend();
    }
  };

  // Handle send action
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || disabled) {
      return;
    }

    setIsLoading(true);
    try {
      await onSend(trimmedInput);
      setInput('');
      // Refocus input after sending and clear loading state
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Keep the input if sending failed
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Check if input is valid for sending
  const canSend = input.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="chat-input-container">
      <div className="chat-input-bar">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={`chat-input-field ${disabled ? 'disabled' : ''}`}
          aria-label="Type your question here"
        />
        <button 
          onClick={handleSend}
          disabled={!canSend}
          className={`send-button ${canSend ? 'active' : 'disabled'}`}
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="loading-spinner">⏳</span>
          ) : (
            <span className="send-icon">📤</span>
          )}
          <span className="send-text">Send</span>
        </button>
      </div>
      
      {/* Keyboard shortcut hint */}
      <div className="input-hint">
        <span className="hint-text">Press Enter to send • Shift+Enter for new line</span>
      </div>
    </div>
  );
}

export default ChatInput;
