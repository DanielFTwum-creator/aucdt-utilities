import React from 'react'
import { motion } from 'framer-motion'

const Assessments = ({ assessmentsData, onAssessmentStart }) => {
  const dailyQuiz = {
    id: 'daily-quiz',
    title: 'Daily Quick Quiz',
    description: '5 questions to practice today\'s lessons',
    duration: '5 minutes',
    questions: 5,
    points: 25
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: '✅', text: `Completed - Score: ${'85'}%`, className: 'status-completed' }
      case 'available':
        return { icon: '📝', text: 'Available', className: 'status-available' }
      case 'locked':
        return { icon: '🔒', text: 'Complete Geometry first', className: 'status-locked' }
      default:
        return { icon: '📝', text: 'Available', className: 'status-available' }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="assessments"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Assessments</h1>
        <p className="section-subtitle">Test your knowledge and earn points</p>
      </motion.div>

      <div className="assessments-container">
        {/* Daily Quick Quiz */}
        <motion.div variants={itemVariants} className="assessment-card card">
          <div className="card-header">
            <h3 className="card-title">{dailyQuiz.title}</h3>
            <p className="card-description">{dailyQuiz.description}</p>
          </div>
          <div className="assessment-meta">
            <span className="meta-item">
              <span>⏱️</span>
              <span>{dailyQuiz.duration}</span>
            </span>
            <span className="meta-item">
              <span>🎯</span>
              <span>{dailyQuiz.questions} questions</span>
            </span>
            <span className="meta-item">
              <span>⭐</span>
              <span>{dailyQuiz.points} points</span>
            </span>
          </div>
          <motion.button 
            className="start-assessment-btn"
            onClick={() => onAssessmentStart(dailyQuiz.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Quiz
          </motion.button>
        </motion.div>

        {/* Strand Assessments */}
        <motion.div variants={itemVariants} className="assessments-list">
          <h3 className="list-title">Strand Assessments</h3>
          
          {assessmentsData.map((assessment, index) => {
            const status = getStatusIcon(assessment.status)
            
            return (
              <motion.div
                key={assessment.id}
                className="assessment-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="assessment-info">
                  <h4 className="assessment-title">{assessment.title}</h4>
                  <p className="assessment-description">{assessment.description}</p>
                  <div className={`assessment-status ${status.className}`}>
                    <span className="status-icon">{status.icon}</span>
                    <span className="status-text">{status.text}</span>
                  </div>
                </div>
                
                {assessment.status === 'completed' ? (
                  <div className="assessment-score">
                    <span className="score-number">85</span>
                    <span className="score-label">%</span>
                  </div>
                ) : assessment.status === 'locked' ? (
                  <button className="locked-btn" disabled>
                    Locked
                  </button>
                ) : (
                  <motion.button 
                    className="take-assessment-btn"
                    onClick={() => onAssessmentStart(assessment.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Take Test
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Assessments