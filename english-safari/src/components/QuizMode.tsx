import React, { useState } from 'react';

const questions = [
  { id: 1, text: "Look! Ama ___ a bright yellow school bag.", image: "👧🏾🎒", options: ["he has", "she has", "I has"], answer: "she has" },
  { id: 2, text: "Kofi ___ a fast bicycle.", image: "🚲👦🏾", options: ["she has", "he has", "have"], answer: "he has" },
  { id: 3, text: "She ___ two red pencils.", image: "✏️✏️👧🏾", type: "fill" as const, answer: "has" },
  { id: 4, text: "Tomorrow, Ama ___ a new storybook.", image: "📖👧🏾", options: ["she will have", "she has", "will she have"], answer: "she will have" },
  { id: 5, text: "Next week, Kofi ___ a birthday party!", image: "🎉👦🏾", options: ["he has", "he will have", "have"], answer: "he will have" },
  { id: 6, text: "She ___ a mango for lunch later.", image: "🥭👧🏾", type: "fill" as const, answer: "'ll have" },
  { id: 7, text: "Today, Kofi ___ his football.", image: "⚽👦🏾", options: ["has", "will have"], answer: "has" },
  { id: 8, text: "After class, the children ___ free time!", image: "😊👫", options: ["they have", "they'll have"], answer: "they'll have" },
  { id: 9, text: "My mother ___ a beautiful kente cloth.", image: "👩🏾‍🦱👗", options: ["she has", "he has", "they have"], answer: "she has" },
  { id: 10, text: "We ___ a big family dinner on Sunday.", image: "👨‍👩‍👧‍👦🍽️", options: ["we have", "we will have", "we has"], answer: "we will have" },
  { id: 11, text: "The dog ___ a fluffy tail.", image: "🐶🐾", type: "fill" as const, answer: "has" },
  { id: 12, text: "In the evening, I ___ my homework.", image: "📚🧒", options: ["I have", "I will have", "I has"], answer: "I will have" },
  { id: 13, text: "They ___ many interesting stories to tell.", image: "👵🏾👴🏾📖", options: ["they has", "they have", "they will have"], answer: "they have" },
  { id: 14, text: "Next year, our school ___ a new library.", image: "🏫📚", options: ["it has", "it will have", "it have"], answer: "it will have" },
  { id: 15, text: "He ___ a blue car.", image: "🚗👨", type: "fill" as const, answer: "has" },
  { id: 16, text: "Soon, we ___ a long holiday.", image: "🏖️👨‍👩‍👧‍👦", options: ["we has", "we have", "we will have"], answer: "we will have" },
  { id: 17, text: "The bird ___ colorful feathers.", image: "🐦🌈", type: "fill" as const, answer: "has" },
  { id: 18, text: "By next month, she ___ finished her project.", image: "👩🏾‍💻✅", options: ["she has", "she will have", "she have"], answer: "she will have" },
  { id: 19, text: "My father ___ a strong voice.", image: "👨🏾‍🦱🗣️", options: ["he has", "he will have", "he have"], answer: "he has" },
  { id: 20, text: "Tomorrow, they ___ a football match.", image: "⚽👫", options: ["they have", "they will have", "they has"], answer: "they will have" },
];

export default function QuizMode() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [fillAnswer, setFillAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleOptionClick = (option: string) => {
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
    setSelectedOption("");
    setFillAnswer("");
  };

  if (showScore) {
    return (
      <div className="score-section">
        <h2>Quiz Completed! 🏆</h2>
        <p>You scored {score} out of {questions.length}</p>
        <div className="celebration">🎉✨👏🏾</div>
        <button className="reset-btn" onClick={resetQuiz}>Play Again</button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="question-section">
      <div className="question-count">
        Question {currentQuestion + 1}/{questions.length}
      </div>
      <div className="question-image">{q.image}</div>
      <h3 className="question-text">{q.text}</h3>

      {q.type === "fill" ? (
        <div className="fill-container">
          <input
            type="text"
            value={fillAnswer}
            onChange={(e) => setFillAnswer(e.target.value)}
            placeholder="Type your answer"
            className="fill-input"
          />
          <button onClick={handleFillSubmit} className="submit-btn">Check Answer</button>
        </div>
      ) : (
        <div className="options-container">
          {q.options?.map((option, index) => (
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
          <button onClick={handleNext} className="next-btn">
            {currentQuestion < questions.length - 1 ? "Next Question →" : "Finish Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}
