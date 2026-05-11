import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Eye } from 'lucide-react';
import { MOCK_CONTENT } from '../constants';
import { ContentStatus } from '../types';
import CollaborativeEditor from './CollaborativeEditor';
import { useLanguage } from '../context/LanguageContext';

const ContentManager: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'All'>('All');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{title: string, content: string} | null>(null);
  const { t } = useLanguage();

  const filteredContent = filterStatus === 'All' 
    ? MOCK_CONTENT 
    : MOCK_CONTENT.filter(c => c.status === filterStatus);

  const handleOpenEditor = (title?: string) => {
      if (title) {
          // Mock fetching content
          setSelectedContent({ title, content: "This is a mock draft content loaded from the database..." });
      } else {
          setSelectedContent(null);
      }
      setIsEditorOpen(true);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'All': return t('cms.tab.all');
      case 'Draft': return t('cms.tab.draft');
      case 'In Review': return t('cms.tab.inReview');
      case 'Published': return t('cms.tab.published');
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('cms.search')} 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7A0019] w-full"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Filter size={18} />
          </button>
        </div>
        <button 
          onClick={() => handleOpenEditor()}
          className="flex items-center px-4 py-2 bg-[#7A0019] text-white rounded-lg hover:bg-[#600014] transition-colors shadow-sm text-sm font-medium w-full sm:w-auto justify-center"
        >
          <Plus size={18} className="mr-2" />
          {t('cms.create')}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-6 min-w-max">
          {['All', 'Draft', 'In Review', 'Published'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as ContentStatus | 'All')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                ${filterStatus === status 
                  ? 'border-[#7A0019] text-[#7A0019]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Board */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">{t('cms.col.title')}</div>
            <div className="col-span-2">{t('cms.col.author')}</div>
            <div className="col-span-2">{t('cms.col.status')}</div>
            <div className="col-span-2">{t('cms.col.date')}</div>
            <div className="col-span-1 text-right">{t('cms.col.actions')}</div>
          </div>
          <div className="divide-y divide-gray-200 bg-white">
            {filteredContent.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-5 flex items-center">
                  <div className="h-10 w-16 flex-shrink-0 mr-4">
                    <img className="h-10 w-16 rounded object-cover" src={item.thumbnail} alt="" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.type}</div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-900">{item.author}</div>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'Published' ? 'bg-green-100 text-green-800' :
                    item.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {new Date(item.dateCreated).toLocaleDateString()}
                </div>
                <div className="col-span-1 text-right flex justify-end space-x-2">
                  <button onClick={() => handleOpenEditor(item.title)} className="text-gray-400 hover:text-[#7A0019]">
                    <Edit2 size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-[#7A0019]">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collaborative Editor Modal */}
      {isEditorOpen && (
        <CollaborativeEditor 
          initialTitle={selectedContent?.title}
          initialContent={selectedContent?.content}
          onClose={() => setIsEditorOpen(false)}
          onSave={(title, content) => {
            console.log('Saved:', title, content);
            setIsEditorOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ContentManager;