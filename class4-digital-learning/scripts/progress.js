// Golden Mathematics Class 4 - Progress Module
class ProgressModule {
    constructor(app) {
        this.app = app;
        this.progressData = this.initializeProgressData();
    }
    
    initializeProgressData() {
        return {
            achievements: {
                streaks: {
                    current: 5,
                    longest: 12,
                    goal: 7
                },
                mastery: {
                    numberOperations: { level: 3, maxLevel: 5 },
                    algebra: { level: 2, maxLevel: 5 },
                    geometry: { level: 2, maxLevel: 5 },
                    dataHandling: { level: 1, maxLevel: 5 }
                },
                milestones: [
                    { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', completed: true, date: '2025-11-20' },
                    { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% on an assessment', completed: true, date: '2025-11-25' },
                    { id: 'streak-week', name: 'Week Warrior', description: 'Learn for 7 days in a row', completed: false },
                    { id: 'strand-master', name: 'Strand Master', description: 'Complete all lessons in one strand', completed: false },
                    { id: 'helping-hand', name: 'Class Helper', description: 'Help 5 classmates with lessons', completed: false }
                ]
            },
            analytics: {
                timeSpent: {
                    today: 45, // minutes
                    week: 280,
                    month: 1200
                },
                accuracy: {
                    overall: 78,
                    byStrand: {
                        numberOperations: 85,
                        algebra: 72,
                        geometry: 80,
                        dataHandling: 65
                    }
                },
                improvement: {
                    weekOverWeek: 12, // percentage
                    monthOverMonth: 8
                },
                engagement: {
                    sessionsPerWeek: 8,
                    averageSessionLength: 35,
                    favoriteTimeToLearn: 'After School (3-5 PM)'
                }
            },
            weeklyGoals: {
                lessonsGoal: 8,
                lessonsCompleted: 5,
                assessmentsGoal: 2,
                assessmentsCompleted: 1,
                timeGoal: 300, // minutes
                timeSpent: 280
            },
            learningPath: {
                nextMilestone: {
                    name: 'Complete Algebra Strand',
                    progress: 67,
                    estimatedCompletion: '2025-12-12',
                    remainingLessons: 4
                },
                recommendedLessons: [
                    { id: 'alg-004', title: 'Simple Equations', strand: 'algebra', estimatedTime: 25 },
                    { id: 'alg-005', title: 'Function Tables', strand: 'algebra', estimatedTime: 20 },
                    { id: 'num-006', title: 'Multiplication Tables', strand: 'number-operations', estimatedTime: 30 }
                ]
            },
            peerComparison: {
                classRanking: 8,
                totalClassmates: 25,
                percentile: 68,
                averageClassProgress: 62
            }
        };
    }
    
    updateProgress(lessonId, strand, score, timeSpent) {
        // Update lesson progress
        this.updateLessonProgress(lessonId, strand, score);
        
        // Update strand progress
        this.updateStrandProgress(strand);
        
        // Update overall progress
        this.updateOverallProgress();
        
        // Update achievements
        this.checkAchievements();
        
        // Update analytics
        this.updateAnalytics(timeSpent);
    }
    
    updateLessonProgress(lessonId, strand, score) {
        // Update lesson completion in app's lesson data
        const strandLessons = this.app.lessonData[strand];
        const lesson = strandLessons?.find(l => l.id === lessonId);
        
        if (lesson) {
            lesson.completed = true;
            lesson.progress = 100;
            lesson.lastCompleted = new Date().toISOString();
            
            // Award points based on score
            const points = Math.round((score / 100) * 50);
            this.app.currentUser.totalPoints += points;
        }
    }
    
    updateStrandProgress(strand) {
        const strandLessons = this.app.lessonData[strand];
        if (!strandLessons) return;
        
        const completedLessons = strandLessons.filter(l => l.completed).length;
        const totalLessons = strandLessons.length;
        const completionPercentage = Math.round((completedLessons / totalLessons) * 100);
        
        // Update progress data
        if (this.app.progressData.strands[strand]) {
            this.app.progressData.strands[strand].completedLessons = completedLessons;
            this.app.progressData.strands[strand].completion = completionPercentage;
        }
    }
    
    updateOverallProgress() {
        const totalCompleted = Object.values(this.app.lessonData)
            .flat()
            .filter(l => l.completed).length;
        const totalLessons = Object.values(this.app.lessonData)
            .flat().length;
        
        this.app.currentUser.completedLessons = totalCompleted;
        this.app.progressData.overall.completedLessons = totalCompleted;
        this.app.progressData.overall.completion = Math.round((totalCompleted / totalLessons) * 100);
    }
    
    checkAchievements() {
        const achievements = this.progressData.achievements;
        
        // Check streak achievement
        if (this.progressData.achievements.streaks.current >= 7 && 
            !achievements.milestones.find(m => m.id === 'streak-week').completed) {
            achievements.milestones.find(m => m.id === 'streak-week').completed = true;
            achievements.milestones.find(m => m.id === 'streak-week').date = new Date().toISOString().split('T')[0];
        }
        
        // Check perfect score achievement
        const hasPerfectScore = Object.values(this.app.assessmentData)
            .flat()
            .some(a => a.score === 100);
            
        if (hasPerfectScore && !achievements.milestones.find(m => m.id === 'perfect-score').completed) {
            achievements.milestones.find(m => m.id === 'perfect-score').completed = true;
            achievements.milestones.find(m => m.id === 'perfect-score').date = new Date().toISOString().split('T')[0];
        }
    }
    
    updateAnalytics(timeSpent) {
        this.progressData.analytics.timeSpent.today += timeSpent;
        this.progressData.analytics.timeSpent.week += timeSpent;
        
        // Calculate engagement metrics
        const today = new Date().toDateString();
        const lastSession = localStorage.getItem('lastSession');
        
        if (lastSession !== today) {
            this.progressData.analytics.engagement.sessionsPerWeek++;
            localStorage.setItem('lastSession', today);
        }
    }
    
    generateProgressReport() {
        const report = {
            summary: {
                overallProgress: this.app.progressData.overall.completion,
                totalPoints: this.app.currentUser.totalPoints,
                lessonsCompleted: this.app.currentUser.completedLessons,
                currentStreak: this.progressData.achievements.streaks.current
            },
            strands: this.app.progressData.strands,
            achievements: this.progressData.achievements.milestones.filter(m => m.completed),
            recommendations: this.generateRecommendations(),
            goals: this.progressData.weeklyGoals,
            analytics: this.progressData.analytics
        };
        
        return report;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // Find strand with lowest progress
        const strandProgress = Object.entries(this.app.progressData.strands)
            .sort(([,a], [,b]) => a.completion - b.completion);
            
        if (strandProgress.length > 0) {
            const [lowestStrand] = strandProgress[0];
            const strandLessons = this.app.lessonData[lowestStrand] || [];
            const nextLesson = strandLessons.find(l => !l.completed);
            
            if (nextLesson) {
                recommendations.push({
                    type: 'focus-area',
                    title: 'Focus on ' + this.app.progressData.strands[lowestStrand].name,
                    description: `Improve your ${this.app.progressData.strands[lowestStrand].name} skills`,
                    action: 'Start next lesson',
                    lessonId: nextLesson.id,
                    strand: lowestStrand
                });
            }
        }
        
        // Recommend practice based on recent performance
        const recentAccuracy = this.calculateRecentAccuracy();
        if (recentAccuracy < 70) {
            recommendations.push({
                type: 'practice-needed',
                title: 'More Practice Needed',
                description: `Your recent accuracy is ${recentAccuracy}%. Let's practice more!`,
                action: 'Take a practice quiz'
            });
        }
        
        // Encourage consistent learning
        if (this.progressData.achievements.streaks.current < 3) {
            recommendations.push({
                type: 'build-streak',
                title: 'Build Your Learning Streak',
                description: 'Try to learn something new every day!',
                action: 'Continue today'
            });
        }
        
        return recommendations;
    }
    
    calculateRecentAccuracy() {
        // Mock calculation - in real app, this would analyze recent assessment scores
        return 78; // Percentage
    }
    
    createProgressVisualization() {
        return {
            overallChart: this.createOverallProgressChart(),
            strandCharts: this.createStrandProgressCharts(),
            timeSpentChart: this.createTimeSpentChart(),
            accuracyChart: this.createAccuracyChart()
        };
    }
    
    createOverallProgressChart() {
        const progress = this.app.progressData.overall.completion;
        return {
            type: 'circular',
            value: progress,
            max: 100,
            color: '#FFC02D',
            size: 150,
            label: `${progress}% Complete`
        };
    }
    
    createStrandProgressCharts() {
        return Object.entries(this.app.progressData.strands).map(([strandKey, data]) => ({
            type: 'linear',
            label: data.name,
            value: data.completion,
            max: 100,
            color: this.getStrandColor(strandKey),
            details: `${data.completedLessons}/${data.totalLessons} lessons`
        }));
    }
    
    getStrandColor(strand) {
        const colors = {
            'number-operations': '#3B82F6',
            'algebra': '#EC4899',
            'geometry': '#8B5CF6',
            'data-handling': '#10B981'
        };
        return colors[strand] || '#6B7280';
    }
    
    createTimeSpentChart() {
        return {
            type: 'bar',
            data: [
                { label: 'Monday', value: 45 },
                { label: 'Tuesday', value: 30 },
                { label: 'Wednesday', value: 50 },
                { label: 'Thursday', value: 40 },
                { label: 'Friday', value: 55 },
                { label: 'Saturday', value: 35 },
                { label: 'Sunday', value: 25 }
            ],
            yAxisLabel: 'Minutes'
        };
    }
    
    createAccuracyChart() {
        const accuracy = this.progressData.analytics.accuracy.byStrand;
        return {
            type: 'radar',
            data: {
                'Number Operations': accuracy.numberOperations,
                'Algebra & Patterns': accuracy.algebra,
                'Geometry & Measurement': accuracy.geometry,
                'Data Handling': accuracy.dataHandling
            }
        };
    }
    
    exportProgress() {
        const report = this.generateProgressReport();
        const reportDate = new Date().toISOString().split('T')[0];
        const filename = `progress-report-${reportDate}.json`;
        
        // Create downloadable file
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    shareProgress() {
        const report = this.generateProgressReport();
        const shareText = `
🎉 Amina's Math Progress Update!

📊 Overall Progress: ${report.summary.overallProgress}%
⭐ Total Points: ${report.summary.totalPoints}
📚 Lessons Completed: ${report.summary.lessonsCompleted}
🔥 Current Streak: ${report.summary.currentStreak} days

Keep up the great work! 💪

#MathLearning #GoldenMathematics #Class4
        `.trim();
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.app.showNotification('Progress copied to clipboard!', 'success');
            });
        }
        
        return shareText;
    }
    
