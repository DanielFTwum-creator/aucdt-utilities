import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUIZ_QUESTIONS } from '../data/assessmentsData'

const AssessmentQuiz = ({ assessmentId, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes default
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questions = QUIZ_QUESTIONS[assessmentId] || QUIZ_QUESTIONS['daily-quiz']
  const isTimeLimit = assessmentId !== 'daily-quiz' // Daily quiz has no time limit

  // Timer effect
  useEffect(() => {
    if (showResults || !isTimeLimit) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, showResults, isTimeLimit])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    
    // Calculate results
    let correctCount = 0
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correctCount++
      }
    })

    const score = Math.round((correctCount / questions.length) * 100)
    
    setTimeout(() => {
      setShowResults(true)
      setIsSubmitting(false)
      
      // Call completion handler after a delay
      setTimeout(() => {
        onComplete && onComplete(assessmentId, {
          score,
          correctAnswers: correctCount,
          totalQuestions: questions.length,
          timeSpent: isTimeLimit ? (300 - timeRemaining) : 0,
          answers: selectedAnswers
        })
      }, 3000)
    }, 1500)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'
    if (score >= 60) return '#FFC02D'
    return '#e74c3c'
  }

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding! You're a math superstar! 🌟"
    if (score >= 80) return "Great job! You really understand this! 👏"
    if (score >= 70) return "Good work! Keep practicing! 💪"
    if (score >= 60) return "Not bad! Review the concepts and try again 📚"
    return "Don't worry! Learning takes time. Try again! 🌱"
  }

  if (showResults) {
    const correctCount = questions.filter(q => selectedAnswers[q.id] === q.correct).length
    const score = Math.round((correctCount / questions.length) * 100)

    return (
      <motion.div
        className="quiz-results-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
      >
        <motion.div
          className="quiz-results"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '3rem',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
          >
            {score >= 80 ? '🎉' : score >= 60 ? '😊' : '💪'}
          </motion.div>

          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: getScoreColor(score),
            marginBottom: '1rem'
          }}>
            {score}%
          </h2>

          <p style={{ 
            fontSize: '1.2rem', 
            color: '#7F8C8D',
            marginBottom: '2rem'
          }}>
            {getScoreMessage(score)}
          </p>

          <div style={{ 
            background: '#FAF8F2', 
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#7F8C8D' }}>Correct</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
                  {correctCount}/{questions.length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#7F8C8D' }}>Time</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4A90E2' }}>
                  {isTimeLimit ? formatTime(300 - timeRemaining) : 'No limit'}
                </div>
              </div>
            </div>
          </div>

          <motion.button
            className="btn btn-primary"
            style={{ minWidth: '200px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Continue Learning
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="quiz-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
    >
      <motion.div
        className="quiz-content"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'white',
          borderRadius: '24px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Quiz Header */}
        <div className="quiz-header" style={{
          background: '#FFC02D',
          padding: '1.5rem 2rem',
          textAlign: 'center'
        }}>
          <h3 className="quiz-title">
            {assessmentId === 'daily-quiz' ? 'Daily Quick Quiz' : 'Assessment Quiz'}
          </h3>
          <div className="quiz-progress" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#7F8C8D' }}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            {isTimeLimit && (
              <div className="quiz-timer" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: timeRemaining < 30 ? '#e74c3c' : '#2C3E50'
              }}>
                <span>⏱️</span>
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <div className="progress-bar" style={{ marginTop: '1rem' }}>
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <div className="quiz-content" style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="question">
                <div className="question-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#7F8C8D' 
                  }}>
                    Question {currentQuestion + 1}
                  </span>
                </div>

                <h4 className="question-text" style={{
                  fontSize: '1.25rem',
                  lineHeight: 1.4,
                  marginBottom: '2rem',
                  color: '#2C3E50'
                }}>
                  {questions[currentQuestion].question}
                </h4>

                <div className="question-options">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      className={`option ${selectedAnswers[questions[currentQuestion].id] === index ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: selectedAnswers[questions[currentQuestion].id] === index 
                          ? '#FFF3CC' 
                          : '#FAF8F2',
                        border: selectedAnswers[questions[currentQuestion].id] === index 
                          ? '2px solid #FFC02D' 
                          : '2px solid #E8E8E8',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        minHeight: '44px'
                      }}
                    >
                      <div style={{
                        width: '30px',
                        height: '30px',
                        background: selectedAnswers[questions[currentQuestion].id] === index 
                          ? '#FFC02D' 
                          : 'white',
                        color: selectedAnswers[questions[currentQuestion].id] === index 
                          ? '#2C3E50' 
                          : '#7F8C8D',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span style={{ flex: 1 }}>{option}</span>
                    </motion.button>
                  ))}
                </div>

                {questions[currentQuestion].explanation && (
                  <div className="quiz-feedback" style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: '#F0F8FF',
                    borderRadius: '8px',
                    border: '1px solid #4A90E2'
                  }}>
                    <p style={{ fontSize: '0.875rem', color: '#4A90E2' }}>
                      💡 {questions[currentQuestion].explanation}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quiz Controls */}
        <div className="quiz-controls" style={{
          padding: '1.5rem 2rem',
          background: '#FAF8F2',
          borderTop: '1px solid #E8E8E8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn btn-secondary"
            style={{ 
              opacity: currentQuestion === 0 ? 0.5 : 1,
              minWidth: '100px'
            }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {questions.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: index === currentQuestion 
                    ? '#FFC02D' 
                    : selectedAnswers[questions[index].id] !== undefined
                    ? '#4CAF50'
                    : '#E8E8E8',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentQuestion(index)}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <motion.button
              className="btn btn-primary"
              style={{ minWidth: '120px' }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </motion.button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ minWidth: '100px' }}
            >
              Next
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AssessmentQuiz