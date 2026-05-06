import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: 'Bionic Skins™ Receives 2024 OPGA Freedom Award',
    slug: 'bionic-skins-receives-2024-opga-freedom-award',
    excerpt: 'We are proud to announce that BionicSkins™ has been recognized with the 2024 OPGA Freedom Award for our outstanding contribution to the orthotic and prosthetic field.',
    externalUrl: 'https://www.bionicskins.com/our-blog/bionic-skins-receives-2024-opga-freedom-award',
  },
  {
    title: 'Redefining Prosthetic Comfort and Care',
    slug: 'redefining-prosthetic-comfort-and-care',
    excerpt: 'At BionicSkins™, we believe that every patient deserves a prosthetic experience that truly fits their life. Explore how we are changing the standard of prosthetic delivery.',
    externalUrl: 'https://www.bionicskins.com/our-blog/redefining-prosthetic-comfort-and-care',
  },
  {
    title: 'The Human Touch in Advanced Prosthetics',
    slug: 'the-human-touch-in-advanced-prosthetics',
    excerpt: 'Technology is only as powerful as the people who apply it. Discover how our clinical team combines cutting-edge science with compassionate, patient-centered care.',
    externalUrl: 'https://www.bionicskins.com/our-blog/the-human-touch-in-advanced-prosthetics',
  },
  {
    title: "Medicare's Expanded Coverage for Microprocessor Knees",
    slug: 'medicares-expanded-coverage-for-microprocessor-knees',
    excerpt: "A recent Medicare policy update now includes coverage for microprocessor-controlled prosthetic knees (MPKs) for K2-level amputees. It details the historically high costs of these devices, the new eligibility criteria under Medicare, and additional financial resources available in Massachusetts to assist with prosthetic costs.",
    externalUrl: 'https://www.bionicskins.com/our-blog/medicares-expanded-coverage-for-microprocessor-knees',
  },
  {
    title: 'Embracing Diversity in Prosthetics: A Response to Sexism in the O&P Field',
    slug: 'embracing-diversity-in-prosthetics-a-response-to-sexism-in-the-op-field',
    excerpt: 'Explore the pressing issue of sexism in the orthotic and prosthetic (O&P) profession as we highlight the importance of diversity and inclusion. Features insights from Lauren Houle, CPO, who advocates for a more inclusive and respectful O&P community.',
    externalUrl: 'https://www.bionicskins.com/our-blog/embracing-diversity-in-prosthetics-a-response-to-sexism-in-the-op-field',
  },
];

export default function OurBlog() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">

      {/* Hero */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Our Blog</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-[#E8F3FA]">
          Welcome to the Bionic Skins™ blog series, where we explore the latest advancements in prosthetic technology and share key scientific insights with <em>The Science Of Comfort™</em>.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <a
              key={post.slug}
              href={post.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Card color band */}
              <div className="h-1.5 bg-gradient-to-r from-[#1B2A4A] to-[#2F6FA8]" />
              <div className="p-7 flex flex-col flex-grow">
                <h2 className="text-xl font-serif text-[#1B2A4A] mb-3 leading-snug group-hover:text-[#2F6FA8] transition-colors duration-200">
                  {post.title}
                </h2>
                <p className="text-sm text-[#6a879a] leading-relaxed flex-grow">{post.excerpt}</p>
                <span className="mt-6 text-sm font-semibold text-[#2F6FA8] group-hover:underline">
                  Read More →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}