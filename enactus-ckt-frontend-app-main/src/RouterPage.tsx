import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Home from './Home'
import About from './components/About'
import Projects from './components/Projects'
import ProjectDetails from './components/ProjectDetails'
import Blog from './components/Blog'
import BlogPost from './components/news/BlogPost'
import AlumniPage from './components/alumni/AlumniPage'
import CompetitionDetails from './components/competition/CompetitionDetails'
import Pitch2026 from './components/competition/Pitch2026'
import Contact from './components/Contact'
import Header from './components/Header'
import Footer from './components/Footer'

const Placeholder = ({ title }) => (
    <div style={{ padding: '120px 0' }}>
        <div className="container">
            <h1 className="sec-title">{title}</h1>
            <p>Content coming soon.</p>
        </div>
    </div>
)

export default function RouterPage() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetails />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/alumni" element={<AlumniPage />} />
                <Route path="/competition" element={<CompetitionDetails />} />
                <Route path="/competition/2026" element={<Pitch2026 />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/join" element={<Placeholder title="Join Enactus CKT-UTAS" />} />
                <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    )
}

const Layout = () => (
    <div>
        <Header />
        <Outlet />
        <Footer />
    </div>
)


