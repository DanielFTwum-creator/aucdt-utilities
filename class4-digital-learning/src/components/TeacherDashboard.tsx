import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Users, BookOpen, TrendingUp } from 'lucide-react'

const TeacherDashboard = ({ currentUser, lessonsData, assessmentsData }) => {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock teacher data - in real app, this would come from API
  const classData = {
    totalStudents: 28,
    activeStudents: 24,
    averageProgress: 65,
    completionRate: 78,
    averageScore: 82
  }

  const recentActivity = [
    {
      student: 'Amina',
      activity: 'Completed lesson',
      lesson: 'Adding Big Numbers',
      time: '10 minutes ago'
    },
    {
      student: 'Kwame',
      activity: 'Started assessment',
      lesson: 'Geometry Shapes Quiz',
      time: '15 minutes ago'
    },
    {
      student: 'Fatima',
      activity: 'Earned badge',
      lesson: 'Number Master',
      time: '20 minutes ago'
    }
  ]

  const strandAnalytics = [
    {
      name: 'Number Operations',
      completion: 85,
      averageScore: 88,
      strugglingStudents: 3,
      color: '#4A90E2'
    },
    {
      name: 'Algebra & Patterns',
      completion: 67,
      averageScore: 75,
      strugglingStudents: 5,
      color: '#E91E63'
    },
    {
      name: 'Geometry & Measurement',
      completion: 45,
      averageScore: 79,
      strugglingStudents: 8,
      color: '#9C27B0'
    },
    {
      name: 'Data Handling',
      completion: 32,
      averageScore: 71,
      strugglingStudents: 12,
      color: '#4CAF50'
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
      className="teacher-dashboard"
    >
      <motion.div variants={itemVariants} className="section-header">
        <h1 className="section-title">Teacher Dashboard</h1>
        <p className="section-subtitle">Welcome back, {currentUser.name}!</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="dashboard-grid">
        <div className="stats-card card">
          <div className="card-header">
            <h3 className="card-title">Class Overview</h3>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{classData.totalStudents}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{classData.activeStudents}</span>
                <span className="stat-label">Active Today</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <BarChart size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{classData.averageProgress}%</span>
                <span className="stat-label">Avg Progress</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Performance Metrics</h3>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-icon">
                <BookOpen size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{classData.completionRate}%</span>
                <span className="stat-label">Completion Rate</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-number">{classData.averageScore}%</span>
                <span className="stat-label">Average Score</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-number">156</span>
                <span className="stat-label">Badges Earned</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderBottom: '1px solid #E8E8E8',
                  marginBottom: '0.5rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#2C3E50' }}>
                    {activity.student}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#7F8C8D' }}>
                    {activity.activity}: {activity.lesson}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#BDC3C7' }}>
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strand Analytics */}
      <motion.div variants={itemVariants} className="strands-overview" style={{ marginTop: '2rem' }}>
        <h3 className="section-subtitle">Strand Performance Analysis</h3>
        <div className="strands-grid">
          {strandAnalytics.map((strand, index) => (
            <motion.div
              key={strand.name}
              className="strand-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{ borderTopColor: strand.color }}
            >
              <div className="strand-header">
                <div 
                  className="strand-icon"
                  style={{ background: `${strand.color}20`, color: strand.color }}
                >
                  📊
                </div>
                <h4 className="strand-title">{strand.name}</h4>
              </div>
              <div className="strand-progress">
                <div className="progress-indicator">
                  <span className="progress-text">{strand.completion}% completion</span>
                  <div className="progress-bar" style={{ margin: '0.5rem 0' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${strand.completion}%`,
                        background: strand.color
                      }}
                    ></div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#7F8C8D',
                  marginTop: '0.5rem'
                }}>
                  <div>Avg Score: <strong style={{ color: strand.color }}>{strand.averageScore}%</strong></div>
                  <div>Struggling: <strong>{strand.strugglingStudents} students</strong></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <motion.button 
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📋 Create Assignment
          </motion.button>
          <motion.button 
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📊 Generate Report
          </motion.button>
          <motion.button 
            className="btn btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👥 Student Progress
          </motion.button>
          <motion.button 
            className="btn btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️ Settings
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TeacherDashboard