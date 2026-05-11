import { useState } from 'react';

type ResourceTab = 'foundations' | 'advocacy' | 'adaptive' | 'health';

const resources: Record<ResourceTab, { name: string; description: string; url: string }[]> = {
  foundations: [
    {
      name: 'A Leg Forever Charitable Foundation',
      description: 'A 501(c)(3) nonprofit established by Liz Norden, mother of Boston Marathon Survivors who each lost a leg. Assists amputees (Massachusetts residents only) who lost limbs under tragic circumstances.',
      url: 'https://www.alegforever.com/',
    },
    {
      name: 'Heather Abbott Foundation',
      description: 'Helps provide customized prostheses to those who have suffered limb loss through traumatic circumstances, with many ways to get involved including fundraisers and corporate sponsorship.',
      url: 'https://heatherabbottfoundation.org/',
    },
    {
      name: 'Less Leg More Heart',
      description: 'We spread hope, decrease suffering, and enhance viability within the amputee community by providing customized education, support, services, and supplies.',
      url: 'https://www.lesslegmoreheart.com/',
    },
    {
      name: 'The Born To Run Foundation®',
      description: 'A tax-exempt 501(c)(3) dedicated to providing child amputees with a specific prosthetic that will allow them to run again. Also assists adults navigating this new phase of life.',
      url: 'https://theborntorunfoundation.org/',
    },
    {
      name: "Who Says I Can't",
      description: 'Works with adults and kids with physical disabilities to become involved with active sports, partnering with prosthetics and adaptive equipment providers.',
      url: 'https://whosaysicant.org/',
    },
    {
      name: 'ABLE Now',
      description: "ABLE accounts are the result of a decade-long, cross-disability advocacy effort to enable families to save in a child's name without fear of losing essential services and support.",
      url: 'https://www.ablenow.com/',
    },
  ],
  advocacy: [
    {
      name: 'American Association of People With Disabilities (AAPD)',
      description: 'A national disability-led and cross-disability rights organization advocating for full civil rights for over 60 million Americans with disabilities.',
      url: 'https://www.aapd.com/',
    },
    {
      name: 'American Orthotic and Prosthetic Association (AOPA)',
      description: 'The largest non-profit in O&P with 2,000+ patient care facilities, AOPA fosters relationships with decision-makers, provides education, and advances equality in the profession.',
      url: 'https://www.aopanet.org/',
    },
    {
      name: 'Association of Programs for Rural Independent Living (APRIL)',
      description: 'A national grassroots, consumer-controlled membership organization for centers serving people with disabilities living in rural America.',
      url: 'https://www.april-rural.org/index.php/en/',
    },
    {
      name: 'National Council On Independent Living',
      description: 'The longest-running national cross-disability grassroots organization run by and for people with disabilities, founded in 1982.',
      url: 'https://ncil.org/',
    },
    {
      name: 'National Disability Rights Network',
      description: 'Works in Washington, DC on behalf of Protection and Advocacy Systems (P&As) and Client Assistance Programs (CAPs), the nation\'s largest providers of legal advocacy services for people with disabilities.',
      url: 'https://www.ndrn.org/',
    },
    {
      name: 'Association of Assistive Technology Act Programs',
      description: 'ATAP facilitates coordination of state and territory AT Act Programs nationally and provides technical assistance and support to its members.',
      url: 'https://ataporg.org/',
    },
  ],
  adaptive: [
    {
      name: 'Billy Footwear',
      description: 'Shoes that embody universal design, appealing to and working for everyone — created by two Seattle locals focused on inclusive footwear.',
      url: 'https://billyfootwear.com/pages/about-us',
    },
    {
      name: 'Buck & Buck',
      description: 'Adapts most clothing items for those with amputated limbs, including cutting garments to fit or inserting snap/zipper closures along seams for prosthetic access.',
      url: 'https://www.buckandbuck.com/shop-by-need/amputee-clothing.html',
    },
    {
      name: 'Patti & Ricky',
      description: 'The Adaptive Fashion Marketplace for adults and kids with and without disabilities, chronic conditions, patients, seniors, and caregivers with an inclusive shopping experience.',
      url: 'https://www.pattiandricky.com/',
    },
    {
      name: 'No Limits',
      description: 'A team of disabled designers bringing to life products they wish existed earlier — fashion that lets users live comfortably, confidently, and independently.',
      url: 'https://no-limbits.com/',
    },
    {
      name: 'Reboundwear',
      description: "Provides fashionable and functional clothing for the everyabled. Guided by core values of integrity, authenticity, compassion, and passion.",
      url: 'https://www.reboundwear.com/',
    },
    {
      name: 'Silverts',
      description: 'An amputee clothing line designed to simplify everyday tasks. Provides comfort, style, and independence to those who have undergone surgery or live with an artificial limb.',
      url: 'https://www.silverts.com/shop-by-need/amputee-clothing',
    },
    {
      name: 'Zappos Adaptive',
      description: 'Connects people with products that make life easier. Categories include: Easy-On/Off Shoes, AFO-Friendly, Post-Surgical Wear, Wheelchair-Friendly and many more.',
      url: 'https://www.zappos.com/c/adaptive',
    },
  ],
  health: [
    {
      name: 'Choose PT',
      description: 'Physical therapists are movement experts who help you avoid surgery and prescription drugs, maximize your mobility, manage pain and chronic conditions.',
      url: 'https://www.choosept.com/',
    },
    {
      name: 'Crisis Text Line',
      description: 'Free, 24/7 support for those in crisis. Text HOME to 741741 to connect with a trained Crisis Counselor.',
      url: 'https://www.crisistextline.org/',
    },
  ],
};

const tabs: { key: ResourceTab; label: string }[] = [
  { key: 'foundations', label: 'Foundations & Financial Aid' },
  { key: 'advocacy', label: 'Advocacy Organizations' },
  { key: 'adaptive', label: 'Adaptive Clothing' },
  { key: 'health', label: 'Health & Wellness' },
];

export default function AmputeeResources() {
  const [activeTab, setActiveTab] = useState<ResourceTab>('foundations');

  return (
    <div className="flex-grow bg-[#F9F9F9]">

      {/* Hero */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Amputee Resource Center</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-[#E8F3FA]">
          We work to provide different resources for amputees and prosthetic users to help them move better and be more independent.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="bg-[#EEF1F3] border-b border-gray-200 py-6 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-[#1B2A4A] font-bold mb-1">Disclaimer Regarding Patient Resources</p>
          <p className="text-sm text-[#6a879a] leading-relaxed">
            BionicSkins™ strives to support individuals with amputation by offering information about ways to enhance their quality of life. The patient resources listed on our website are intended to provide educational information and a starting point for your research. These resources may include products, services, or organizations that are not directly affiliated with BionicSkins™. Inclusion on this list is not an endorsement by BionicSkins™. Evaluate each resource to determine its suitability for your needs. Consult healthcare professionals for informed decisions.
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        {/* Tab Nav */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-[#1B2A4A] text-white shadow-sm'
                  : 'bg-white text-[#6a879a] border border-gray-200 hover:border-[#1B2A4A] hover:text-[#1B2A4A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources[activeTab].map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#2F6FA8] transition-all duration-200 flex flex-col"
            >
              <h3 className="text-base font-bold text-[#1B2A4A] mb-3 group-hover:text-[#2F6FA8] transition-colors duration-200 leading-snug">
                {resource.name}
              </h3>
              <p className="text-sm text-[#6a879a] leading-relaxed flex-grow">{resource.description}</p>
              <span className="mt-5 text-xs font-semibold text-[#2F6FA8] group-hover:underline">
                Visit Website →
              </span>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}