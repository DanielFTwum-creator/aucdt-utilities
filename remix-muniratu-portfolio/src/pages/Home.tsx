import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Banner from '../components/Banner';
import VideoCarousel from '../components/VideoCarousel';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Booking from '../components/Booking';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import AIAgent from '../components/AIAgent';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function Home() {
  return (
    <div className="font-sans antialiased text-gray-900 bg-white selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300">
      <ThemeSwitcher />
      <Navbar />
      <main>
        <Hero />
        <Banner />
        <Services />
        <VideoCarousel />
        <About />
        <Portfolio />
        <Testimonials />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <AIAgent />
    </div>
  );
}
