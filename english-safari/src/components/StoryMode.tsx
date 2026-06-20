import React, { useState } from 'react';
import { generateStory, type GeneratedStory } from '../services/geminiService';

const TOPIC_SUGGESTIONS = [
  "Ama goes to the market",
  "Kofi's birthday party",
  "A day at the beach in Cape Coast",
  "Helping grandmother cook jollof rice",
  "The school football match",
  "A trip to Kumasi",
];

export default function StoryMode() {
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [storiesRead, setStoriesRead] = useState(0);
  const [storiesCorrect, setStoriesCorrect] = useState(0);
  const [customTopic, setCustomTopic] = useState("");

  const handleGenerate = async (topic?: string) => {
    setLoading(true);
    setError("");
    setStory(null);
    setSelectedAnswer(null);
    setShowExplanation(false);

    try {
      const result = await generateStory(topic);
      setStory(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(index);
    setShowExplanation(true);
    setStoriesRead(prev => prev + 1);
    if (story && index === story.question.correctIndex) {
      setStoriesCorrect(prev => prev + 1);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      handleGenerate(customTopic.trim());
      setCustomTopic("");
    }
  };

  return (
    <>
      <style>{`
        .story-mode {
          padding: 15px;
        }
        .story-stats {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
          font-size: 1.1rem;
        }
        .story-stats span {
          background: #fff3e0;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: bold;
          color: #e65100;
        }
        .topic-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 15px 0;
        }
        .topic-btn {
          padding: 14px 12px;
          font-size: 1.1rem;
          background: #e8f5e9;
          border: 2px solid #66bb6a;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }
        .topic-btn:hover {
          background: #c8e6c9;
          transform: scale(1.03);
        }
        .surprise-btn {
          width: 100%;
          padding: 16px;
          font-size: 1.4rem;
          background: linear-gradient(135deg, #ff9800, #ff5722);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          font-family: inherit;
          transition: all 0.3s;
          margin-top: 10px;
        }
        .surprise-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4);
        }
        .custom-topic-form {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
        .custom-topic-input {
          flex: 1;
          padding: 14px;
          font-size: 1.1rem;
          border: 2px solid #4e9af1;
          border-radius: 12px;
          font-family: inherit;
        }
        .custom-topic-submit {
          padding: 14px 20px;
          font-size: 1.1rem;
          background: #4e9af1;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          font-family: inherit;
        }

        /* Loading */
        .loading-container {
          text-align: center;
          padding: 40px 20px;
        }
        .loading-emoji {
          font-size: 4rem;
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .loading-text {
          font-size: 1.3rem;
          color: #666;
          margin-top: 15px;
        }

        /* Error */
        .error-box {
          background: #ffebee;
          border: 2px solid #ef5350;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          color: #c62828;
          font-size: 1.2rem;
          margin: 20px 0;
        }

        /* Story Display */
        .story-card {
          background: #fffde7;
          border: 2px solid #ffd54f;
          border-radius: 16px;
          padding: 20px;
          margin: 15px 0;
        }
        .story-title {
          font-size: 1.6rem;
          color: #f57f17;
          text-align: center;
          margin: 0 0 5px 0;
        }
        .grammar-badge {
          text-align: center;
          margin-bottom: 15px;
        }
        .grammar-badge span {
          background: #e1f5fe;
          color: #0277bd;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
        }
        .story-text {
          font-size: 1.3rem;
          line-height: 1.8;
          color: #333;
          white-space: pre-line;
        }

        /* Question */
        .question-card {
          background: #e8eaf6;
          border: 2px solid #7986cb;
          border-radius: 16px;
          padding: 20px;
          margin: 15px 0;
        }
        .question-card h3 {
          color: #283593;
          font-size: 1.3rem;
          margin: 0 0 15px 0;
        }
        .story-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .story-option-btn {
          padding: 14px 16px;
          font-size: 1.2rem;
          background: white;
          border: 2px solid #7986cb;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          font-family: inherit;
        }
        .story-option-btn:hover:not(.answered) {
          background: #c5cae9;
          transform: translateX(4px);
        }
        .story-option-btn.correct {
          background: #c8e6c9;
          border-color: #43a047;
          color: #2e7d32;
          font-weight: bold;
        }
        .story-option-btn.incorrect {
          background: #ffcdd2;
          border-color: #e53935;
          color: #c62828;
        }
        .story-option-btn.answered {
          cursor: default;
        }

        /* Explanation */
        .explanation-box {
          margin-top: 15px;
          padding: 15px;
          border-radius: 10px;
          font-size: 1.1rem;
        }
        .explanation-box.correct-bg {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .explanation-box.incorrect-bg {
          background: #ffebee;
          color: #c62828;
        }

        .new-story-btn {
          width: 100%;
          padding: 16px;
          font-size: 1.3rem;
          background: linear-gradient(135deg, #66bb6a, #43a047);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          font-family: inherit;
          margin-top: 15px;
          transition: all 0.3s;
        }
        .new-story-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
        }

        @media (max-width: 480px) {
          .topic-grid { grid-template-columns: 1fr; }
          .story-text { font-size: 1.1rem; }
          .custom-topic-form { flex-direction: column; }
        }
      `}</style>

      <div className="story-mode">
        {storiesRead > 0 && (
          <div className="story-stats">
            <span>📚 {storiesRead} stories</span>
            <span>✅ {storiesCorrect} correct</span>
          </div>
        )}

        {!loading && !story && !error && (
          <>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>
              Choose a topic or let us surprise you! 🎲
            </p>

            <div className="topic-grid">
              {TOPIC_SUGGESTIONS.map((t, i) => (
                <button key={i} className="topic-btn" onClick={() => handleGenerate(t)}>
                  {t}
                </button>
              ))}
            </div>

            <button className="surprise-btn" onClick={() => handleGenerate()}>
              🎲 Surprise Me!
            </button>

            <form onSubmit={handleCustomSubmit} className="custom-topic-form">
              <input
                type="text"
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                placeholder="Or type your own topic..."
                className="custom-topic-input"
              />
              <button type="submit" className="custom-topic-submit">Go!</button>
            </form>
          </>
        )}

        {loading && (
          <div className="loading-container">
            <div className="loading-emoji">🦁</div>
            <p className="loading-text">Creating your adventure...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <p>😕 {error}</p>
            <button className="surprise-btn" onClick={() => handleGenerate()} style={{ marginTop: '10px' }}>
              Try Again
            </button>
          </div>
        )}

        {story && (
          <>
            <div className="story-card">
              <h2 className="story-title">📖 {story.title}</h2>
              <div className="grammar-badge">
                <span>🎯 Grammar Focus: {story.grammarFocus}</span>
              </div>
              <p className="story-text">{story.story}</p>
            </div>

            <div className="question-card">
              <h3>🤔 {story.question.text}</h3>
              <div className="story-options">
                {story.question.options.map((opt, i) => {
                  let className = "story-option-btn";
                  if (selectedAnswer !== null) {
                    className += " answered";
                    if (i === story.question.correctIndex) className += " correct";
                    else if (i === selectedAnswer) className += " incorrect";
                  }
                  return (
                    <button key={i} className={className} onClick={() => handleAnswer(i)}>
                      {String.fromCharCode(65 + i)}. {opt}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className={`explanation-box ${selectedAnswer === story.question.correctIndex ? 'correct-bg' : 'incorrect-bg'}`}>
                  {selectedAnswer === story.question.correctIndex
                    ? "🎉 Correct! "
                    : "💡 Not quite. "}
                  {story.question.explanation}
                </div>
              )}
            </div>

            <button className="new-story-btn" onClick={() => { setStory(null); setSelectedAnswer(null); setShowExplanation(false); }}>
              📖 New Story Adventure!
            </button>
          </>
        )}
      </div>
    </>
  );
}
