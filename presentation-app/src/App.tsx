import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, FileText, Users, Target, Building, Lightbulb, TrendingUp, Award, Calendar, CheckCircle, Phone } from 'lucide-react';

const PresentationApp = () => {
  const [activeTab, setActiveTab] = useState('emails');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Designing Africa's Future",
      subtitle: "A Strategic Partnership Between Mastercard Foundation and Techbridge University College",
      content: (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-lg">
            <h1 className="text-4xl font-bold mb-4">Designing Africa's Future</h1>
            <p className="text-xl">Transforming West Africa's Creative Economy Through Design-Led Innovation</p>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <Building className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg">Techbridge University College</h3>
              <p>Ghana's Premier Design & Technology Institution</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <Target className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-bold text-lg">Mastercard Foundation</h3>
              <p>Empowering African Youth & Innovation</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Challenge We're Solving Together",
      subtitle: "West Africa's Innovation Gap",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <TrendingUp className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-2xl font-bold text-red-600">60%</h3>
              <p>West African youth unemployed or underemployed</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <Target className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-blue-600">$23B</h3>
              <p>Digital economy opportunity by 2030</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <Users className="w-10 h-10 text-yellow-600 mb-4" />
              <h3 className="text-2xl font-bold text-yellow-600">2%</h3>
              <p>Of global design professionals are African</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <CheckCircle className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-green-600">58%</h3>
              <p>Financial inclusion rate (vs 76% global)</p>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">The Missing Link</h3>
            <p className="text-lg">Human-centered design capabilities for local solutions</p>
          </div>
        </div>
      )
    },
    {
      title: "Why This Matters to Mastercard Foundation",
      subtitle: "Aligned Impact, Amplified Reach",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <strong>Financial Inclusion</strong> → Training designers who create accessible financial products
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <strong>Youth Employment</strong> → Direct job creation + entrepreneurship pipeline
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-purple-50 p-4 rounded-lg">
              <Award className="w-8 h-8 text-purple-600" />
              <div>
                <strong>African Leadership</strong> → Building local capacity for indigenous solutions
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-orange-50 p-4 rounded-lg">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <strong>Systems Change</strong> → Transforming how technology serves African communities
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
            <p className="text-lg italic">"The future of African development depends on African-led innovation"</p>
          </div>
        </div>
      )
    }
  ];

  const emailTemplates = [
    {
      title: "Cold Outreach",
      subject: "Partnership Opportunity: Transforming West Africa's Creative Economy Through Design-Led Innovation",
      content: `Dear [Name/Team],

Techbridge University College (TUC) is pioneering a unique approach to addressing youth unemployment in Ghana by combining design thinking with technology education—creating pathways for young people to enter the growing creative and digital economy.

**Why This Aligns with Mastercard Foundation's Mission:**
• We're developing the next generation of African innovators who will design inclusive financial and digital solutions
• 73% of our graduates secure employment or start businesses within 6 months
• Our programmes specifically target underserved youth, with 45% of students from low-income households

**Our Proposal:** A strategic partnership to establish the "Mastercard Foundation Innovation Hub" at AUC—a regional center for design-led solutions addressing financial inclusion challenges across West Africa.

**Immediate Impact Opportunity:**
• Train 500+ young designers and technologists over 3 years
• Incubate 50+ startups focused on inclusive digital solutions
• Create research partnerships addressing barriers to financial inclusion through human-centered design

I'd welcome a brief 15-minute call to explore how AUC's unique positioning as Ghana's premier design-technology institution can amplify Mastercard Foundation's impact in West Africa.

Attached you'll find our institutional overview and initial partnership framework.

Best regards,
[Your Name]
[Title]
Techbridge University College
[Phone] | [Email] | aucdt.edu.gh`
    },
    {
      title: "Warm Introduction Follow-up",
      subject: "Following Up on [Referrer's Name] Introduction - AUC Partnership Opportunity",
      content: `Dear [Name],

Thank you for taking [Referrer's name]'s introduction. As mentioned, Techbridge University College is at an exciting inflection point where we can significantly amplify Mastercard Foundation's impact in West Africa's innovation ecosystem.

**What Makes This Partnership Strategic:**

**For Mastercard Foundation:**
• Direct access to train and mentor the next generation of African problem-solvers
• A regional platform for testing and scaling design-led approaches to financial inclusion
• Measurable impact through our established track record of graduate outcomes

**For West Africa's Development:**
• Filling the critical gap in human-centered design capabilities
• Creating local capacity for indigenous solutions to financial and digital inclusion challenges
• Building a sustainable pipeline of innovators who understand African contexts

**Proposed Next Steps:**
1. 30-minute exploratory call to discuss alignment and opportunities
2. Site visit to AUC campus (virtual or in-person)
3. Joint development of a pilot program proposal

Our students are already working on projects like mobile banking UX for rural communities and blockchain solutions for agricultural financing. With Mastercard Foundation's partnership, we can scale these innovations regionally.

Would you be available for a brief call next week? I'm flexible with timing to accommodate your schedule.

Warm regards,
[Your Name]`
    },
    {
      title: "Event/Conference Follow-up",
      subject: "Great Meeting You at [Event Name] - AUC Partnership Discussion",
      content: `Dear [Name],

It was a pleasure meeting you at [Event] and learning more about Mastercard Foundation's innovative approaches to youth empowerment in Africa.

Our conversation about the need for more African-led design solutions particularly resonated with AUC's mission. As I mentioned, we're uniquely positioned as Ghana's only university focused specifically on design and technology integration.

**Since Our Conversation, I've Been Thinking About:**
• Your point about the importance of local context in financial product design
• How AUC's students could contribute to Mastercard Foundation's research initiatives
• The potential for a West African hub that combines academic rigor with practical innovation

**What I'd Love to Explore Further:**
A partnership model where Mastercard Foundation and AUC co-create programmes that:
• Develop local talent with global standards
• Generate research insights on African user experiences
• Create scalable models for other African universities

I've attached a brief overview of our current programmes and some student project examples that might interest you.

Could we schedule 20 minutes in the coming weeks to continue our conversation?

Best,
[Your Name]`
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('emails')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'emails'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Templates</span>
            </button>
            <button
              onClick={() => setActiveTab('presentation')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'presentation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pitch Presentation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'emails' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Templates</h1>
              <p className="text-gray-600">Ready-to-use outreach templates for Mastercard Foundation</p>
            </div>
            
            <div className="grid gap-8">
              {emailTemplates.map((template, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.title}</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{template.content}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'presentation' && (
          <div className="space-y-6">
            {/* Presentation Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{slides[currentSlide].title}</h1>
                  <p className="text-gray-600">{slides[currentSlide].subtitle}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Slide {currentSlide + 1} of {slides.length}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      disabled={currentSlide === slides.length - 1}
                      className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Content */}
            <div className="bg-white rounded-lg shadow-sm border p-8 min-h-96">
              {slides[currentSlide].content}
            </div>

            {/* Slide Navigation */}
            <div className="flex justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationApp;