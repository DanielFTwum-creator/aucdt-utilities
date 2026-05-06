import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-green-600 text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold">Umoja</h1>
          <nav className="mt-2 flex gap-4 text-sm">
            <Link to="/agri">🌾 Agri</Link>
            <Link to="/health">🏥 Health</Link>
            <Link to="/ed">📚 Education</Link>
            <Link to="/soko">🛍️ Soko</Link>
          </nav>
        </header>

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agri" element={<UmojaAgri />} />
            <Route path="/health" element={<UmojaHealth />} />
            <Route path="/ed" element={<UmojaEd />} />
            <Route path="/soko" element={<UmojaSoko />} />
          </Routes>
        </main>

        <footer className="text-center p-2 text-sm bg-gray-200">Umoja App © 2025</footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Welcome to Umoja 🌍</h2>
      <p className="mt-2">Empowering African communities through agriculture, healthcare, education, and commerce.</p>
    </div>
  );
}

function UmojaAgri() {
  return (
    <div>
      <h2 className="text-xl font-semibold">UmojaAgri 🌾</h2>
      <ul className="mt-2 list-disc list-inside">
        <li>📈 Market Prices</li>
        <li>🌦️ Weather Forecasts & Pest Alerts</li>
        <li>📘 Farming Guides (Downloadable)</li>
        <li>👥 Farmer Forum</li>
      </ul>
    </div>
  );
}

function UmojaHealth() {
  return (
    <div>
      <h2 className="text-xl font-semibold">UmojaHealth 🏥</h2>
      <ul className="mt-2 list-disc list-inside">
        <li>💬 Telemedicine Chat / Voice / Video</li>
        <li>📚 Health Library (Offline Access)</li>
        <li>🗺️ Nearby Clinics & Pharmacies</li>
      </ul>
    </div>
  );
}

function UmojaEd() {
  return (
    <div>
      <h2 className="text-xl font-semibold">UmojaEd 📚</h2>
      <ul className="mt-2 list-disc list-inside">
        <li>🎓 E-Learning & Skills Development</li>
        <li>📥 Downloadable Courses</li>
        <li>📜 Certificate of Completion</li>
      </ul>
    </div>
  );
}

function UmojaSoko() {
  return (
    <div>
      <h2 className="text-xl font-semibold">UmojaSoko 🛍️</h2>
      <ul className="mt-2 list-disc list-inside">
        <li>🛒 E-Commerce Marketplace</li>
        <li>🎨 Freelance & Artisan Hub</li>
        <li>💳 Secure Mobile Payments</li>
      </ul>
    </div>
  );
}

export default App;