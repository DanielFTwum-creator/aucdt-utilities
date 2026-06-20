import React, { useState } from 'react';
import QuizMode from './components/QuizMode';
import StoryMode from './components/StoryMode';

type Tab = 'quiz' | 'story';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quiz');

  return (
    <div className="app">
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
          background-color: #f0f9ff;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 20px;
        }

        .app {
          width: 95%;
          max-width: 600px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
          padding: 20px;
          margin: 0 auto 20px auto;
        }

        header {
          text-align: center;
          background: linear-gradient(135deg, #4e9af1, #7c4dff);
          color: white;
          padding: 20px;
          border-radius: 15px 15px 0 0;
          margin: -20px -20px 0 -20px;
        }

        header h1 {
          margin: 0;
          font-size: 2.2rem;
        }
        header p {
          margin: 5px 0 0 0;
          opacity: 0.9;
        }

        /* Tab Navigation */
        .tab-nav {
          display: flex;
          border-bottom: 2px solid #e0e0e0;
          margin: 0 -20px;
          padding: 0;
        }
        .tab-btn {
          flex: 1;
          padding: 14px;
          font-size: 1.2rem;
          font-family: inherit;
          border: none;
          background: #f5f5f5;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: bold;
          color: #777;
        }
        .tab-btn:first-child {
          border-right: 1px solid #e0e0e0;
        }
        .tab-btn.active {
          background: white;
          color: #4e9af1;
          border-bottom: 3px solid #4e9af1;
        }
        .tab-btn:hover:not(.active) {
          background: #eeeeee;
        }

        /* Quiz styles (kept from original) */
        .question-section { padding: 15px; }
        .question-count { font-size: 1.2rem; color: #4e9af1; margin-bottom: 15px; }
        .question-image { font-size: 4rem; text-align: center; margin: 20px 0; }
        .question-text {
          font-size: 1.8rem; text-align: center; color: #333;
          min-height: 80px; display: flex; align-items: center; justify-content: center;
        }
        .options-container { display: flex; flex-direction: column; gap: 15px; margin: 25px 0; }
        .option-btn {
          padding: 18px; font-size: 1.5rem; background: #f0f7ff;
          border: 2px solid #4e9af1; border-radius: 12px; cursor: pointer;
          transition: all 0.3s; font-family: inherit;
        }
        .option-btn:hover { background: #e1eeff; transform: scale(1.02); }
        .option-btn.selected { background: #4e9af1; color: white; font-weight: bold; }
        .fill-container { display: flex; flex-direction: column; gap: 15px; margin: 25px 0; }
        .fill-input {
          padding: 18px; font-size: 1.5rem; border: 2px solid #4e9af1;
          border-radius: 12px; text-align: center; font-family: inherit;
        }
        .submit-btn, .next-btn, .reset-btn {
          padding: 18px; font-size: 1.5rem; background: #ff9800; color: white;
          border: none; border-radius: 12px; cursor: pointer; font-weight: bold;
          transition: all 0.3s; font-family: inherit;
        }
        .submit-btn:hover, .next-btn:hover, .reset-btn:hover { background: #e68900; transform: scale(1.02); }
        .feedback {
          padding: 20px; margin: 20px 0; border-radius: 12px; font-size: 1.5rem;
          text-align: center; display: flex; flex-direction: column; gap: 15px;
        }
        .feedback.correct { background: #e8f5e9; color: #2e7d32; }
        .feedback.incorrect { background: #ffebee; color: #c62828; }
        .score-section { text-align: center; padding: 30px; }
        .score-section h2 { color: #4e9af1; font-size: 2.5rem; }
        .score-section p { font-size: 2rem; margin: 20px 0; }
        .celebration { font-size: 3rem; margin: 30px 0; }

        footer { text-align: center; margin-top: 20px; color: #666; font-size: 1.1rem; }

        @media (max-width: 768px) {
          .question-text { font-size: 1.6rem; min-height: 70px; }
          .option-btn, .fill-input, .submit-btn, .next-btn, .reset-btn { padding: 15px; font-size: 1.3rem; }
          header h1 { font-size: 2rem; }
          .score-section h2 { font-size: 2.2rem; }
          .score-section p { font-size: 1.8rem; }
          .feedback { font-size: 1.3rem; padding: 15px; }
        }
        @media (max-width: 480px) {
          .question-text { font-size: 1.4rem; min-height: 60px; }
          .question-image { font-size: 3rem; }
          .option-btn, .fill-input, .submit-btn, .next-btn, .reset-btn { padding: 12px; font-size: 1.1rem; }
          header h1 { font-size: 1.8rem; }
          .score-section h2 { font-size: 2rem; }
          .score-section p { font-size: 1.6rem; }
          .feedback { font-size: 1.1rem; padding: 12px; }
          .tab-btn { font-size: 1rem; padding: 12px; }
        }
      `}</style>

      <header>
        <h1>English Safari 🦁</h1>
        <p>Learn English with Ama & Kofi!</p>
      </header>

      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          📝 Grammar Quiz
        </button>
        <button
          className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
          onClick={() => setActiveTab('story')}
        >
          📖 Story Safari
        </button>
      </div>

      {activeTab === 'quiz' ? <QuizMode /> : <StoryMode />}

      <footer>
        <p>Made for Ghanaian learners 🇬🇭 | #ai-for-good</p>
      </footer>
    </div>
  );
}

export default App;
