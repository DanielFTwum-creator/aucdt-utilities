// src/App.js
import React, { useState } from 'react';
// The App.css import is removed as the CSS is now embedded directly in this file.

function App() {
  // Quiz questions data
  const questions = [
    {
      id: 1,
      text: "Look! Ama ___ a bright yellow school bag.",
      image: "👧🏾🎒",
      options: ["he has", "she has", "I has"],
      answer: "she has"
    },
    {
      id: 2,
      text: "Kofi ___ a fast bicycle.",
      image: "🚲👦🏾",
      options: ["she has", "he has", "have"],
      answer: "he has"
    },
    {
      id: 3,
      text: "She ___ two red pencils.",
      image: "✏️✏️👧🏾",
      type: "fill",
      answer: "has"
    },
    {
      id: 4,
      text: "Tomorrow, Ama ___ a new storybook.",
      image: "📖👧🏾",
      options: ["she will have", "she has", "will she have"],
      answer: "she will have"
    },
    {
      id: 5,
      text: "Next week, Kofi ___ a birthday party!",
      image: "🎉👦🏾",
      options: ["he has", "he will have", "have"],
      answer: "he will have"
    },
    {
      id: 6,
      text: "She ___ a mango for lunch later.",
      image: "🥭👧🏾",
      type: "fill",
      answer: "'ll have"
    },
    {
      id: 7,
      text: "Today, Kofi ___ his football.",
      image: "⚽👦🏾",
      options: ["has", "will have"],
      answer: "has"
    },
    {
      id: 8,
      text: "After class, the children ___ free time!",
      image: "😊👫",
      options: ["they have", "they'll have"],
      answer: "they'll have"
    },
    {
      id: 9,
      text: "My mother ___ a beautiful kente cloth.",
      image: "👩🏾‍🦱👗",
      options: ["she has", "he has", "they have"],
      answer: "she has"
    },
    {
      id: 10,
      text: "We ___ a big family dinner on Sunday.",
      image: "👨‍👩‍👧‍👦🍽️",
      options: ["we have", "we will have", "we has"],
      answer: "we will have"
    },
    {
      id: 11,
      text: "The dog ___ a fluffy tail.",
      image: "🐶🐾",
      type: "fill",
      answer: "has"
    },
    {
      id: 12,
      text: "In the evening, I ___ my homework.",
      image: "📚🧒",
      options: ["I have", "I will have", "I has"],
      answer: "I will have"
    },
    {
      id: 13,
      text: "They ___ many interesting stories to tell.",
      image: "👵🏾👴🏾📖",
      options: ["they has", "they have", "they will have"],
      answer: "they have"
    },
    {
      id: 14,
      text: "Next year, our school ___ a new library.",
      image: "🏫📚",
      options: ["it has", "it will have", "it have"],
      answer: "it will have"
    },
    {
      id: 15,
      text: "He ___ a blue car.",
      image: "🚗👨",
      type: "fill",
      answer: "has"
    },
    {
      id: 16,
      text: "Soon, we ___ a long holiday.",
      image: "🏖️👨‍👩‍👧‍👦",
      options: ["we has", "we have", "we will have"],
      answer: "we will have"
    },
    {
      id: 17,
      text: "The bird ___ colorful feathers.",
      image: "🐦🌈",
      type: "fill",
      answer: "has"
    },
    {
      id: 18,
      text: "By next month, she ___ finished her project.",
      image: "👩🏾‍💻✅",
      options: ["she has", "she will have", "she have"],
      answer: "she will have"
    },
    {
      id: 19,
      text: "My father ___ a strong voice.",
      image: "👨🏾‍🦱🗣️",
      options: ["he has", "he will have", "he have"],
      answer: "he has"
    },
    {
      id: 20,
      text: "Tomorrow, they ___ a football match.",
      image: "⚽👫",
      options: ["they have", "they will have", "they has"],
      answer: "they will have"
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [fillAnswer, setFillAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const correct = option === questions[currentQuestion].answer;
    
    if (correct) {
      setScore(score + 1);
      setFeedback("Correct! 🎉");
    } else {
      setFeedback(`Try again! The answer is: ${questions[currentQuestion].answer}`);
    }
  };

  const handleFillSubmit = () => {
    const correct = fillAnswer.toLowerCase() === questions[currentQuestion].answer.toLowerCase();
    
    if (correct) {
      setScore(score + 1);
      setFeedback("Perfect! 🌟");
    } else {
      setFeedback(`Almost! It should be: ${questions[currentQuestion].answer}`);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setFillAnswer("");
      setFeedback("");
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setFeedback("");
  };

  return (
    <div className="app">
      {/* Embedded CSS for styling */}
      <style>
        {`
          /* src/App.css */
          body {
            margin: 0;
            padding: 0;
            font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
            background-color: #f0f9ff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .app {
            width: 95%;
            max-width: 600px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            overflow: hidden;
            padding: 20px;
            margin: 20px auto;
          }

          header {
            text-align: center;
            background: #4e9af1;
            color: white;
            padding: 20px;
            border-radius: 15px 15px 0 0;
            margin: -20px -20px 20px -20px;
          }

          header h1 {
            margin: 0;
            font-size: 2.2rem;
          }

          .question-section {
            padding: 15px;
          }

          .question-count {
            font-size: 1.2rem;
            color: #4e9af1;
            margin-bottom: 15px;
          }

          .question-image {
            font-size: 4rem;
            text-align: center;
            margin: 20px 0;
          }

          .question-text {
            font-size: 1.8rem;
            text-align: center;
            color: #333;
            min-height: 80px; /* Ensures consistent height for question text */
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .options-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 25px 0;
          }

          .option-btn {
            padding: 18px;
            font-size: 1.5rem;
            background: #f0f7ff;
            border: 2px solid #4e9af1;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
          }

          .option-btn:hover {
            background: #e1eeff;
            transform: scale(1.02);
          }

          .option-btn.selected {
            background: #4e9af1;
            color: white;
            font-weight: bold;
          }

          .fill-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 25px 0;
          }

          .fill-input {
            padding: 18px;
            font-size: 1.5rem;
            border: 2px solid #4e9af1;
            border-radius: 12px;
            text-align: center;
          }

          .submit-btn, .next-btn, .reset-btn {
            padding: 18px;
            font-size: 1.5rem;
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          }

          .submit-btn:hover, .next-btn:hover, .reset-btn:hover {
            background: #e68900;
            transform: scale(1.02);
          }

          .feedback {
            padding: 20px;
            margin: 20px 0;
            border-radius: 12px;
            font-size: 1.5rem;
            text-align: center;
            display: flex; /* Added for better alignment of feedback and next button */
            flex-direction: column; /* Stack feedback text and button vertically */
            gap: 15px; /* Space between feedback text and button */
          }

          .feedback.correct {
            background: #e8f5e9;
            color: #2e7d32;
          }

          .feedback.incorrect {
            background: #ffebee;
            color: #c62828;
          }

          .score-section {
            text-align: center;
            padding: 30px;
          }

          .score-section h2 {
            color: #4e9af1;
            font-size: 2.5rem;
          }

          .score-section p {
            font-size: 2rem;
            margin: 20px 0;
          }

          .celebration {
            font-size: 3rem;
            margin: 30px 0;
          }

          footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 1.1rem;
          }

          /* Tablet-friendly adjustments */
          @media (max-width: 768px) {
            .question-text {
              font-size: 1.6rem;
              min-height: 70px; /* Adjusted for smaller screens */
            }
            
            .option-btn, .fill-input, .submit-btn, .next-btn, .reset-btn {
              padding: 15px;
              font-size: 1.3rem;
            }
            
            header h1 {
              font-size: 2rem;
            }

            .score-section h2 {
              font-size: 2.2rem;
            }

            .score-section p {
              font-size: 1.8rem;
            }

            .feedback {
              font-size: 1.3rem;
              padding: 15px;
            }
          }

          @media (max-width: 480px) {
            .question-text {
              font-size: 1.4rem;
              min-height: 60px; /* Further adjusted for smaller screens */
            }
            
            .question-image {
              font-size: 3rem;
            }

            .option-btn, .fill-input, .submit-btn, .next-btn, .reset-btn {
              padding: 12px;
              font-size: 1.1rem;
            }

            header h1 {
              font-size: 1.8rem;
            }

            .score-section h2 {
              font-size: 2rem;
            }

            .score-section p {
              font-size: 1.6rem;
            }

            .feedback {
              font-size: 1.1rem;
              padding: 12px;
            }
          }
        `}
      </style>
      
      <header>
        <h1>English Safari 🦁</h1>
        <p>Learn "has" and "will have" with Ama & Kofi!</p>
      </header>

      {showScore ? (
        <div className="score-section">
          <h2>Quiz Completed! 🏆</h2>
          <p>You scored {score} out of {questions.length}</p>
          <div className="celebration">🎉✨👏🏾</div>
          <button className="reset-btn" onClick={resetQuiz}>
            Play Again
          </button>
        </div>
      ) : (
        <div className="question-section">
          <div className="question-count">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          
          <div className="question-image">
            {questions[currentQuestion].image}
          </div>
          
          <h3 className="question-text">
            {questions[currentQuestion].text}
          </h3>
          
          {questions[currentQuestion].type === "fill" ? (
            <div className="fill-container">
              <input
                type="text"
                value={fillAnswer}
                onChange={(e) => setFillAnswer(e.target.value)}
                placeholder="Type your answer"
                className="fill-input"
              />
              <button 
                onClick={handleFillSubmit}
                className="submit-btn"
              >
                Check Answer
              </button>
            </div>
          ) : (
            <div className="options-container">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${selectedOption === option ? "selected" : ""}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          
          {feedback && (
            <div className={`feedback ${feedback.includes("Correct") || feedback.includes("Perfect") ? "correct" : "incorrect"}`}>
              {feedback}
              <button 
                onClick={handleNext}
                className="next-btn"
              >
                {currentQuestion < questions.length - 1 ? "Next Question →" : "Finish Quiz"}
              </button>
            </div>
          )}
        </div>
      )}
      
      <footer>
        <p>Made for Ghanaian learners 🇬🇭 | Happy Friday!</p>
      </footer>
    </div>
  );
}

export default App;
