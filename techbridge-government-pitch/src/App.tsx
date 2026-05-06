import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import WhyTechbridgePage from './pages/WhyTechbridgePage'
import ProgrammePage from './pages/ProgrammePage'
import PlatformPage from './pages/PlatformPage'
import TrackRecordPage from './pages/TrackRecordPage'
import ImpactPage from './pages/ImpactPage'
import ImplementationPage from './pages/ImplementationPage'
import ContactPage from './pages/ContactPage'
import ExecutiveSummaryPage from './pages/ExecutiveSummaryPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
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
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
