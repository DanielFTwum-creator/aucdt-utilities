import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-icon">🔢</div>
          <h1 className="loading-title">Golden Mathematics</h1>
          <p className="loading-subtitle">Class 4 Digital Learning</p>
        </div>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen