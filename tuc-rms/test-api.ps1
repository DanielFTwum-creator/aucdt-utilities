#!/usr/bin/env pwsh

$API = "http://localhost:5000"

# Step 1: Login
Write-Host "🔐 Logging in as registrar..."
$loginBody = @{email="registrar@tuc.edu.gh"; password="Admin@123"} | ConvertTo-Json
$authResp = Invoke-WebRequest -Uri "$API/api/auth/login" `
  -Method POST -ContentType "application/json" -Body $loginBody -UseBasicParsing

$token = ($authResp.Content | ConvertFrom-Json).token
Write-Host "✅ Login successful, token received"

# Step 2: Get students
Write-Host "`n📚 Fetching students..."
$studentsResp = Invoke-WebRequest -Uri "$API/api/students" `
  -Headers @{"Authorization"="Bearer $token"} -UseBasicParsing
$students = $studentsResp.Content | ConvertFrom-Json
Write-Host "✅ Retrieved $($students.Count) students"

# Step 3: Get courses
Write-Host "`n📖 Fetching courses..."
$coursesResp = Invoke-WebRequest -Uri "$API/api/courses" `
  -Headers @{"Authorization"="Bearer $token"} -UseBasicParsing
$courses = $coursesResp.Content | ConvertFrom-Json
Write-Host "✅ Retrieved $($courses.Count) courses"

# Step 4: Get dashboard stats
Write-Host "`n📊 Fetching dashboard stats..."
$dashResp = Invoke-WebRequest -Uri "$API/api/dashboard/stats" `
  -Headers @{"Authorization"="Bearer $token"} -UseBasicParsing
$stats = $dashResp.Content | ConvertFrom-Json
Write-Host "✅ Dashboard stats loaded"
Write-Host "   - Total Students: $($stats.total_students)"
Write-Host "   - Total Courses: $($stats.total_courses)"
Write-Host "   - Pending Approvals: $($stats.pending_approvals)"

# Step 5: Create student review
Write-Host "`n💬 Creating student review..."
$studentId = $students[0].id
$reviewBody = @{
    category = "Grade Dispute"
    priority = "High"
    description = "Student disputes the grade received in DMCD111"
} | ConvertTo-Json

$reviewResp = Invoke-WebRequest -Uri "$API/api/students/$studentId/reviews" `
  -Method POST -ContentType "application/json" `
  -Headers @{"Authorization"="Bearer $token"} `
  -Body $reviewBody -UseBasicParsing

$review = $reviewResp.Content | ConvertFrom-Json
$reviewId = $review.id
Write-Host "✅ Review created (ID: $reviewId, Status: $($review.status))"

# Step 6: Update review status
Write-Host "`n🔄 Updating review status..."
$updateBody = @{
    status = "In Progress"
    resolution = "Reviewing the student's exam paper"
} | ConvertTo-Json

$updateResp = Invoke-WebRequest -Uri "$API/api/students/$studentId/reviews/$reviewId" `
  -Method PUT -ContentType "application/json" `
  -Headers @{"Authorization"="Bearer $token"} `
  -Body $updateBody -UseBasicParsing

Write-Host "✅ Review status updated to 'In Progress'"

# Step 7: Get student reviews
Write-Host "`n📋 Retrieving student reviews..."
$reviewsResp = Invoke-WebRequest -Uri "$API/api/students/$studentId/reviews" `
  -Headers @{"Authorization"="Bearer $token"} -UseBasicParsing
$reviews = $reviewsResp.Content | ConvertFrom-Json
Write-Host "✅ Student has $($reviews.Count) review(s)"

# Step 8: Test health check
Write-Host "`n🏥 Health check..."
$healthResp = Invoke-WebRequest -Uri "$API/api/health" -UseBasicParsing
$health = $healthResp.Content | ConvertFrom-Json
Write-Host "✅ Health: $($health.status)"

Write-Host "`n✨ All API tests passed!"