    createDetailedProgressView() {
        const report = this.generateProgressView();
        
        // Create detailed progress modal
        const modal = document.createElement('div');
        modal.className = 'progress-modal';
        modal.innerHTML = `
            <div class="progress-modal-content">
                <div class="progress-modal-header">
                    <h2>Detailed Progress Report</h2>
                    <button class="modal-close" onclick="this.closest('.progress-modal').remove()">×</button>
                </div>
                
                <div class="progress-modal-body">
                    ${report}
                </div>
                
                <div class="progress-modal-footer">
                    <button class="btn btn-secondary" onclick="window.gmlsApp.progressModule.exportProgress()">
                        📄 Export Report
                    </button>
                    <button class="btn btn-primary" onclick="this.closest('.progress-modal').remove()">
                        Continue Learning
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles
        if (!document.querySelector('#progress-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'progress-modal-styles';
            styles.textContent = `
                .progress-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .progress-modal-content {
                    background: var(--bg-surface);
                    border-radius: var(--radius-md);
                    max-width: 90vw;
                    max-height: 90vh;
                    width: 800px;
                    overflow: auto;
                    box-shadow: var(--shadow-medium);
                }
                
                .progress-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-lg);
                    border-bottom: 2px solid var(--bg-page);
                }
                
                .progress-modal-body {
                    padding: var(--space-lg);
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .progress-modal-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-lg);
                    border-top: 2px solid var(--bg-page);
                }
                
                .progress-section {
                    margin-bottom: var(--space-xl);
                }
                
                .progress-section h3 {
                    color: var(--primary-700);
                    margin-bottom: var(--space-md);
                    border-left: 4px solid var(--primary-500);
                    padding-left: var(--space-sm);
                }
                
                .strand-progress-detail {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-md);
                    background: var(--bg-page);
                    border-radius: var(--radius-sm);
                    margin-bottom: var(--space-sm);
                }
                
                .achievements-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: var(--space-md);
                }
                
                .achievement-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-xs);
                    padding: var(--space-md);
                    background: var(--primary-100);
                    border-radius: var(--radius-sm);
                    text-align: center;
                }
                
                .achievement-item.locked {
                    background: var(--bg-page);
                    opacity: 0.7;
                }
                
                .achievement-icon {
                    font-size: 32px;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: var(--primary-500);
                    color: white;
                }
                
                .achievement-item.locked .achievement-icon {
                    background: var(--text-secondary);
                }
                
                .recommendations-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                }
                
                .recommendation-card {
                    padding: var(--space-md);
                    background: linear-gradient(135deg, var(--primary-100) 0%, var(--bg-page) 100%);
                    border-radius: var(--radius-sm);
                    border-left: 4px solid var(--primary-500);
                }
                
                .recommendation-card h4 {
                    color: var(--primary-700);
                    margin-bottom: var(--space-xs);
                }
                
                .goals-progress {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-md);
                }
                
                .goal-item {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-xs);
                }
                
                .goal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .goal-progress-bar {
                    height: 8px;
                    background: var(--bg-page);
                    border-radius: var(--radius-pill);
                    overflow: hidden;
                }
                
                .goal-progress-fill {
                    height: 100%;
                    background: var(--primary-500);
                    border-radius: var(--radius-pill);
                    transition: width var(--transition-bouncy);
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    generateProgressView() {
        const report = this.generateProgressReport();
        
        return `
            <div class="progress-sections">
                <!-- Summary Section -->
                <div class="progress-section">
                    <h3>Learning Summary</h3>
                    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md); margin-bottom: var(--space-lg);">
                        <div class="stat-card">
                            <div class="stat-number">${report.summary.overallProgress}%</div>
                            <div class="stat-label">Overall Progress</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${report.summary.totalPoints}</div>
                            <div class="stat-label">Total Points</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${report.summary.lessonsCompleted}</div>
                            <div class="stat-label">Lessons Completed</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${report.summary.currentStreak}</div>
                            <div class="stat-label">Day Streak</div>
                        </div>
                    </div>
                </div>
                
                <!-- Strand Progress -->
                <div class="progress-section">
                    <h3>Progress by Strand</h3>
                    ${Object.entries(report.strands).map(([strand, data]) => `
                        <div class="strand-progress-detail">
                            <div class="strand-info">
                                <strong>${data.name}</strong>
                                <div class="strand-details">${data.completedLessons}/${data.totalLessons} lessons • ${data.points} points</div>
                            </div>
                            <div class="strand-progress">
                                <div class="strand-progress-bar">
                                    <div class="strand-progress-fill" style="width: ${data.completion}%"></div>
                                </div>
                                <span class="strand-percentage">${data.completion}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Achievements -->
                <div class="progress-section">
                    <h3>Achievements</h3>
                    <div class="achievements-list">
                        ${report.achievements.map(achievement => `
                            <div class="achievement-item">
                                <div class="achievement-icon">🏆</div>
                                <div class="achievement-name">${achievement.name}</div>
                                <div class="achievement-date">${achievement.date}</div>
                            </div>
                        `).join('')}
                        ${this.progressData.achievements.milestones.filter(m => !m.completed).map(achievement => `
                            <div class="achievement-item locked">
                                <div class="achievement-icon">🔒</div>
                                <div class="achievement-name">${achievement.name}</div>
                                <div class="achievement-description">${achievement.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Weekly Goals -->
                <div class="progress-section">
                    <h3>Weekly Goals</h3>
                    <div class="goals-progress">
                        <div class="goal-item">
                            <div class="goal-header">
                                <span>Lessons This Week</span>
                                <span>${report.goals.lessonsCompleted}/${report.goals.lessonsGoal}</span>
                            </div>
                            <div class="goal-progress-bar">
                                <div class="goal-progress-fill" style="width: ${(report.goals.lessonsCompleted / report.goals.lessonsGoal) * 100}%"></div>
                            </div>
                        </div>
                        <div class="goal-item">
                            <div class="goal-header">
                                <span>Assessments This Week</span>
                                <span>${report.goals.assessmentsCompleted}/${report.goals.assessmentsGoal}</span>
                            </div>
                            <div class="goal-progress-bar">
                                <div class="goal-progress-fill" style="width: ${(report.goals.assessmentsCompleted / report.goals.assessmentsGoal) * 100}%"></div>
                            </div>
                        </div>
                        <div class="goal-item">
                            <div class="goal-header">
                                <span>Study Time</span>
                                <span>${report.goals.timeSpent}/${report.goals.timeGoal} min</span>
                            </div>
                            <div class="goal-progress-bar">
                                <div class="goal-progress-fill" style="width: ${(report.goals.timeSpent / report.goals.timeGoal) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Recommendations -->
                <div class="progress-section">
                    <h3>Recommendations</h3>
                    <div class="recommendations-list">
                        ${report.recommendations.map(rec => `
                            <div class="recommendation-card">
                                <h4>${rec.title}</h4>
                                <p>${rec.description}</p>
                                <button class="btn btn-sm btn-primary">${rec.action}</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Analytics -->
                <div class="progress-section">
                    <h3>Learning Analytics</h3>
                    <div class="analytics-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md);">
                        <div class="analytic-card">
                            <div class="analytic-label">Time Spent This Week</div>
                            <div class="analytic-value">${report.analytics.timeSpent.week} min</div>
                        </div>
                        <div class="analytic-card">
                            <div class="analytic-label">Average Accuracy</div>
                            <div class="analytic-value">${report.analytics.accuracy.overall}%</div>
                        </div>
                        <div class="analytic-card">
                            <div class="analytic-label">Weekly Improvement</div>
                            <div class="analytic-value">+${report.analytics.improvement.weekOverWeek}%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressModule;
}