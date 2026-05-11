import React from 'react'
import { motion } from 'framer-motion'

const Progress = ({ currentUser, lessonsData, assessmentsData }) => {
  const overallStats = {
    lessonsCompleted: 28,
    lessonsTotal: 45,
    assessmentsPassed: 12,
    assessmentsTotal: 15,
    totalPoints: 1250,
    badgesEarned: 8,
    badgesTotal: 12
  }

  const overallProgress = Math.round((overallStats.lessonsCompleted / overallStats.lessonsTotal) * 100)

  const strandProgress = [
    {
      id: 'number-operations',
      name: 'Number Operations',
      icon: '🔢',
      completed: 12,
      total: 15,
      progress: 80,
      colorClass: 'number-operations'
    },
    {
      id: 'algebra',
      name: 'Algebra & Patterns',
      icon: '🔗',
      completed: 8,
      total: 12,
      progress: 67,
      colorClass: 'algebra'
    },
    {
      id: 'geometry',
      name: 'Geometry & Measurement',
      icon: '📐',
      completed: 5,
      total: 10,
      progress: 50,
      colorClass: 'geometry'
    },
    {
      id: 'data-handling',
      name: 'Data Handling',
      icon: '📊',
      completed: 3,
      total: 8,
      progress: 38,
      colorClass: 'data-handling'
    }
  ]

  const achievements = [
    {
      name: 'Number Master',
      icon: '🏅',
      date: 'Earned 2 days ago',
      earned: true
    },
    {
      name: 'Quick Learner',
      icon: '⚡',
      date: 'Earned 1 week ago',
      earned: true
    },
    {
      name: 'Perfect Score',
      icon: '🌟',
      date: 'Earned 2 weeks ago',
      earned: true
    },
    {
      name: 'Geometry Expert',
      icon: '🏆',
      requirement: 'Complete Geometry strand',
      earned: false
    },
    {
      name: 'Pattern Detective',
      icon: '🎯',
      requirement: 'Complete Algebra strand',
      earned: false
    },
    {
      name: 'Data Champion',
      icon: '📊',
      requirement: 'Complete Data Handling',
      earned: false
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
      className="progress"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Your Progress</h1>
        <p className="section-subtitle">Track your learning journey</p>
      </motion.div>

      <div className="progress-dashboard">
        {/* Overall Progress */}
        <motion.div variants={itemVariants} className="progress-overview card">
          <div className="card-header">
            <h3 className="card-title">Overall Progress</h3>
          </div>
          <div className="overall-progress">
            <div className="progress-visual">
              <svg className="large-progress-circle" width="150" height="150">
                <circle cx="75" cy="75" r="65" className="progress-track-large"></circle>
                <circle 
                  cx="75" 
                  cy="75" 
                  r="65" 
                  className="progress-fill-large" 
                  style={{ 
                    strokeDasharray: `${overallProgress * 4.08} 408` 
                  }}
                />
              </svg>
              <div className="progress-center">
                <span className="progress-percentage-large">{overallProgress}%</span>
                <span className="progress-label">Complete</span>
              </div>
            </div>
            <div className="progress-stats">
              <div className="stat-row">
                <span className="stat-label">Lessons Completed:</span>
                <span className="stat-value">
                  {overallStats.lessonsCompleted}/{overallStats.lessonsTotal}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Assessments Passed:</span>
                <span className="stat-value">
                  {overallStats.assessmentsPassed}/{overallStats.assessmentsTotal}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Points:</span>
                <span className="stat-value">{overallStats.totalPoints.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Badges Earned:</span>
                <span className="stat-value">
                  {overallStats.badgesEarned}/{overallStats.badgesTotal}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strand Progress Details */}
        <motion.div variants={itemVariants} className="strand-progress-details">
          <h3 className="card-title">Strand Progress</h3>
          {strandProgress.map((strand) => (
            <div key={strand.id} className="strand-progress-item">
              <div className="strand-header-small">
                <div className={`strand-icon-small ${strand.colorClass}`}>
                  {strand.icon}
                </div>
                <div className="strand-info-small">
                  <h4 className="strand-name">{strand.name}</h4>
                  <span className="strand-completion">
                    {strand.completed}/{strand.total} lessons ({strand.progress}%)
                  </span>
                </div>
              </div>
              <div className="progress-bar-detailed">
                <div 
                  className="progress-fill-detailed" 
                  style={{ width: `${strand.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Achievement Gallery */}
        <motion.div 
          variants={itemVariants}
          className="achievement-gallery"
          style={{ gridColumn: '1 / -1' }}
        >
          <h3 className="card-title">Achievement Gallery</h3>
          <div className="badges-collection">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className={achievement.earned ? 'badge-earned' : 'badge-locked'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`badge-icon-large ${!achievement.earned ? 'locked' : ''}`}>
                  {achievement.icon}
                </div>
                <span className="badge-name">{achievement.name}</span>
                {achievement.earned ? (
                  <span className="badge-date">{achievement.date}</span>
                ) : (
                  <span className="badge-requirement">{achievement.requirement}</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Progress