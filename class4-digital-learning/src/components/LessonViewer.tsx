import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LessonViewer = ({ lesson, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [interactiveElements, setInteractiveElements] = useState({})

  // Mock lesson content structure
  const lessonContent = {
    introduction: {
      title: 'Welcome to the lesson!',
      content: 'Today we will learn about ' + lesson.title.toLowerCase(),
      activities: []
    },
    concept: {
      title: 'Main Concept',
      content: 'Understanding the key mathematical concept...',
      examples: [
        'Example 1: Visual representation',
        'Example 2: Step-by-step solution',
        'Example 3: Real-world application'
      ],
      interactive: [
        {
          type: 'virtual-manipulative',
          id: 'base-ten-blocks',
          instruction: 'Click and drag blocks to represent the number'
        }
      ]
    },
    practice: {
      title: 'Practice Time',
      content: 'Now it\'s your turn to try!',
      exercises: [
        {
          type: 'multiple-choice',
          question: 'What is 250 + 180?',
          options: ['420', '430', '440', '450'],
          correct: 1
        },
        {
          type: 'drag-drop',
          instruction: 'Arrange the numbers in order from smallest to largest',
          items: [456, 234, 789, 123]
        }
      ]
    },
    summary: {
      title: 'Great Job!',
      content: 'You have completed this lesson. Here\'s what we learned:',
      keyPoints: [
        'Key point 1',
        'Key point 2',
        'Key point 3'
      ]
    }
  }

  const steps = Object.keys(lessonContent)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeLesson()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeLesson = () => {
    setIsCompleted(true)
    setTimeout(() => {
      onComplete && onComplete(lesson.id)
      onClose()
    }, 2000)
  }

  const renderInteractiveElement = (element) => {
    switch (element.type) {
      case 'virtual-manipulative':
        return <VirtualManipulative {...element} />
      case 'multiple-choice':
        return <MultipleChoiceQuestion {...element} />
      case 'drag-drop':
        return <DragDropExercise {...element} />
      default:
        return <div>Interactive element not supported</div>
    }
  }

  return (
    <motion.div
      className="lesson-viewer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
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
        className="modal-content"
        style={{
          background: 'white',
          borderRadius: '24px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        {/* Header */}
        <div className="modal-header" style={{
          padding: '2rem 2rem 1rem',
          borderBottom: '1px solid #E8E8E8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
              {lesson.title}
            </h2>
            <p style={{ margin: '0.5rem 0 0', color: '#7F8C8D' }}>
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: '#7F8C8D',
              padding: '0.5rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: '0 2rem' }}>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                {lessonContent[steps[currentStep]].title}
              </h3>
              
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {lessonContent[steps[currentStep]].content}
              </p>

              {lessonContent[steps[currentStep]].examples && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Examples:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {lessonContent[steps[currentStep]].examples.map((example, index) => (
                      <li 
                        key={index}
                        style={{ 
                          padding: '0.75rem',
                          background: '#FAF8F2',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          borderLeft: '4px solid #FFC02D'
                        }}
                      >
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lessonContent[steps[currentStep]].keyPoints && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Key Points:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {lessonContent[steps[currentStep]].keyPoints.map((point, index) => (
                      <li 
                        key={index}
                        style={{ 
                          padding: '0.75rem',
                          background: '#F0F8FF',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          borderLeft: '4px solid #4A90E2'
                        }}
                      >
                        ✓ {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lessonContent[steps[currentStep]].interactive && (
                <div style={{ marginBottom: '1.5rem' }}>
                  {lessonContent[steps[currentStep]].interactive.map((element, index) => (
                    <div key={index} style={{ marginBottom: '1rem' }}>
                      <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                        {element.instruction}
                      </p>
                      {renderInteractiveElement(element)}
                    </div>
                  ))}
                </div>
              )}

              {lessonContent[steps[currentStep]].exercises && (
                <div style={{ marginBottom: '1.5rem' }}>
                  {lessonContent[steps[currentStep]].exercises.map((exercise, index) => (
                    <div key={index} style={{ marginBottom: '1.5rem' }}>
                      {renderInteractiveElement(exercise)}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Completion Animation */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lesson-completion"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                style={{ fontSize: '4rem', marginBottom: '1rem' }}
              >
                🎉
              </motion.div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>
                Lesson Complete!
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#7F8C8D', marginTop: '0.5rem' }}>
                Great job! You've mastered this concept.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!isCompleted && (
          <div className="modal-footer" style={{
            padding: '1rem 2rem 2rem',
            borderTop: '1px solid #E8E8E8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn btn-secondary"
              style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {steps.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: index === currentStep ? '#FFC02D' : '#E8E8E8'
                  }}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="btn btn-primary"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Virtual Manipulative Component
const VirtualManipulative = ({ id, instruction }) => {
  const [blocks, setBlocks] = useState(Array(5).fill(null))
  const [draggedBlock, setDraggedBlock] = useState(null)

  const handleBlockClick = (index) => {
    const newBlocks = [...blocks]
    if (newBlocks[index] === null) {
      newBlocks[index] = Math.floor(Math.random() * 9) + 1
    } else {
      newBlocks[index] = null
    }
    setBlocks(newBlocks)
  }

  return (
    <div style={{ 
      background: '#FAF8F2', 
      padding: '1.5rem', 
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <p style={{ marginBottom: '1rem', fontWeight: '600' }}>{instruction}</p>
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {blocks.map((block, index) => (
          <motion.div
            key={index}
            className="base-ten-block"
            style={{
              width: '50px',
              height: '50px',
              background: block ? '#4A90E2' : '#E8E8E8',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: block ? 'white' : '#7F8C8D',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleBlockClick(index)}
          >
            {block || '+'}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Multiple Choice Question Component
const MultipleChoiceQuestion = ({ question, options, correct }) => {
  const [selected, setSelected] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleSelect = (index) => {
    setSelected(index)
    setShowAnswer(true)
  }

  return (
    <div style={{ 
      background: '#F0F8FF', 
      padding: '1.5rem', 
      borderRadius: '12px',
      border: '2px solid #4A90E2'
    }}>
      <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>{question}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            className="option"
            style={{
              padding: '0.75rem',
              background: selected === null ? 'white' : 
                       index === correct ? '#4CAF50' :
                       selected === index ? '#e74c3c' : 'white',
              color: selected !== null && index !== correct && selected === index ? 'white' : 
                    index === correct ? 'white' : '#2C3E50',
              border: selected === null ? '2px solid #E8E8E8' :
                     index === correct ? '2px solid #4CAF50' :
                     selected === index ? '2px solid #e74c3c' : '2px solid #E8E8E8',
              borderRadius: '8px',
              cursor: selected ? 'default' : 'pointer',
              textAlign: 'left',
              fontWeight: selected !== null && index === correct ? 'bold' : 'normal'
            }}
            whileHover={selected === null ? { scale: 1.02 } : {}}
            whileTap={selected === null ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(index)}
            disabled={selected !== null}
          >
            {String.fromCharCode(65 + index)}. {option}
          </motion.button>
        ))}
      </div>
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '8px' }}
        >
          {selected === correct ? (
            <span style={{ color: '#4CAF50', fontWeight: '600' }}>✓ Correct!</span>
          ) : (
            <span style={{ color: '#e74c3c', fontWeight: '600' }}>
              ✗ Incorrect. The correct answer is {String.fromCharCode(65 + correct)}.
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}

// Drag Drop Exercise Component
const DragDropExercise = ({ instruction, items }) => {
  const [arrangedItems, setArrangedItems] = useState([])
  const [availableItems, setAvailableItems] = useState([...items].sort(() => Math.random() - 0.5))

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const item = parseInt(e.dataTransfer.getData('text/plain'))
    
    if (!arrangedItems.includes(item)) {
      setArrangedItems([...arrangedItems, item])
      setAvailableItems(availableItems.filter(i => i !== item))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const reset = () => {
    setArrangedItems([])
    setAvailableItems([...items].sort(() => Math.random() - 0.5))
  }

  return (
    <div style={{ 
      background: '#FFF8E1', 
      padding: '1.5rem', 
      borderRadius: '12px',
      border: '2px solid #FFC02D'
    }}>
      <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>{instruction}</h4>
      
      {/* Available Items */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#7F8C8D', marginBottom: '0.5rem' }}>Available:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {availableItems.map((item) => (
            <motion.div
              key={item}
              className="number-token"
              style={{
                width: '40px',
                height: '40px',
                background: '#FFC02D',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#2C3E50',
                cursor: 'grab'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          minHeight: '60px',
          background: 'white',
          border: '2px dashed #E8E8E8',
          borderRadius: '8px',
          padding: '1rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ color: '#7F8C8D', fontSize: '0.875rem' }}>
          Drag numbers here to arrange them
        </span>
        {arrangedItems.map((item) => (
          <div
            key={item}
            style={{
              width: '40px',
              height: '40px',
              background: '#4CAF50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <button
        onClick={reset}
        className="btn btn-outline"
        style={{ marginTop: '1rem' }}
      >
        Reset
      </button>
    </div>
  )
}

export default LessonViewer