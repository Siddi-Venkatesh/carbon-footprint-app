import { useState, useEffect } from 'react';
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
    let updatedHistory;
    
    // If the data already has an ID, we are editing an existing item
    if (data.id) {
      updatedHistory = history.map(item => item.id === data.id ? { ...data, date: new Date().toISOString() } : item);
    } else {
      const newEntry = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString()
      };
      updatedHistory = [...history, newEntry];
    }
    
    setHistory(updatedHistory);
    setActiveId(data.id || updatedHistory[updatedHistory.length - 1].id!);
    localStorage.setItem('ecoAssist_history', JSON.stringify(updatedHistory));
  };

  const handleDeleteHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    if (activeId === id) setActiveId(null);
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
          <Route path="/history" element={<History history={history} onSelect={setActiveId} onDelete={handleDeleteHistory} />} />
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatAssistant />
      </div>
    </Router>
  );
}

export default App;
