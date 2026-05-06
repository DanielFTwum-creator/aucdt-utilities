import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, FileText, ArrowRight, PlayCircle, Mic, Star } from 'lucide-react';
import { MOCK_CONTENT, MOCK_EVENTS } from '../constants';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { auditService } from '../services/AuditService';

// Add navigation support
interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

const VIDEO_BANNERS = [
  "https://media.techbridge.edu.gh/media/banner1.mp4",
  "https://media.techbridge.edu.gh/media/banner2.mp4",
  "https://media.techbridge.edu.gh/media/banner3.mp4",
  "https://media.techbridge.edu.gh/media/banner4.mp4"
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % VIDEO_BANNERS.length);
    }, 8000); // Rotate every 8 seconds
    return () => clearInterval(timer);
  }, []);

  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
      auditService.log('INFO', `Dashboard quick nav to ${tab}`);
    }
  };

  const handleCreateEvent = () => {
    showToast('Event Creation Wizard coming in Phase 3', 'info');
    auditService.log('INFO', 'User clicked Create Event (Simulated)');
  };

  const stats = [
    { label: t('dash.stat.views'), value: '12.5k', change: '+14%', icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { label: t('dash.stat.members'), value: '48', change: '+2', icon: Users, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
    { label: t('dash.stat.events'), value: '3', change: t('dash.stat.thisWeek'), icon: Calendar, gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/30' },
    { label: t('dash.stat.reviews'), value: '5', change: '-2', icon: FileText, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' },
  ];

  return (
    <div className="space-y-10">
      {/* Cinematic Carousel Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-techbridge-maroon text-white p-8 md:p-12 min-h-[420px] flex items-center group">
        
        {/* Video Background Layer */}
        <div className="absolute inset-0 z-0">
          {VIDEO_BANNERS.map((video, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-40' : 'opacity-0'}`}
            >
              <video 
                src={video} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover mix-blend-overlay"
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-techbridge-maroon via-techbridge-wine/90 to-transparent z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 max-w-2xl animate-in slide-in-from-left-4 duration-700">
           <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-md">
             {t('dash.hero.title')}
           </h1>
           <p className="text-white/90 text-lg mb-8 max-w-lg font-light leading-relaxed drop-shadow-sm">
             {t('dash.hero.subtitle')}
           </p>
           <div className="flex flex-wrap gap-4">
             <button onClick={() => handleNav('content')} className="px-6 py-3 bg-white text-techbridge-wine rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex items-center">
               <PlayCircle size={18} className="mr-2" />
               {t('dash.hero.btn.review')}
             </button>
             <button onClick={() => handleNav('analytics')} className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all">
               {t('dash.hero.btn.analytics')}
             </button>
           </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 right-8 z-30 flex space-x-2">
          {VIDEO_BANNERS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-techbridge-gold' : 'w-2 bg-white/40 hover:bg-white/80'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="group glass bg-white dark:bg-techbridge-card rounded-2xl p-6 relative overflow-hidden card-hover">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity group-hover:opacity-20 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                   {stat.change}
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Content - Editorial Style */}
        <div className="lg:col-span-2 glass bg-white dark:bg-techbridge-card rounded-3xl p-8 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{t('dash.recent.title')}</h3>
              <p className="text-sm text-gray-500">{t('dash.recent.subtitle')}</p>
            </div>
            <button 
              onClick={() => handleNav('content')}
              className="text-sm text-techbridge-maroon dark:text-techbridge-gold font-bold uppercase tracking-wider hover:underline flex items-center"
            >
              {t('dash.recent.viewAll')} <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-6">
            {MOCK_CONTENT.slice(0, 3).map((item, index) => (
              <div key={item.id} className="group flex items-start p-4 -mx-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-md">
                   <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                   {item.type === 'Video' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                       <PlayCircle className="text-white w-8 h-8 opacity-80" />
                     </div>
                   )}
                   {item.type === 'Podcast' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                       <Mic className="text-white w-8 h-8 opacity-80" />
                     </div>
                   )}
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-techbridge-gold mb-1 block">
                      {item.type}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${
                      item.status === 'Published' ? 'border-green-200 text-green-700 dark:border-green-900 dark:text-green-400' :
                      item.status === 'In Review' ? 'border-amber-200 text-amber-700 dark:border-amber-900 dark:text-amber-400' :
                      'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors font-serif">
                    {item.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <img src={`https://ui-avatars.com/api/?name=${item.author}&background=random`} className="w-5 h-5 rounded-full mr-2" />
                    <span>{item.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(item.dateCreated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Widget - Visual Calendar */}
        <div className="glass bg-white dark:bg-techbridge-card rounded-3xl p-8 card-hover flex flex-col">
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{t('dash.events.title')}</h3>
            <button 
              onClick={() => handleNav('events')}
              className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-techbridge-maroon hover:text-white transition-colors"
            >
              <Calendar size={18} />
            </button>
          </div>
          
          <div className="flex-1 space-y-6">
            {MOCK_EVENTS.filter(e => e.status === 'Upcoming').slice(0, 3).map((event, idx) => (
              <div key={event.id} className="relative pl-8 border-l-2 border-dashed border-gray-200 dark:border-gray-700 pb-2">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 ${idx === 0 ? 'bg-techbridge-maroon' : 'bg-techbridge-gold'}`}></div>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-techbridge-maroon/30 transition-colors">
                   <p className="text-xs font-bold text-techbridge-maroon dark:text-techbridge-gold uppercase tracking-wide mb-1">
                     {new Date(event.date).toLocaleString('default', { month: 'short', day: 'numeric' })} • {new Date(event.date).toLocaleString('default', { hour: '2-digit', minute:'2-digit' })}
                   </p>
                   <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{event.title}</h4>
                   <p className="text-xs text-gray-500 mt-1 flex items-center">
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                     {event.location}
                   </p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleCreateEvent}
            className="w-full mt-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gray-500/20 transition-all flex items-center justify-center group"
          >
            {t('dash.events.create')} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;