import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

const WhyTechbridgePage = lazy(() => import('./pages/WhyTechbridgePage'))
const ProgrammePage = lazy(() => import('./pages/ProgrammePage'))
const PlatformPage = lazy(() => import('./pages/PlatformPage'))
const TrackRecordPage = lazy(() => import('./pages/TrackRecordPage'))
const ImpactPage = lazy(() => import('./pages/ImpactPage'))
const ImplementationPage = lazy(() => import('./pages/ImplementationPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const ExecutiveSummaryPage = lazy(() => import('./pages/ExecutiveSummaryPage'))

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-techbridge-blue"></div>
    </div>
  )
}

export default function App() {
  // Only use basename on production server, not in local dev
  const basename = window.location.pathname.startsWith('/smart') ? '/smart' : '/'

  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/why-techbridge" element={<WhyTechbridgePage />} />
              <Route path="/programme" element={<ProgrammePage />} />
              <Route path="/platform" element={<PlatformPage />} />
              <Route path="/track-record" element={<TrackRecordPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/implementation" element={<ImplementationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/executive-summary" element={<ExecutiveSummaryPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
