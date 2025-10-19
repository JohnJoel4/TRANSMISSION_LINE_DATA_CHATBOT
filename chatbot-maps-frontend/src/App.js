import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import Chatbot from './Chatbot';
import './App.css'; // Assume basic CSS for layout

// Real API Call to FastAPI Backend
const apiCall = async (query) => {
  console.log(`Sending query to backend: ${query}`);
  
  try {
    const response = await fetch('http://localhost:8000/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // The API returns 'text_response' and 'geojson_data'
    return { 
      text: data.text_response, 
      geojson: data.geojson_data 
    };
  } catch (error) {
    console.error('API call failed:', error);
    throw new Error(`Failed to connect to backend: ${error.message}`);
  }
};

function App() {
  // State for the Map Data (filtered GeoJSON)
  const [mapData, setMapData] = useState(null); 
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  // State for showing welcome page
  const [showWelcome, setShowWelcome] = useState(true);
  // State for the Chat History
  const [chatHistory, setChatHistory] = useState([
    { source: 'system', text: `# 🌍 **Welcome to the US Transmission Grid Explorer!**

**Dataset:** 84,686 transmission lines across the United States

## 🎯 **What would you like to explore?**

### **⚡ Popular Starter Queries:**
• **"Show me all 500kV lines"** - Major interstate corridors
• **"Which utility owns the most lines?"** - Market leader analysis  
• **"Show me high voltage lines"** - Critical infrastructure (345kV+)

### **🏢 Utility & Owner Analysis:**
• **"List all owners"** - 578 utility companies nationwide
• **"Show me Georgia Power lines"** - Market leader with 2,775 lines
• **"Which utility owns the most lines?"** - Market dominance analysis

### **🔌 Infrastructure Types:**  
• **"Show me underground lines"** - Rare infrastructure 
• **"Data summary"** - Complete dataset overview

---

**💡 Just type any voltage (500kV, 345kV), utility name, or infrastructure type to start exploring!**` }
  ]);
  
  // Function to handle a new query from the Chatbot
  const handleNewQuery = async (query) => {
    // 1. Add user query to history
    const userMessage = { source: 'user', text: query };
    setChatHistory(prev => [...prev, userMessage]);

    // 2. Show loading state
    setIsLoading(true);

    // 3. Call the backend API
    try {
      const response = await apiCall(query);

      // 4. Update Chat History with System Response
      const systemMessage = { source: 'system', text: response.text };
      setChatHistory(prev => [...prev, systemMessage]);

      // 5. Update Map Data with Filtered GeoJSON
      setMapData(response.geojson);
      
    } catch (error) {
      console.error("API Call Failed:", error);
      setChatHistory(prev => [...prev, { source: 'system', text: 'Error: Could not connect to the data engine.' }]);
    } finally {
      // 6. Hide loading state
      setIsLoading(false);
    }
  };

  // Function to enter the main application
  const enterMainApp = () => {
    setShowWelcome(false);
  };

  // Portfolio functionality
  useEffect(() => {
    if (showWelcome) {
      // Enhanced Skills Ticker Animation
      const skillsTrack = document.getElementById('skillsTrack');
      const skills = [
        "Power Grid Analysis", "Voltage Monitoring", "Utility Intelligence", "Geographic Mapping", 
        "Infrastructure Data", "Energy Networks", "Transmission Lines", "Market Analytics",
        "Grid Visualization", "Power Systems", "Electrical Infrastructure", "Real-time Data"
      ];

      if (skillsTrack) {
        const skillsHtml = skills.map(skill =>
          `<div class="skills-ticker-item">${skill}</div>`
        ).join('');
        skillsTrack.innerHTML = skillsHtml + skillsHtml; // Duplicate for seamless scroll
      }

      // Ensure video plays
      const video = document.getElementById('heroVideo');
      if (video) {
        video.play().catch(e => console.log('Video autoplay failed:', e));
      }

      // Smooth scrolling for navigation
      const handleNavClick = (e) => {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.getElementById(href.substring(1));
          if (targetSection) {
            const headerHeight = 70;
            const tickerHeight = 40;
            const offsetPosition = targetSection.offsetTop - headerHeight - tickerHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      };

      // Add event listeners to nav links
      const navLinks = document.querySelectorAll('.main-nav a');
      navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
      });

      // Cleanup function
      return () => {
        navLinks.forEach(link => {
          link.removeEventListener('click', handleNavClick);
        });
      };
    }
  }, [showWelcome]);

  return (
    <div className="app-container">
      {/* Portfolio-style Navigation */}
      <div className="nav-group">
        <nav className="main-nav">
          <ul>
          </ul>
        </nav>
        <div className="nav-right">
          <div className="header-cta">
            <button 
              className="cta-button" 
              onClick={() => setShowWelcome(false)}
              disabled={!showWelcome}
            >
              Launch Explorer
            </button>
          </div>
          <button className="menu-toggle" aria-label="Open navigation" aria-expanded="false">☰</button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${showWelcome ? 'portfolio-mode' : 'explorer-mode'}`}>
        {showWelcome ? (
          <main>
            {/* Hero Section */}
            <section id="hero" className="hero">
              <div
                className="hero-bg-image"
                aria-hidden="true"
                style={{ 
                  backgroundImage: `url(/earth_3.jpg)`,
                  backgroundColor: '#1a1a1a'
                }}
              />
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <div className="hero-text-container">
                  <div className="badge">Welcome to the future of energy infrastructure</div>
                  <h1 className="name-title">US Transmission Grid Explorer</h1>
                  <div className="titles-container">
                    <div className="titles-prefix">Explore the</div>
                    <div className="titles-wrapper">
                      <div id="titles-carousel" className="titles-carousel">
                        <span>Power Grid</span>
                        <span>Energy Network</span>
                        <span>Infrastructure</span>
                        <span>Future of Power</span>
                      </div>
                    </div>
                  </div>
                  <p className="intro-text">
                    Discover America's electrical infrastructure through interactive maps and intelligent queries.
                    Analyze 84,686 transmission lines across all 50 states with AI-powered insights.
                  </p>
                  <div className="hero-cta">
                  </div>
                </div>
                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">84,686</div>
                    <div className="stat-label">Transmission Lines</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">578</div>
                    <div className="stat-label">Utility Companies</div>
                  </div>
                </div>
              </div>
              <div className="scroll-indicator">
                <div className="mouse">
                  <div className="wheel"></div>
                </div>
                <div className="scroll-text">Scroll Down</div>
              </div>
            </section>

            {/* Enhanced Skills Ticker */}
            <div className="skills-ticker-container">
              <div className="skills-ticker">
                <div className="skills-ticker-track" id="skillsTrack"></div>
              </div>
            </div>

            {/* Enhanced About Section */}
            <section className="about-section" id="about">
              <div className="about-container">
                <div className="about-header">
                  <h2 className="about-title">About the <span>Grid</span></h2>
                </div>
                <div className="about-content">
                  <div className="about-text">
                    <div className="decorated-corner top-right"></div>
                    <div className="decorated-corner bottom-left"></div>
                    <p>The <span className="highlight">US Transmission Grid Explorer</span> provides unprecedented access to America's electrical infrastructure data. With over 84,686 transmission lines spanning all 50 states, this platform enables comprehensive analysis of the nation's power grid.</p>
                    <p>Our dataset covers voltage levels from <span className="highlight">34.5kV to 765kV</span>, representing critical infrastructure from local distribution to major interstate corridors. Explore ownership patterns across 578 utility companies, analyze regional concentrations, and discover investment opportunities.</p>
                    <p>Whether you're a <span className="highlight">researcher, investor, or policy maker</span>, this tool provides the insights needed to understand America's energy landscape. Use natural language queries to filter data, visualize trends, and uncover patterns in the nation's power infrastructure.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features">
              <h2>Key Features</h2>
              <div className="features-container">
                <div className="features-column">
                  <div className="feature-item">
                    <h3>⚡ Voltage Analysis</h3>
                    <p>Filter by voltage levels from 34.5kV to 765kV. Discover high-voltage corridors and regional distribution networks.</p>
                  </div>
                  <div className="feature-item">
                    <h3>🏢 Utility Ownership</h3>
                    <p>Explore lines owned by specific utilities like Georgia Power. Analyze market concentration and ownership patterns.</p>
                  </div>
                </div>
                <div className="features-column">
                  <div className="feature-item">
                    <h3>🔌 Infrastructure Types</h3>
                    <p>Compare overhead vs underground lines, analyze construction methods and infrastructure density.</p>
                  </div>
                  <div className="feature-item">
                    <h3>📊 Market Intelligence</h3>
                    <p>Get insights into market leaders, regional concentrations, and infrastructure investment opportunities.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact">
              <div className="contact-inner">
                <h2>Ready to Explore?</h2>
                <p className="contact-subtitle">Start your journey into America's power infrastructure today!</p>
                <div className="contact-container">
                  <div className="contact-card">
                    <h3>Get Started</h3>
                    <p>Click the button below to enter the interactive explorer and begin analyzing the transmission grid data.</p>
                    <button className="submit-button" onClick={enterMainApp}>
                      <i className="fas fa-rocket"></i> Launch Explorer
                    </button>
                  </div>
                  <div className="contact-info">
                    <h3>Quick Stats</h3>
                    <div className="contact-methods">
                      <div className="contact-method">
                        <i className="fas fa-bolt"></i>
                        <span>84,686 Transmission Lines</span>
                      </div>
                      <div className="contact-method">
                        <i className="fas fa-building"></i>
                        <span>578 Utility Companies</span>
                      </div>
                      <div className="contact-method">
                        <i className="fas fa-map-marked-alt"></i>
                        <span>All 50 States Covered</span>
                      </div>
                      <div className="contact-method">
                        <i className="fas fa-chart-line"></i>
                        <span>34.5kV - 765kV Range</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="footer">
              <p>&copy;2025 John Joel Mota</p>
            </footer>
          </main>
        ) : (
          <>
            <div className="explorer-header">
              <button className="home-button" onClick={() => setShowWelcome(true)}>
                <i className="fas fa-home"></i> Home
              </button>
            </div>
            <div className="map-panel">
              {isLoading && (
                <div className="loading-overlay">
                  🔄 Loading transmission lines...
                </div>
              )}
              <MapComponent geojsonData={mapData} />
            </div>
            <div className="chat-panel">
              <Chatbot onNewQuery={handleNewQuery} history={chatHistory} isLoading={isLoading} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;