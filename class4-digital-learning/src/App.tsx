import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import Lessons from './components/Lessons'
import Assessments from './components/Assessments'
import Progress from './components/Progress'
import LessonViewer from './components/LessonViewer'
import AssessmentQuiz from './components/AssessmentQuiz'
import TeacherDashboard from './components/TeacherDashboard'
import { UserProvider } from './context/UserContext'
import { ProgressProvider } from './context/ProgressContext'
import { LESSONS_DATA } from './data/lessonsData'
import { ASSESSMENTS_DATA } from './data/assessmentsData'
import './index.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [userRole, setUserRole] = useState('student') // 'student' or 'teacher'
  const [currentUser, setCurrentUser] = useState({
    name: 'Amina',
    level: 3,
    avatar: '👧',
    points: 1250,
    badges: 8
  })
  const [currentLesson, setCurrentLesson] = useState(null)
  const [currentAssessment, setCurrentAssessment] = useState(null)

  // Simulate loading process
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleRoleSwitch = (role) => {
    setUserRole(role)
    setCurrentSection('dashboard')
    setCurrentLesson(null)
    setCurrentAssessment(null)
  }

  const handleSectionChange = (section) => {
    setCurrentSection(section)
    setCurrentLesson(null)
    setCurrentAssessment(null)
  }

  const handleLessonSelect = (lessonId) => {
    const lesson = LESSONS_DATA.find(l => l.id === lessonId)
    setCurrentLesson(lesson)
  }

  const handleAssessmentStart = (assessmentId) => {
    setCurrentAssessment(assessmentId)
  }

  const handleLessonComplete = (lessonId) => {
    console.log('Lesson completed:', lessonId)
    setCurrentLesson(null)
  }

  const handleAssessmentComplete = (assessmentId, results) => {
    console.log('Assessment completed:', assessmentId, results)
    setCurrentAssessment(null)
  }

  const handleModalClose = () => {
    setCurrentLesson(null)
    setCurrentAssessment(null)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <UserProvider>
      <ProgressProvider>
        <Router>
          <div className="app">
            <Navigation 
              currentSection={currentSection}
              onSectionChange={handleSectionChange}
              userRole={userRole}
              onRoleSwitch={handleRoleSwitch}
              currentUser={currentUser}
            />
            
            <main className="main-content">
              <AnimatePresence mode="wait">
                {userRole === 'teacher' ? (
                  <motion.div
                    key="teacher"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TeacherDashboard 
                      currentUser={currentUser}
                      lessonsData={LESSONS_DATA}
                      assessmentsData={ASSESSMENTS_DATA}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="student"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentSection === 'dashboard' && (
                      <Dashboard 
                        currentUser={currentUser}
                        onSectionChange={handleSectionChange}
                      />
                    )}
                    {currentSection === 'lessons' && (
                      <Lessons 
                        lessonsData={LESSONS_DATA}
                        onLessonSelect={handleLessonSelect}
                      />
                    )}
                    {currentSection === 'assessments' && (
                      <Assessments 
                        assessmentsData={ASSESSMENTS_DATA}
                        onAssessmentStart={handleAssessmentStart}
                      />
                    )}
                    {currentSection === 'progress' && (
                      <Progress 
                        currentUser={currentUser}
                        lessonsData={LESSONS_DATA}
                        assessmentsData={ASSESSMENTS_DATA}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Modals */}
            <AnimatePresence>
              {currentLesson && (
                <LessonViewer
                  lesson={currentLesson}
                  onClose={handleModalClose}
                  onComplete={handleLessonComplete}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {currentAssessment && (
                <AssessmentQuiz
                  assessmentId={currentAssessment}
                  onComplete={handleAssessmentComplete}
                  onClose={handleModalClose}
                />
              )}
            </AnimatePresence>
          </div>
        </Router>
      </ProgressProvider>
    </UserProvider>
  )
}

export default App