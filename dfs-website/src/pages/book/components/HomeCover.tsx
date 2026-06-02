import { BookOpen, Sparkles, Volume2, ShieldCheck, Heart } from 'lucide-react';
const bannerImage = '/elephant_parade_banner.png';

interface HomeCoverProps {
  onStartStory: () => void;
  onGoToPrep: () => void;
  onGoToResources: () => void;
}

export function HomeCover({ onStartStory, onGoToPrep, onGoToResources }: HomeCoverProps) {
  // Constant for our beautifully generated image
  const BANNER_IMAGE_URL = bannerImage;

  return (
    <div id="home-cover-screen" className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* Pan-African decorative stripes (matching pages 1 & 2) */}
      <div className="flex flex-col gap-[3px] w-full" aria-hidden="true">
        <div className="h-[6px] bg-red-600"></div>
        <div className="h-[6px] bg-amber-500"></div>
        <div className="h-[6px] bg-emerald-700"></div>
        <div className="h-[6px] bg-amber-950"></div>
      </div>

      {/* Hero Header Area */}
      <div className="text-center space-y-4">
        <p className="font-mono text-xs font-semibold tracking-widest text-brand-gold uppercase">
          An Arts-in-Education Curriculum
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-brand-charcoal tracking-tight leading-none">
          An Elephant on Parade
        </h1>
        <h2 className="font-heading text-xl sm:text-2xl font-light text-brand-red italic">
          The Heartbeat of Africa
        </h2>
        <p className="font-sans text-sm text-[#475569] max-w-xl mx-auto tracking-wide">
          A Story, a Soundtrack, and a Guide for Grown-Ups to teach advanced percussion techniques and social-emotional skills.
        </p>
      </div>

      {/* Generated cover image from skill */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-brand-earth/10 max-w-2xl mx-auto aspect-[16/9] bg-amber-100">
        <img
          src={BANNER_IMAGE_URL}
          alt="An Elephant on Parade in Africa illustration"
          className="object-cover w-full h-full transition-transform duration-700 hover:scale-[1.02]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent flex items-end p-4 sm:p-6 text-white">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-sm">
              Featured Artwork
            </span>
            <p className="text-sm font-heading font-semibold text-amber-50 drop-shadow-md">
              The Great Elephant setting off on a walk towards the Big Shade Tree
            </p>
          </div>
        </div>
      </div>

      <div className="text-center font-heading text-sm text-amber-900/80 italic flex items-center justify-center gap-1.5">
        <span>By</span>
        <span className="font-semibold text-brand-earth uppercase font-sans tracking-wider text-xs">Steve Ferraris</span>
        <span>•</span>
        <span className="text-brand-gold text-xs font-sans font-medium">Arts-in-Education Specialist</span>
      </div>

      {/* Action Buttons Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-center font-sans">
        
        <button
          onClick={onGoToPrep}
          type="button"
          id="btn-nav-prep"
          className="flex flex-col items-center p-5 bg-white hover:bg-amber-50 rounded-xl border border-amber-900/10 shadow-xs hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="h-10 w-10 bg-amber-100 text-brand-gold rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm text-brand-earth uppercase tracking-wide">1. Facilitator Prep</span>
          <span className="text-xs text-[#64748B] mt-1.5 leading-relaxed text-center">
            How to hold the Djembe, sitting posture, and teach Bass & Open Tones.
          </span>
        </button>

        <button
          onClick={onStartStory}
          type="button"
          id="btn-nav-play"
          className="flex flex-col items-center p-5 bg-gradient-to-b from-[#9A3412] to-brand-earth text-white rounded-xl border border-amber-950/20 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="h-10 w-10 bg-white/20 text-yellow-300 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm uppercase tracking-wider">2. Play the Story</span>
          <span className="text-xs text-orange-100/90 mt-1.5 leading-relaxed text-center font-light">
            Interactive 9-scene storyteller prompt engine with visual soundboards.
          </span>
        </button>

        <button
          onClick={onGoToResources}
          type="button"
          id="btn-nav-resources"
          className="flex flex-col items-center p-5 bg-white hover:bg-amber-50 rounded-xl border border-amber-900/10 shadow-xs hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="h-10 w-10 bg-emerald-50 text-brand-green rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm text-brand-earth uppercase tracking-wide font-sans">3. Resource Index</span>
          <span className="text-xs text-[#64748B] mt-1.5 leading-relaxed text-center">
            Musical standards glossary, sandbox of household objects, and CASEL logs.
          </span>
        </button>

      </div>

      {/* Note From Steve Block */}
      <div className="bg-[#FAF8F3] border border-amber-900/5 rounded-2xl p-6 sm:p-8 space-y-4 max-w-3xl mx-auto shadow-inner">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-brand-red fill-current animate-pulse" />
          <h3 className="font-heading text-lg font-bold text-brand-earth border-b-2 border-brand-red/10 pb-0.5">A Note from Steve</h3>
        </div>
        
        <div className="font-sans text-[#334155] text-sm leading-relaxed space-y-3">
          <p>
            I have been teaching African drumming to children since 1985. Over the decades, I have drummed with thousands of young faces—shy faces, curious faces, restless faces, excited faces—and I have watched every single one of them transform the moment they feel the rhythm take hold.
          </p>
          <p>
            In all that time, one lesson has never changed: <strong className="text-brand-earth font-semibold">the first great victory in group drumming is getting everyone to play together</strong>—to sound, as I tell my students, like <em className="italic">one big drummer</em>. That moment when a roomful of individual children suddenly becomes one unified sound is nothing short of magical. And it is the moment this book was built to help you create.
          </p>
          <p>
            <strong className="text-brand-earth font-semibold">An Elephant on Parade</strong> began as a classroom tool—a story I would tell my youngest students at the start of class to draw them in, settle them down, and secretly begin teaching them before they even realized learning had started.
          </p>
        </div>

        <div className="pt-4 border-t border-amber-900/5 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-[#64748B] italic">
          <span>&ldquo;Yes, we like stories...&rdquo;</span>
          <span className="font-semibold text-brand-earth uppercase font-sans tracking-widest not-italic">Steve Ferraris, Artist-in-Education</span>
        </div>
      </div>

      {/* CASEL / DfS Highlight Banner */}
      <div className="bg-emerald-50/50 border border-emerald-950/5 rounded-2xl p-5 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <h4 className="font-mono text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
            Pedagogical Core
          </h4>
          <h5 className="font-heading text-base font-bold text-emerald-950">
            Drumming For Success (DfS)
          </h5>
          <p className="text-xs text-emerald-900/70 leading-relaxed">
            A curriculum built on a core philosophy: every learner deserves to feel the immediate joy of musical success on day one, without expensive gear.
          </p>
        </div>
        <div className="space-y-1 border-t md:border-t-0 md:border-l border-emerald-900/10 pt-3 md:pt-0 md:pl-4">
          <h4 className="font-mono text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
            SEL Alignment
          </h4>
          <h5 className="font-heading text-base font-bold text-emerald-950">
            CASEL-Aligned Competencies
          </h5>
          <p className="text-xs text-emerald-900/70 leading-relaxed">
            Integrates self-awareness, impulse control, active listenting, perspective-taking, and group collaboration into every single beat.
          </p>
        </div>
      </div>

      {/* Footer Stripes */}
      <div className="flex flex-col gap-[3px] w-full pt-4" aria-hidden="true">
        <div className="h-[6px] bg-amber-950"></div>
        <div className="h-[6px] bg-emerald-700"></div>
        <div className="h-[6px] bg-amber-500"></div>
        <div className="h-[6px] bg-red-600"></div>
      </div>

    </div>
  );
}
