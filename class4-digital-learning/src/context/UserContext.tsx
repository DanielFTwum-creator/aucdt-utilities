import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Load user data from localStorage or use default
    const savedUser = localStorage.getItem('class4-math-user')
    return savedUser ? JSON.parse(savedUser) : {
      id: 'user-001',
      name: 'Amina',
      avatar: '👧',
      level: 3,
      points: 1250,
      badges: 8,
      streak: 5,
      totalStudyTime: 5400, // in minutes
      createdAt: new Date('2025-01-01'),
      preferences: {
        language: 'en',
        theme: 'light',
        soundEnabled: true,
        animationsEnabled: true
      }
    }
  })

  const [learningProfile, setLearningProfile] = useState(() => {
    const savedProfile = localStorage.getItem('class4-math-profile')
    return savedProfile ? JSON.parse(savedProfile) : {
      strongestStrand: 'number-operations',
      improvementAreas: ['data-handling'],
      favoriteActivities: ['virtual-manipulatives', 'quizzes'],
      recommendedPace: 'moderate',
      lastActivityDate: new Date().toISOString()
    }
  })

  // Save to localStorage whenever user data changes
  useEffect(() => {
    localStorage.setItem('class4-math-user', JSON.stringify(currentUser))
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem('class4-math-profile', JSON.stringify(learningProfile))
  }, [learningProfile])

  const updateUser = (updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }))
  }

  const updateLearningProfile = (updates) => {
    setLearningProfile(prev => ({ ...prev, ...updates }))
  }

  const addPoints = (points) => {
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + points
    }))
  }

  const addBadge = () => {
    setCurrentUser(prev => ({
      ...prev,
      badges: prev.badges + 1
    }))
  }

  const updateLevel = (newLevel) => {
    setCurrentUser(prev => ({
      ...prev,
      level: newLevel
    }))
  }

  const recordStudyTime = (minutes) => {
    setCurrentUser(prev => ({
      ...prev,
      totalStudyTime: prev.totalStudyTime + minutes
    }))
  }

  const updatePreferences = (preferences) => {
    setCurrentUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }))
  }

  const value = {
    currentUser,
    learningProfile,
    updateUser,
    updateLearningProfile,
    addPoints,
    addBadge,
    updateLevel,
    recordStudyTime,
    updatePreferences
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}