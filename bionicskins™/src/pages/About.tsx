import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import ContentSection from '../components/ContentSection';
import ValuesAccordion from '../components/ValuesAccordion';

export default function About() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">

      {/* Page Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-[#1B2A4A] text-white py-20 px-6 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-serif mb-4 tracking-tight">About Us</h1>
        <p className="text-lg font-sans font-light text-white/70 max-w-2xl mx-auto">
          Compassionate Patient Care — Powered by Science.
        </p>
      </motion.section>

      {/* Welcome section — two columns: text left, video right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center"
      >
        <div>
          <h2 className="text-5xl font-serif text-navy mb-8 tracking-tight">Welcome To Bionic Skins™</h2>
          <p className="text-xl text-gray-600 font-sans leading-relaxed font-light mb-10">
            Our experienced team of professionals is dedicated to providing compassionate and personalized care to individuals seeking advanced prosthetic solutions. To schedule an appointment, please email or call our office. Patient visits are by appointment only, and we are open Monday through Friday from 9 AM to 5 PM.
          </p>
          <Link
            to="/become-a-patient"
            className="inline-block bg-[#16426C] text-white px-8 py-3.5 font-sans font-medium rounded-[4px] hover:bg-[#2A5171] transition-all duration-300 tracking-wide"
          >
            Get Scheduled
          </Link>
        </div>

        {/* Embedded video */}
        <div className="rounded-[24px] overflow-hidden shadow-2xl aspect-video">
          <iframe
            src="https://www.youtube.com/embed/QrQUGBd3YGs?rel=0&modestbranding=1"
            title="BionicSkins™ — Compassionate Patient Care"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </motion.section>

      {/* Who We Are — image left, text right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-white px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif text-[#1B2A4A] text-center mb-10">Who We Are</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <img
              src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/fbcfdfbd-1d76-47b0-8028-b76d0dbea356/hughherr_1920x1080.jpg?format=2500w"
              alt="Professor Hugh Herr"
              className="rounded-[24px] shadow-2xl w-full h-[420px] object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-3xl font-serif text-[#2A5171] mb-6">Our Legacy</h3>
              <p className="text-lg text-[#6a879a] leading-relaxed">
                Founded by MIT Professor Hugh Herr, BionicSkins™ is an advanced prosthetics provider grounded in 15 years of MIT research. BionicSkins™ has made patient comfort a science. Our unique clinic combines state-of-the-art technology with deep clinical knowledge to make patient comfort our mission.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <ContentSection
        title="Our Method"
        description="Our innovative technology is designed and manufactured from Cone-Beam Computed Tomography imaging, physics-based computation, artificial intelligence, and 3D printing. These scientific methods are used to guide our clinical care team in their mission to provide precise, optimally-fit prostheses."
        imageSrc="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/a2f5acae-97fb-4c82-a62a-35f3ffc5991e/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png"
      />

      {/* Our Team — image left, text right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-[#EEF1F3] px-6"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <img
            src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/76ec0ecd-d141-4f57-9967-7c8f6ad6d718/Bionic+Skin+Prosthetic+Studio.png?format=2500w"
            alt="Our Team"
            className="rounded-[24px] shadow-2xl w-full h-[420px] object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-5xl font-serif text-navy mb-8 tracking-tight">Our Team</h2>
            <p className="text-xl text-gray-600 font-sans leading-relaxed font-light">
              Our experienced team of compassionate professionals believes that everyone deserves the ability to pursue a full and active life. Dedicated to providing our patients with the highest quality care and support, BionicSkins™ is leading the way in advanced and personalized prosthetic delivery.
            </p>
          </div>
        </div>
      </motion.section>

      <ValuesAccordion />
    </div>
  );
}
