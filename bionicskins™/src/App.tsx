/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReferAPatient from './pages/ReferAPatient';
import AdminDashboard from './pages/AdminDashboard';
import Technology from './pages/Technology';
import OurBlog from './pages/OurBlog';
import BecomeAPatient from './pages/BecomeAPatient';
import AmputeeResources from './pages/AmputeeResources';
import ClinicalTrials from './pages/ClinicalTrials';
import ContactUs from './pages/ContactUs';
import Policies from './pages/Policies';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/our-blog" element={<OurBlog />} />
          <Route path="/become-a-patient" element={<BecomeAPatient />} />
          <Route path="/amputee-resources" element={<AmputeeResources />} />
          <Route path="/refer-a-patient" element={<ReferAPatient />} />
          <Route path="/clinical-trials" element={<ClinicalTrials />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
