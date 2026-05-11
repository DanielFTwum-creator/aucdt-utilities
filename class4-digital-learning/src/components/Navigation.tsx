import React from 'react'
import { motion } from 'framer-motion'

const Navigation = ({ 
  currentSection, 
  onSectionChange, 
  userRole, 
  onRoleSwitch, 
  currentUser 
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'lessons', label: 'Lessons', icon: '📚' },
    { id: 'assessments', label: 'Assessments', icon: '✅' },
    { id: 'progress', label: 'Progress', icon: '📊' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">🔢</div>
          <span className="brand-text">Golden Mathematics</span>
        </div>
        
        <div className="nav-menu">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </motion.button>
          ))}
        </div>
        
        <div className="nav-user">
          <div className="user-avatar">
            <span className="avatar-icon">{currentUser.avatar}</span>
          </div>
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-level">Level {currentUser.level}</span>
          </div>
        </div>
        
        <div className="role-switch">
          <select 
            value={userRole} 
            onChange={(e) => onRoleSwitch(e.target.value)}
            className="form-select"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
      </div>
    </nav>
  )
}

export default Navigation