
import React, { useState } from 'react';
import { ScheduledPost, Platform, PostStatus, PostPriority } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import PostDetailModal from './PostDetailModal';
import { usePosts } from '../contexts/PostsContext';

const CalendarView: React.FC = () => {
  const { scheduledPosts, deletePost } = usePosts();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PostPriority>('all');

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset, 1); // Set to day 1 to avoid month-end issues
      return newDate;
    });
  };

  const filteredPosts = React.useMemo(() => {
    return scheduledPosts.filter(post => {
      const statusMatch = statusFilter === 'all' || post.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || post.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
  }, [scheduledPosts, statusFilter, priorityFilter]);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  const days = [];
  // Start from the first day of the week of the start of the month
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay()); 
  
  for (let i = 0; i < 42; i++) { // Render 6 weeks to have a consistent grid size
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const getPlatformIcon = (platform: Platform) => {
      const platformDetail = PLATFORM_DETAILS.find(p => p.id === platform);
      return platformDetail ? <platformDetail.icon className="h-4 w-4 shrink-0" /> : null;
  }
  
  const getPriorityColor = (priority: PostPriority) => {
    switch (priority) {
      case PostPriority.HIGH: return 'bg-red-500';
      case PostPriority.MEDIUM: return 'bg-yellow-500';
      case PostPriority.LOW: return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  }

  const isToday = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
  }

  return (
    <>
      <div className="max-w-7xl mx-auto bg-secondary p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} aria-label="Go to previous month" className="p-2 rounded-full hover:bg-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-primary text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => changeMonth(1)} aria-label="Go to next month" className="p-2 rounded-full hover:bg-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center mb-4 p-2 border-b border-t border-default">
          <h3 className="text-md font-semibold text-primary">Filters:</h3>
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-secondary">Status</label>
            <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-primary border border-default rounded-md py-1 px-2 text-sm focus:ring-accent-primary focus:border-accent-primary">
              <option value="all">All Statuses</option>
              {Object.values(PostStatus).map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="priority-filter" className="text-sm font-medium text-secondary">Priority</label>
            <select id="priority-filter" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)} className="bg-primary border border-default rounded-md py-1 px-2 text-sm focus:ring-accent-primary focus:border-accent-primary">
              <option value="all">All Priorities</option>
              {Object.values(PostPriority).map(p => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-7 border-t border-l border-default">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
            <div key={dayName} className="text-center font-semibold text-secondary text-xs sm:text-sm py-3 bg-primary border-b border-r border-default">{dayName}</div>
          ))}

          {days.map((d, i) => {
            const postsForDay = filteredPosts.filter(p => {
              const postDate = new Date(p.scheduledAt);
              return postDate.getFullYear() === d.getFullYear() &&
                    postDate.getMonth() === d.getMonth() &&
                    postDate.getDate() === d.getDate();
            });
            const isCurrentMonth = d.getMonth() === currentDate.getMonth();

            return (
              <div key={i} className={`relative min-h-[120px] p-1 sm:p-2 border-b border-r border-default ${isCurrentMonth ? 'bg-secondary' : 'bg-primary'}`}>
                <span className={`text-sm font-semibold ${isToday(d) ? 'bg-accent-primary text-white rounded-full h-6 w-6 flex items-center justify-center' : (isCurrentMonth ? 'text-primary' : 'text-secondary/50')}`}>
                  {d.getDate()}
                </span>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-24">
                  {postsForDay.map(post => {
                    const time = new Date(post.scheduledAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                    return (
                      <div 
                        key={post.id} 
                        onClick={() => setSelectedPost(post)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setSelectedPost(post); }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View details for ${post.platform} post at ${time}`}
                        title={`${post.platform}: ${post.content.substring(0, 50)}...`} 
                        data-testid="scheduled-post-item"
                        className="p-1.5 rounded-md bg-accent-primary/10 text-primary text-xs flex items-center gap-1.5 cursor-pointer hover:bg-accent-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent-primary"
                      >
                         <span className={`w-2 h-2 rounded-full shrink-0 ${getPriorityColor(post.priority)}`} title={`Priority: ${post.priority}`}></span>
                        {getPlatformIcon(post.platform)}
                        <span className="font-semibold truncate">{time}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredPosts.length === 0 && (
            <div className="text-center py-16 border-t border-default">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <h3 className="mt-2 text-sm font-medium text-primary">No scheduled posts</h3>
                <p className="mt-1 text-sm text-secondary">{scheduledPosts.length > 0 ? 'No posts match your current filters.' : 'Go to the Content Generator to create a new post.'}</p>
            </div>
        )}
      </div>
      
      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
          onDelete={deletePost}
        />
      )}
    </>
  );
};

export default CalendarView;
