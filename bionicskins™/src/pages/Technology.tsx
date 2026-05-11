export default function Technology() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Hero Banner Area */}
      <section className="bg-navy py-24 px-6 text-center text-white relative">
        <div className="absolute inset-0 bg-[#16426C] opacity-80" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 tracking-wide">
            The Science Of Comfort™
          </h1>
          <p className="text-xl md:text-2xl font-light text-[#E8F3FA] leading-relaxed">
            BionicSkins™ provides prosthetic products and services using digital design and manufacturing to expand accessibility, improve patient outcomes, and maintain medical costs.
          </p>
        </div>
      </section>

      {/* Where's The Science Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-serif text-[#1B2A4A] border-l-4 border-[#2F6FA8] pl-6">
                Where’s The Science?
              </h2>
            </div>
            <div className="md:w-2/3">
              <p className="text-lg text-[#6a879a] leading-[1.8] mb-6">
                Over the past 20 years, remarkable progress has been made in prosthetic technologies, including advances ranging from lighter, stronger materials to powered mechatronics and myoelectric interfaces. However, opportunities remain to further enhance the fit and comfort of prosthetic interfaces with the body.
              </p>
              <p className="text-lg text-[#6a879a] leading-[1.8]">
                Today, many prosthetic sockets are still crafted using artisanal methods — highly skilled and experience-driven processes that can result in excellent outcomes but are often challenging to consistently replicate over time. Our approach builds upon these proven methods by integrating modern computational tools to help optimize fit, comfort, and reproducibility, aiming to make prosthetic care even more accessible, reliable, and tailored to individual needs. By advancing these technologies, we aim to equip prosthetists and providers with enhanced tools and data to support the best possible patient outcomes.
              </p>
              <div className="mt-8 pt-8 border-t border-gray-100 italic text-[#2A5171]">
                Traditional Prosthetic Methods Demonstrated Below
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interstitial Banner */}
      <section className="w-full bg-[#E8F3FA] py-16 px-6 text-center border-y border-[#2F6FA8]/20">
         <h3 className="text-2xl md:text-3xl font-serif text-[#1B2A4A] max-w-4xl mx-auto leading-relaxed">
           "The digital memory created will provide for a faster and more efficacious delivery model."
         </h3>
      </section>

      {/* Noninvasive Interface Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row-reverse gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-serif text-[#1B2A4A] border-r-0 md:border-r-4 border-l-4 md:border-l-0 border-[#2F6FA8] pl-6 md:pl-0 md:pr-6 text-left md:text-right">
                Noninvasive Mechanical Interface
              </h2>
            </div>
            <div className="md:w-2/3">
              <p className="text-lg text-[#6a879a] leading-[1.8] mb-6">
                BionicSkins™ builds upon long-standing prosthetic design techniques by augmenting the fitting process with data-driven, physics-based algorithms to help optimize comfort and fit. Each interface design is initiated using the specific internal and external anatomy of the user via Computed Tomography (CT) imaging. 
              </p>
              <p className="text-lg text-[#6a879a] leading-[1.8] mb-6">
                Precise geometries of internal and external structures are digitally reconstructed from the medical images to form a user-specific, digital 3D biomechanical model. The initial interface design is combined with the biomechanical model and iteratively altered using a physics-based approach to produce skin-interface pressures conducive to a comfortable and healthy fit.
              </p>
              <p className="text-lg text-[#6a879a] leading-[1.8]">
                The optimized design can subsequently be manufactured using 3D printing techniques and tested in as little as 24 hours from the time of the patient’s scan. This process is entirely computational, and therefore a digital memory of each design can be created and stored for future use.
              </p>
            </div>
        </div>
      </section>

    </div>
  );
}