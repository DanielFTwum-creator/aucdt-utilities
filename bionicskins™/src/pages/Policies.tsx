import { ShieldCheck, Scale, FileText, HelpCircle } from 'lucide-react';

export default function Policies() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Header */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Policies & Assurances</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-[#E8F3FA]">
          At BionicSkins™, we understand the importance of data privacy, clinical security, and research transparency.
        </p>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 max-w-4xl mx-auto space-y-12">
        
        <div className="bg-[#E8F3FA] border border-[#D0E2EF] p-6 rounded-lg text-sm text-[#4A6478]">
          <span className="font-bold">Disclaimer:</span> The policies outlined below are accurate to the best of our knowledge as of the date of publication. However, policies may change over time. For the most up-to-date information, please contact <a href="mailto:info@bionicskins.com" className="text-[#2F6FA8] hover:underline">info@bionicskins.com</a>. Thank you for choosing BionicSkins™.
        </div>

        {/* Legal & Privacy Block */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100">
          
          <div className="mb-10">
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-4 flex items-center gap-3">
               <Scale className="text-[#2F6FA8]" size={28} /> Statement of Legality
            </h3>
            <p className="text-[#6a879a] leading-relaxed mb-4">
              BionicSkins™ values the privacy of its users and takes all necessary steps to protect their personal data. We will not sell, rent, or share any private information collected through our website with third parties for advertising or marketing purposes.
            </p>
            <p className="text-[#6a879a] leading-relaxed">
              Our website operates in compliance with all applicable data protection and privacy laws, ensuring that the personal data of our users remains safe and secure. We are committed to maintaining the trust and confidence of our visitors and customers, and we believe that transparency and respect for privacy are fundamental to achieving this.
            </p>
          </div>

          <hr className="border-gray-100 mb-10" />

          <div className="mb-10">
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-4 flex items-center gap-3">
               <ShieldCheck className="text-[#2F6FA8]" size={28} /> Privacy Policy
            </h3>
            <h4 className="text-lg font-bold text-[#4A6478] mb-6">What personal data do we collect and why do we collect it:</h4>
            
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-[#1B2A4A] mb-2">Contact Forms</h5>
                <p className="text-[#6a879a] leading-relaxed">When you submit information through a contact form on our website, such as your name, email address, and message, we may retain this information to respond to your inquiry, provide support, or improve our services.</p>
              </div>
              <div>
                <h5 className="font-bold text-[#1B2A4A] mb-2">Cookies</h5>
                <p className="text-[#6a879a] leading-relaxed">A cookie is a small data file that a website stores in your web browser.</p>
              </div>
              <div>
                <h5 className="font-bold text-[#1B2A4A] mb-2">Embedded Content</h5>
                <p className="text-[#6a879a] leading-relaxed">
                  The articles presented on this website may contain embedded content, such as images, videos, and articles. It's important to note that the embedded content from external websites operates in the same manner as if the visitor were directly accessing the original website. It's important to note that these websites may engage in data collection practices, including the utilization of cookies, integration of third-party tracking mechanisms, and monitoring of your interactions with embedded content.
                </p>
              </div>
              <div>
                <h5 className="font-bold text-[#1B2A4A] mb-2">Analytics</h5>
                <p className="text-[#6a879a] leading-relaxed">Our website employs analytics tools to enhance your browsing experience and gather valuable insights. By utilizing these tools, we may retain certain information, such as your IP address, browser type, and pages visited, to analyze website traffic and improve its performance. Rest assured that your privacy is respected, and the collected data is used solely for analytical purposes.</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-10" />

          <div>
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-4 flex items-center gap-3">
               <FileText className="text-[#2F6FA8]" size={28} /> Financial Conflict Of Interest Policy
            </h3>
            <div className="space-y-4 text-[#6a879a] leading-relaxed">
              <p>The protection of human subjects in research is of utmost importance to Bionic Skins and all researchers who actively partner with Bionic Skins under the terms and conditions of sponsored investigations. While Bionic Skins and peer research institutions have instituted multiple, complementary policies to ensure the safety of study subjects and to preserve the integrity of the research itself, in an increasingly complex research environment, a new policy is required to additionally assure that such research is never subordinated to, or compromised by, financial interests or the pursuit of personal gain.</p>
              <p>In accordance with the rule issued by the U.S. Department of Health and Human Services (PHS) that amends regulations on the responsibility of applicants for Promoting Objectivity in Research (42 C.F.R. Part 50, Subpart F) for which PHS funding is sought and Responsible Prospective Contractors (45 C.F.R. Part 94), Bionic Skins herein revises the institutional Financial Conflict of Interest (FCOI) policy to protect against real or apparent biases in study design, data collection and analysis, adverse event reporting, or the presentation and publication of research findings.</p>
              <p>Bionic Skins is required to create and maintain a written and enforced policy stating the procedures for implementing the PHS FCOI regulation and to inform each Investigator of the regulation, of Bionic Skins’ FCOI policy, and of the Investigator’s disclosure responsibilities under the regulation and the policy. Bionic Skins is also responsible for managing, reducing, or eliminating identified conflicts, and reporting identified conflicts to the Public Health Service (PHS) Awarding Component.</p>
              <p>Investigators are responsible for complying with Bionic Skins’ written FCOI policy and for disclosing their Significant Financial Interests (SFIs) to Bionic Skins.</p>
            </div>
          </div>

        </div>

        {/* FAQs */}
        <div>
          <h3 className="text-3xl font-serif text-[#1B2A4A] mb-8 text-center flex items-center justify-center gap-3">
             <HelpCircle className="text-[#2F6FA8]" size={32} /> Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#1B2A4A] mb-2">What is BionicSkins™?</h4>
               <p className="text-[#6a879a] text-sm leading-relaxed">BionicSkins™ is a Prosthetics Clinic dedicated to advancing the field of prosthetics through innovative technology and personalized care.</p>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#1B2A4A] mb-2">What Types Of Prostheses Does BionicSkins™ Specialize In?</h4>
               <p className="text-[#6a879a] text-sm leading-relaxed">BionicSkins™ specializes in advanced prostheses for individuals with all levels of upper and lower limb amputations. Our team has extensive experience in creating custom solutions to meet the unique needs of each patient.</p>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#1B2A4A] mb-2">Does BionicSkins™ Accept Insurance?</h4>
               <p className="text-[#6a879a] text-sm leading-relaxed">BionicSkins™ accepts most major insurance plans. Please contact our office to verify your insurance coverage.</p>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h4 className="font-bold text-[#1B2A4A] mb-2">What Is The Process For Getting A Prosthetic Device?</h4>
               <p className="text-[#6a879a] text-sm leading-relaxed">The process typically involves: Initial consultation, assessment of needs, custom design and fabrication, fitting and adjustment, and ongoing care and support.</p>
             </div>
          </div>
        </div>

      </section>

    </div>
  );
}