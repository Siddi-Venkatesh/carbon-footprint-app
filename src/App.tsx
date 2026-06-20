import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Calculator } from './pages/Calculator';
import { Dashboard } from './pages/Dashboard';
import { Recommendations } from './pages/Recommendations';
import { Challenges } from './pages/Challenges';
import { Education } from './pages/Education';
import { History } from './pages/History';
import { ChatAssistant } from './components/ChatAssistant';
import { FootprintData } from './utils/carbonCalculator';

function App() {
  const [history, setHistory] = useState<FootprintData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ecoAssist_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed);
      // Removed the auto-setting of activeId so results disappear on refresh
    }
  }, []);

  const handleDataComplete = (data: FootprintData) => {
    const newEntry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    setActiveId(newEntry.id);
    localStorage.setItem('ecoAssist_history', JSON.stringify(updatedHistory));
  };

  const activeData = history.find(item => item.id === activeId) || null;

  return (
    <Router>
      <div style={{ paddingBottom: '4rem' }}>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator onComplete={handleDataComplete} />} />
          <Route path="/dashboard" element={<Dashboard data={activeData} />} />
          <Route path="/recommendations" element={<Recommendations data={activeData} />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/education" element={<Education />} />
          <Route path="/history" element={<History history={history} onSelect={setActiveId} />} />
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatAssistant />
      </div>
    </Router>
  );
}

export default App;
