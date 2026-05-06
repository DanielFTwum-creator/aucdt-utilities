import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Lessons = ({ lessonsData, onLessonSelect }) => {
  const [activeFilter, setActiveFilter] = useState('all')

  const strandFilters = [
    { id: 'all', label: 'All Strands' },
    { id: 'number-operations', label: 'Number Operations' },
    { id: 'algebra', label: 'Algebra & Patterns' },
    { id: 'geometry', label: 'Geometry & Measurement' },
    { id: 'data-handling', label: 'Data Handling' }
  ]

  const filteredLessons = lessonsData.filter(lesson => 
    activeFilter === 'all' || lesson.strand === activeFilter
  )

  const getDifficultyDots = (difficulty) => {
    const dots = []
    for (let i = 1; i <= 3; i++) {
      dots.push(
        <div 
          key={i} 
          className={`difficulty-dot ${i <= difficulty ? 'active' : ''}`}
        />
      )
    }
    return dots
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: '✅', text: 'Completed', className: 'status-completed' }
      case 'available':
        return { icon: '📝', text: 'Available', className: 'status-available' }
      case 'locked':
        return { icon: '🔒', text: 'Locked', className: 'status-locked' }
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
      className="lessons"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Math Lessons</h1>
        <p className="section-subtitle">Choose a strand to start learning</p>
      </motion.div>

      {/* Strand Filter */}
      <motion.div variants={itemVariants} className="lesson-filter">
        {strandFilters.map((filter) => (
          <motion.button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Lessons Grid */}
      <motion.div 
        variants={itemVariants}
        className="lessons-grid"
      >
        {filteredLessons.map((lesson, index) => {
          const status = getStatusIcon(lesson.status)
          
          return (
            <motion.div
              key={lesson.id}
              className={`lesson-card ${lesson.status}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => lesson.status !== 'locked' && onLessonSelect(lesson.id)}
            >
              <div className="lesson-card-header">
                <div className="lesson-card-icon">
                  {lesson.icon}
                </div>
                <h4 className="lesson-card-title">{lesson.title}</h4>
              </div>
              
              <p className="lesson-card-description">
                {lesson.description}
              </p>
              
              <div className="lesson-card-meta">
                <div className="lesson-difficulty">
                  {getDifficultyDots(lesson.difficulty)}
                </div>
                
                <div className="lesson-duration">
                  <span>⏱️</span>
                  <span>{lesson.duration}</span>
                </div>
                
                <div className="lesson-status">
                  <span>{status.icon}</span>
                  <span className={status.className}>{status.text}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default Lessons