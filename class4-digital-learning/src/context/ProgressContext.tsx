import React, { createContext, useContext, useState, useEffect } from 'react'
import { LESSONS_DATA } from '../data/lessonsData'

const ProgressContext = createContext()

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    // Load progress from localStorage or use default
    const savedProgress = localStorage.getItem('class4-math-progress')
    return savedProgress ? JSON.parse(savedProgress) : {
      lessonsCompleted: {
        // Lesson ID -> completion data
      },
      assessmentResults: {
        // Assessment ID -> results
      },
      strandProgress: {
        'number-operations': { completed: 9, total: 10, percentage: 90 },
        'algebra': { completed: 6, total: 8, percentage: 75 },
        'geometry': { completed: 4, total: 10, percentage: 40 },
        'data-handling': { completed: 2, total: 8, percentage: 25 }
      },
      achievements: {
        'first-lesson': { unlocked: true, date: new Date('2025-01-15') },
        'week-streak': { unlocked: true, date: new Date('2025-01-20') },
        'perfect-quiz': { unlocked: true, date: new Date('2025-01-25') },
        'all-strands': { unlocked: false, date: null },
        'speed-learner': { unlocked: false, date: null }
      },
      weeklyStats: {
        lessonsCompleted: 8,
        timeSpent: 240, // minutes
        assessmentsCompleted: 3,
        averageScore: 87
      },
      lastActiveDate: new Date().toISOString(),
      studyStreak: 5
    }
  })

  const [currentSession, setCurrentSession] = useState({
    lessonId: null,
    startTime: null,
    isActive: false,
    timeSpent: 0
  })

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('class4-math-progress', JSON.stringify(progress))
  }, [progress])

  const completeLesson = (lessonId, timeSpent, score = null) => {
    setProgress(prev => {
      const lesson = LESSONS_DATA.find(l => l.id === lessonId)
      if (!lesson) return prev

      const isFirstTime = !prev.lessonsCompleted[lessonId]
      
      return {
        ...prev,
        lessonsCompleted: {
          ...prev.lessonsCompleted,
          [lessonId]: {
            completed: true,
            completedAt: new Date().toISOString(),
            timeSpent,
            score,
            isFirstTime
          }
        },
        strandProgress: {
          ...prev.strandProgress,
          [lesson.strand]: {
            ...prev.strandProgress[lesson.strand],
            completed: Object.keys(prev.lessonsCompleted).filter(id => {
              const completedLesson = LESSONS_DATA.find(l => l.id === id)
              return completedLesson?.strand === lesson.strand
            }).length + (isFirstTime ? 1 : 0),
            percentage: Math.round(((Object.keys(prev.lessonsCompleted).filter(id => {
              const completedLesson = LESSONS_DATA.find(l => l.id === id)
              return completedLesson?.strand === lesson.strand
            }).length + (isFirstTime ? 1 : 0)) / 
            LESSONS_DATA.filter(l => l.strand === lesson.strand).length) * 100)
          }
        },
        lastActiveDate: new Date().toISOString()
      }
    })
  }

  const recordAssessment = (assessmentId, results) => {
    setProgress(prev => ({
      ...prev,
      assessmentResults: {
        ...prev.assessmentResults,
        [assessmentId]: {
          ...results,
          recordedAt: new Date().toISOString()
        }
      },
      lastActiveDate: new Date().toISOString()
    }))
  }

  const unlockAchievement = (achievementId) => {
    setProgress(prev => {
      if (prev.achievements[achievementId]?.unlocked) {
        return prev // Already unlocked
      }

      return {
        ...prev,
        achievements: {
          ...prev.achievements,
          [achievementId]: {
            unlocked: true,
            date: new Date().toISOString()
          }
        }
      }
    })
  }

  const startLesson = (lessonId) => {
    setCurrentSession({
      lessonId,
      startTime: Date.now(),
      isActive: true,
      timeSpent: 0
    })
  }

  const endLesson = () => {
    if (!currentSession.isActive || !currentSession.startTime) {
      return 0 // No active session
    }

    const timeSpent = Math.round((Date.now() - currentSession.startTime) / 1000 / 60) // minutes
    setCurrentSession({
      lessonId: null,
      startTime: null,
      isActive: false,
      timeSpent: 0
    })

    return timeSpent
  }

  const getOverallProgress = () => {
    const totalLessons = LESSONS_DATA.length
    const completedLessons = Object.keys(progress.lessonsCompleted).length
    const overallPercentage = Math.round((completedLessons / totalLessons) * 100)

    return {
      completed: completedLessons,
      total: totalLessons,
      percentage: overallPercentage
    }
  }

  const getStrandProgress = (strandId) => {
    const strandLessons = LESSONS_DATA.filter(l => l.strand === strandId)
    const completedInStrand = strandLessons.filter(l => progress.lessonsCompleted[l.id]?.completed).length

    return {
      completed: completedInStrand,
      total: strandLessons.length,
      percentage: Math.round((completedInStrand / strandLessons.length) * 100)
    }
  }

  const getRecentActivity = (days = 7) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return Object.entries(progress.lessonsCompleted)
      .filter(([_, data]) => new Date(data.completedAt) >= cutoffDate)
      .map(([lessonId, data]) => ({
        lessonId,
        ...data
      }))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
  }

  const calculateStreak = () => {
    const activities = Object.values(progress.lessonsCompleted)
      .map(data => new Date(data.completedAt))
      .sort((a, b) => b - a)

    if (activities.length === 0) return 0

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const activityDate of activities) {
      const activity = new Date(activityDate)
      activity.setHours(0, 0, 0, 0)
      
      if (activity.getTime() === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getTime() - 24 * 60 * 60 * 1000)
      } else if (activity.getTime() < currentDate.getTime()) {
        break // Gap found
      }
    }

    return streak
  }

  const value = {
    progress,
    currentSession,
    completeLesson,
    recordAssessment,
    unlockAchievement,
    startLesson,
    endLesson,
    getOverallProgress,
    getStrandProgress,
    getRecentActivity,
    calculateStreak
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}