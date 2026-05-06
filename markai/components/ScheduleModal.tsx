
import React, { useState, useRef, useEffect } from 'react';
// Fix: Import types from App.tsx where they are now defined.
import { GeneratedContent, PostPriority } from '../types';

interface ScheduleModalProps {
  post: GeneratedContent;
  onClose: () => void;
  onSchedule: (scheduledAt: Date, priority: PostPriority) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ post, onClose, onSchedule }) => {
  const now = new Date();
  // Set default time to 15 minutes in the future for a better UX
  now.setMinutes(now.getMinutes() + 15);
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const [date, setDate] = useState(today);
  const [time, setTime] = useState(currentTime);
  const [priority, setPriority] = useState<PostPriority>(PostPriority.MEDIUM);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dateInputRef.current?.focus();

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) { // Shift+Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    modal.addEventListener('keydown', handleTabKeyPress);
    return () => {
      modal.removeEventListener('keydown', handleTabKeyPress);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scheduledDateTime = new Date(`${date}T${time}`);
    if (isNaN(scheduledDateTime.getTime())) {
      setError('Invalid date or time.');
      return;
    }
    if (scheduledDateTime < new Date()) {
      setError('Cannot schedule posts in the past.');
      return;
    }
    onSchedule(scheduledDateTime, priority);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div ref={modalRef} className="bg-secondary rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-primary mb-2">Schedule Post</h2>
        <p className="text-secondary mb-6">Set a date and time to publish this content for <span className="font-semibold text-accent-primary">{post.platform}</span>.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="schedule-date" className="block text-sm font-semibold text-primary mb-2">Date</label>
            <input
              ref={dateInputRef}
              type="date"
              id="schedule-date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
              required
            />
          </div>
          <div>
            <label htmlFor="schedule-time" className="block text-sm font-semibold text-primary mb-2">Time</label>
            <input
              type="time"
              id="schedule-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
              required
            />
          </div>
          <div>
            <label htmlFor="schedule-priority" className="block text-sm font-semibold text-primary mb-2">Priority</label>
            <select
              id="schedule-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as PostPriority)}
              className="w-full p-3 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
            >
              <option value={PostPriority.LOW}>Low</option>
              <option value={PostPriority.MEDIUM}>Medium</option>
              <option value={PostPriority.HIGH}>High</option>
            </select>
          </div>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-primary bg-primary hover:bg-border-default font-bold transition">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-accent-primary text-white font-bold hover:bg-accent-primary/90 transition">Confirm Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
