import React, { useState, useRef, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { askEcoAssistant } from '../utils/gemini';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am EcoAssist. Ask me anything about your carbon footprint or sustainability!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Format history for Gemini SDK
    const history = messages.slice(1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const responseText = await askEcoAssistant(userMessage, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      
      {isOpen && (
        <Card style={{ 
          width: '350px', 
          height: '500px', 
          marginBottom: '1rem', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '1rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>Eco Assistant 🌿</h3>
            <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)', fontSize: '1.5rem' }}>&times;</button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: msg.role === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-lg)',
                borderBottomRightRadius: msg.role === 'user' ? '0' : 'var(--radius-lg)',
                borderBottomLeftRadius: msg.role === 'model' ? '0' : 'var(--radius-lg)',
                maxWidth: '85%',
                fontSize: '0.95rem'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: 'var(--radius-lg)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !isLoading && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {['Reduce food emissions?', 'Why recycle?', 'What is carbon offset?'].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    setInput(suggestion);
                  }}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--accent-primary)',
                    color: 'var(--accent-primary)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask a question..."
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--bg-tertiary)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit'
              }}
            />
            <Button type="submit" disabled={isLoading} style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ↑
            </Button>
          </form>
        </Card>
      )}

      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="animate-robot-glow"
          style={{ 
            borderRadius: '50%', 
            width: '70px', 
            height: '70px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '3rem',
            background: 'transparent',
            boxShadow: 'none'
          }}
        >
          🤖
        </Button>
      )}
    </div>
  );
};
