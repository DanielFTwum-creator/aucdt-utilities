import React from 'react'
import { motion } from 'framer-motion'

const Dashboard = ({ currentUser, onSectionChange }) => {
  const todaysProgress = {
    lessonsCompleted: 2,
    pointsEarned: 150,
    badgesWon: 3
  }

  const continueLearning = {
    title: 'Adding Big Numbers',
    description: 'Learn to add numbers up to 10,000',
    progress: 65,
    strand: 'number-operations',
    icon: '🔢'
  }

  const recentBadges = [
    { name: 'Number Master', icon: '🏅' },
    { name: 'Quick Learner', icon: '⚡' },
    { name: 'Perfect Score', icon: '🌟' }
  ]

  const strands = [
    {
      id: 'number-operations',
      title: 'Number Operations',
      icon: '🔢',
      completed: 12,
      total: 15,
      progress: 80,
      color: 'number-operations'
    },
    {
      id: 'algebra',
      title: 'Algebra & Patterns',
      icon: '🔗',
      completed: 8,
      total: 12,
      progress: 67,
      color: 'algebra'
    },
    {
      id: 'geometry',
      title: 'Geometry & Measurement',
      icon: '📐',
      completed: 5,
      total: 10,
      progress: 50,
      color: 'geometry'
    },
    {
      id: 'data-handling',
      title: 'Data Handling',
      icon: '📊',
      completed: 3,
      total: 8,
      progress: 38,
      color: 'data-handling'
    }
  ]

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
      className="dashboard"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Welcome back, {currentUser.name}! 🌟</h1>
        <p className="section-subtitle">Ready to continue your math adventure?</p>
      </motion.div>

      <motion.div variants={itemVariants} className="dashboard-grid">
        {/* Quick Stats */}
        <div className="stats-card card">
          <div className="card-header">
            <h3 className="card-title">Today's Progress</h3>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-number">{todaysProgress.lessonsCompleted}</span>
                <span className="stat-label">Lessons Completed</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-number">{todaysProgress.pointsEarned}</span>
                <span className="stat-label">Points Earned</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <span className="stat-number">{todaysProgress.badgesWon}</span>
                <span className="stat-label">Badges Won</span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="continue-card card">
          <div className="card-header">
            <h3 className="card-title">Continue Learning</h3>
          </div>
          <div className="lesson-preview">
            <div className="lesson-thumbnail">
              <div className={`thumbnail-bg ${continueLearning.strand}`}>
                <span className="thumbnail-icon">{continueLearning.icon}</span>
              </div>
            </div>
            <div className="lesson-info">
              <h4 className="lesson-title">{continueLearning.title}</h4>
              <p className="lesson-description">{continueLearning.description}</p>
              <div className="progress-bar-small">
                <div 
                  className="progress-fill-small" 
                  style={{ width: `${continueLearning.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{continueLearning.progress}% complete</span>
            </div>
            <motion.button 
              className="continue-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </div>
        </div>

        {/* Recent Badges */}
        <div className="badges-card card">
          <div className="card-header">
            <h3 className="card-title">Recently Earned</h3>
          </div>
          <div className="badges-grid">
            {recentBadges.map((badge, index) => (
              <motion.div 
                key={index}
                className="badge-item"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="badge-icon">{badge.icon}</div>
                <span className="badge-name">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strand Overview */}
      <motion.div variants={itemVariants} className="strands-overview">
        <h3 className="section-subtitle">Math Strands</h3>
        <div className="strands-grid">
          {strands.map((strand) => (
            <motion.div
              key={strand.id}
              className={`strand-card ${strand.color}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSectionChange('lessons')}
            >
              <div className="strand-header">
                <div className="strand-icon">{strand.icon}</div>
                <h4 className="strand-title">{strand.title}</h4>
              </div>
              <div className="strand-progress">
                <div className="progress-indicator">
                  <span className="progress-text">
                    {strand.completed}/{strand.total} lessons
                  </span>
                  <div className="radial-progress">
                    <svg className="progress-circle" width="60" height="60">
                      <circle cx="30" cy="30" r="25" className="progress-track"></circle>
                      <circle 
                        cx="30" 
                        cy="30" 
                        r="25" 
                        className="progress-fill" 
                        style={{ 
                          strokeDasharray: `${strand.progress * 1.57} 157` 
                        }}
                      />
                    </svg>
                    <span className="progress-percentage">{strand.progress}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard