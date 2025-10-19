import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ onNewQuery, history, isLoading }) => {
  const [input, setInput] = useState('');
  const [showQuickQueries, setShowQuickQueries] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat on history update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);
  
  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    onNewQuery(input.trim());
    setInput('');
  };

  // Helper to apply quick queries
  const handleQuickQuery = (query) => {
    onNewQuery(query);
  };
  
  const quickQueries = [
    { text: "Show me all 500kV lines", label: "⚡ 500kV Lines", description: "796 major corridors" },
    { text: "Which utility owns the most lines?", label: "🏢 Top Utility", description: "Market leader" },
    { text: "Show me all 765kV lines", label: "⚡ 765kV Lines", description: "47 ultra-high voltage" },
    { text: "Show me Georgia Power lines", label: "🏢 Georgia Power", description: "2,775 lines" },
    { text: "Show underground transmission lines", label: "🔌 Underground", description: "Rare infrastructure" },
    { text: "Data summary", label: "📊 Dataset Info", description: "Complete overview" }
  ];

  return (
    <div className="chatbot-container" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '10px' }}>
      
      {/* Mobile Hamburger Menu for Quick Queries */}
      <div className="quick-queries-mobile">
        <button 
          className="hamburger-menu"
          onClick={() => setShowQuickQueries(!showQuickQueries)}
        >
          🚀 Quick Queries {showQuickQueries ? '▼' : '▶'}
        </button>
        <div className={`quick-queries-dropdown ${showQuickQueries ? 'open' : ''}`}>
          {quickQueries.map((query, index) => (
            <button 
              key={index}
              className="dropdown-query-btn"
              onClick={() => {
                handleQuickQuery(query.text);
                setShowQuickQueries(false);
              }}
            >
              {query.label}: {query.description}
            </button>
          ))}
        </div>
      </div>
      
      {/* 1. Desktop Quick Queries */}
      <div className="quick-queries-section" style={{ marginBottom: '12px', borderBottom: '2px solid #333', paddingBottom: '12px', background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)', borderRadius: '8px 8px 0 0', padding: '12px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '0.95em', fontWeight: 'bold', color: '#61dafb', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '6px' }}>🚀</span>
          Popular Queries - Click to Try:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {quickQueries.map((query, index) => (
            <button 
              key={index} 
              onClick={() => handleQuickQuery(query.text)}
              title={query.description}
              style={{ 
                padding: '6px 10px', 
                fontSize: '0.72em', 
                border: '1px solid #61dafb', 
                background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)', 
                color: '#61dafb',
                cursor: 'pointer',
                borderRadius: '4px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '80px',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #61dafb 0%, #21a3c4 100%)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)';
                e.target.style.color = '#61dafb';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '0.9em', fontWeight: '600' }}>{query.label}</div>
              <div style={{ fontSize: '0.7em', opacity: '0.8', marginTop: '1px' }}>{query.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* 2. Chat History */}
      <div className="chat-history" style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {history.map((msg, index) => (
          <div 
            key={index} 
            style={{ 
              marginBottom: '10px', 
              textAlign: msg.source === 'user' ? 'right' : 'left' 
            }}
          >
            <div 
              style={{ 
                display: 'inline-block',
                padding: '8px 12px', 
                borderRadius: '15px',
                maxWidth: '80%',
                backgroundColor: msg.source === 'user' ? '#61dafb' : '#2c2c2c',
                color: msg.source === 'user' ? 'white' : '#ffffff',
                fontSize: '0.9em',
                textAlign: 'left'
              }}
            >
              {msg.source === 'user' ? (
                msg.text
              ) : (
                <ReactMarkdown 
                  components={{
                    // Custom styling for markdown elements
                    h1: ({children}) => <h1 style={{fontSize: '1.1em', margin: '8px 0 4px 0'}}>{children}</h1>,
                    h2: ({children}) => <h2 style={{fontSize: '1.05em', margin: '6px 0 3px 0'}}>{children}</h2>,
                    h3: ({children}) => <h3 style={{fontSize: '1em', margin: '4px 0 2px 0'}}>{children}</h3>,
                    p: ({children}) => <p style={{margin: '4px 0', lineHeight: '1.4'}}>{children}</p>,
                    ul: ({children}) => <ul style={{margin: '4px 0', paddingLeft: '16px'}}>{children}</ul>,
                    li: ({children}) => <li style={{margin: '2px 0'}}>{children}</li>,
                    strong: ({children}) => <strong style={{fontWeight: '600'}}>{children}</strong>,
                    em: ({children}) => <em style={{fontStyle: 'italic'}}>{children}</em>
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Processing..." : "Ask a question about the grid..."}
          disabled={isLoading}
          style={{ 
            flexGrow: 1, 
            padding: '10px', 
            border: '1px solid #333', 
            borderRadius: '5px 0 0 5px',
            backgroundColor: isLoading ? '#1a1a1a' : '#2c2c2c',
            color: isLoading ? '#666' : '#ffffff'
          }}
        />
        <button 
          type="submit"
          disabled={isLoading}
          style={{ 
            padding: '10px 15px', 
            border: 'none', 
            backgroundColor: isLoading ? '#333' : '#61dafb', 
            color: 'white', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            borderRadius: '0 5px 5px 0' 
          }}
        >
          {isLoading ? '⏳' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;