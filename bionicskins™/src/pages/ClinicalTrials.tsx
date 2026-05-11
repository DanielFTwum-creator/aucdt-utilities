import { CheckCircle2, XCircle } from 'lucide-react';

export default function ClinicalTrials() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Header */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Clinical Trials</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-[#E8F3FA]">
          BionicSkins™ is dedicated to advancing prosthetics through research and innovation. We aim to enhance comfort, functionality, and quality of life for amputees.
        </p>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        
        {/* Trial Focus */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100 mb-12">
          <div className="inline-block bg-[#E8F3FA] text-[#2F6FA8] font-medium px-4 py-1.5 rounded-full text-sm mb-6 border border-[#D0E2EF]">
            Active Trial: NCT05656924
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-[#1B2A4A] mb-6 leading-relaxed">
            Improving the Health Status of Dysvascular Amputees by Deploying Digital Prosthetic Interface Technology in Combination With an Exercise Intervention
          </h2>
          
          <div className="relative w-full overflow-hidden rounded-lg shadow-md mb-8" style={{ paddingTop: '56.25%' }}>
            <iframe 
               className="absolute top-0 left-0 w-full h-full"
               src="https://www.youtube.com/embed/ErpUS83_Yro" 
               title="Improving the Health Status of Dysvascular Amputees" 
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
            ></iframe>
          </div>
          
          <div className="space-y-6">
            <div>
               <h4 className="text-lg font-bold text-[#1B2A4A] mb-2">Brief Summary:</h4>
               <p className="text-[#6a879a] leading-relaxed">
                 This study explores a new "digital prosthetic interface technology" designed to enhance the health of individuals with lower limb amputations due to type 2 diabetes (dysvascular amputees). It also examines the benefits of combining this technology with a tailored exercise program to improve overall health outcomes.
               </p>
            </div>
            <div>
               <h4 className="text-lg font-bold text-[#1B2A4A] mb-2">Detailed Description:</h4>
               <p className="text-[#6a879a] leading-relaxed">
                 The research compares digital prosthetic interface technology to traditional systems, focusing on health improvements and exercise adherence. Using mobile health technology, the study supports dysvascular amputees in a walking program, aiming to enhance their clinical outcomes.
               </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 p-6 bg-[#F9F9F9] rounded-lg border border-gray-100">
             <div>
               <p className="text-sm font-bold text-[#1B2A4A] uppercase tracking-wider mb-1">Conditions</p>
               <p className="text-[#6a879a]">Diabetes Type 2, Amputation</p>
             </div>
             <div>
               <p className="text-sm font-bold text-[#1B2A4A] uppercase tracking-wider mb-1">Intervention / Treatment</p>
               <p className="text-[#6a879a]">Device: Digital Prosthetic Interface Technology</p>
             </div>
          </div>
          
          <div className="mt-6 text-right">
             <a href="https://clinicaltrials.gov/study/NCT05656924" target="_blank" rel="noreferrer" className="text-[#2F6FA8] hover:underline font-medium text-sm">
               View Full Research Details on ClinicalTrials.gov &rarr;
             </a>
          </div>
        </div>

        {/* Criteria Arrays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Inclusion Criteria */}
          <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#2F6FA8]">
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-[#2F6FA8]" /> Inclusion Criteria
            </h3>
            <ul className="space-y-4 text-[#6a879a] text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                Unilateral transtibial amputation within the past 4-16 months
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                Etiology secondary to complications of Diabetes Mellitus (DM) type II
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                Current use of a prosthesis, with at least 2 months prior use
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                K2 or K3 level (as determined using the Amputee Mobility Predictor assessment tool)
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2F6FA8] flex-shrink-0" />
                Own a smartphone
              </li>
            </ul>
          </div>

          {/* Exclusion Criteria */}
          <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#6a879a]">
            <h3 className="text-2xl font-serif text-[#1B2A4A] mb-6 flex items-center gap-3">
              <XCircle className="text-[#6a879a]" /> Exclusion Criteria
            </h3>
            <ul className="space-y-4 text-[#6a879a] text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Amputation due to cancer or macrotrauma or acute hemorrhage
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Bilateral amputation
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Medically or surgically unstable contralateral lower extremity as determined by medical criteria (e.g., critical limb ischemia)
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Severe residual limb pain that limits function preventing participation in an exercise-based program
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Medical conditions that would interfere with subject's participation in regular sustained exercise
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Anthropometric characteristics that are not compatible with the technology used to scan the residuum and manufacture the liner and socket (e.g., a residuum circumference greater than 32 inches)
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6a879a] flex-shrink-0" />
                Current pregnancy
              </li>
            </ul>
          </div>

        </div>

        {/* Participation Info */}
        <div className="bg-[#1B2A4A] text-white p-10 rounded-xl text-center">
           <h3 className="text-2xl font-serif mb-4">Research Participation</h3>
           <p className="text-[#E8F3FA] leading-relaxed max-w-2xl mx-auto mb-8 font-light">
             For inquiries regarding participation in the ongoing prosthetic trials, kindly reach out to us through phone, email, or the designated contact form. If you wish to receive further details about upcoming clinical trials or have queries about the existing trials, please specify your interest in the form. Our team is ready to offer more information and discuss potential opportunities for engagement.
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left bg-white/10 p-6 rounded-lg border border-white/20">
              <div className="col-span-1 md:col-span-2 border-b border-white/20 pb-4 mb-2">
                <p className="text-sm uppercase tracking-widest text-[#5BA8D6] mb-1">Clinical & Research Prosthetist</p>
                <p className="font-semibold text-lg">Devin Finnerty, CPO, MPO</p>
              </div>
              <div>
                <p className="text-sm text-[#5BA8D6] mb-1">Email</p>
                <a href="mailto:research@bionicskins.com" className="hover:text-white transition-colors">research@bionicskins.com</a>
              </div>
              <div>
                <p className="text-sm text-[#5BA8D6] mb-1">Phone</p>
                <a href="tel:6179327698" className="hover:text-white transition-colors">(617) 932-7698</a>
              </div>
           </div>
        </div>

      </section>

    </div>
  );
}