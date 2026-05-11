import React from 'react';
import { UploadCloud, File, Image, Video, Music } from 'lucide-react';
import { MOCK_ASSETS } from '../constants';
import { useToast } from '../context/ToastContext';
import { auditService } from '../services/AuditService';
import { useLanguage } from '../context/LanguageContext';

const AssetLibrary: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();

  const handleUpload = () => {
    showToast('Initiating secure upload... (Simulated)', 'info');
    setTimeout(() => {
      showToast('File uploaded successfully (Simulated)', 'success');
      auditService.log('INFO', 'User uploaded file (Simulated)');
    }, 1500);
  };

  const handleDelete = (name: string) => {
    showToast(`Asset "${name}" deleted`, 'error');
    auditService.log('WARN', `User deleted asset: ${name}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Image': return <Image className="w-8 h-8 text-purple-500" />;
      case 'Video': return <Video className="w-8 h-8 text-red-500" />;
      case 'Audio': return <Music className="w-8 h-8 text-blue-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const filterLabels = [
    t('assets.filter.all'), 
    t('assets.filter.images'), 
    t('assets.filter.videos'), 
    t('assets.filter.docs'), 
    t('assets.filter.audio')
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-10 overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-techbridge-maroon to-gray-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-30"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-serif font-bold text-white mb-3 tracking-tight">{t('assets.title')}</h2>
            <p className="text-white/80 text-lg font-light leading-relaxed">
              {t('assets.subtitle')}
            </p>
          </div>
          <button 
            onClick={handleUpload}
            className="flex items-center px-8 py-4 bg-white text-techbridge-maroon rounded-full font-bold shadow-lg shadow-black/20 hover:shadow-xl hover:scale-105 transition-all"
          >
            <UploadCloud size={20} className="mr-2" />
            {t('assets.upload')}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
             {filterLabels.map((filter, i) => (
              <button key={filter} className={`px-5 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${i === 0 ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                {filter}
              </button>
             ))}
          </div>
          <p className="text-sm text-gray-500 hidden md:block">{MOCK_ASSETS.length} {t('assets.itemsStored')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_ASSETS.map((asset) => (
            <div key={asset.id} className="group glass bg-white dark:bg-techbridge-card rounded-2xl overflow-hidden card-hover border border-gray-100 dark:border-white/5">
              <div className="aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                {asset.type === 'Image' || asset.type === 'Video' ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-50 dark:bg-white/5">
                    {getIcon(asset.type)}
                  </div>
                )}
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors">
                     <UploadCloud size={18} className="rotate-180"/>
                  </button>
                  <button onClick={() => handleDelete(asset.name)} className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors">
                     <span className="sr-only">Delete</span>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-widest text-techbridge-gold uppercase bg-techbridge-gold/10 px-2 py-0.5 rounded">{asset.type}</span>
                  <span className="text-xs text-gray-400 font-mono">{asset.size}</span>
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white truncate mb-1" title={asset.name}>{asset.name}</h4>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                   <p className="text-xs text-gray-500 dark:text-gray-400">{t('assets.addedBy')} {asset.uploadedBy.split(' ')[0]}</p>
                   <p className="text-xs text-gray-400">{new Date(asset.dateUploaded).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Upload Placeholder */}
          <div 
            onClick={handleUpload}
            className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400 hover:border-techbridge-maroon hover:text-techbridge-maroon hover:bg-techbridge-maroon/5 dark:hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="p-4 bg-gray-100 dark:bg-white/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
               <UploadCloud size={32} />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide">{t('assets.drop')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetLibrary;