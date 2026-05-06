import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { User, CollabEvent } from '../types';
import { collaborationService } from '../services/collaboration';
import { Users, Wifi, Save, X, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { useToast } from '../context/ToastContext';

interface CollaborativeEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ 
  initialTitle = '', 
  initialContent = '', 
  onClose, 
  onSave 
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [activeUsers, setActiveUsers] = useState<User[]>([CURRENT_USER]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastCursorPos = useRef<number | null>(null);

  useEffect(() => {
    // Connect to session
    collaborationService.connect(CURRENT_USER, 'doc-123');
    setIsConnected(true);

    const unsubscribe = collaborationService.subscribe((event: CollabEvent) => {
      // Ignore our own events from the same session
      if (event.sessionId === collaborationService.sessionId) return;

      switch (event.type) {
        case 'user_joined':
          if (event.user) {
            setActiveUsers(prev => {
              if (prev.find(u => u.id === event.user!.id)) return prev;
              showToast(`${event.user!.name} joined the document`, 'info');
              return [...prev, event.user!];
            });
          }
          break;
        case 'user_left':
          setActiveUsers(prev => {
             const user = prev.find(u => u.id === event.userId);
             if (user) showToast(`${user.name} left`, 'info');
             return prev.filter(u => u.id !== event.userId);
          });
          break;
        case 'cursor_move':
            setActiveUsers(prev => prev.map(u => 
                u.id === event.userId ? { ...u, cursorPosition: event.position } : u
            ));
            break;
        case 'text_update':
          if (event.text !== undefined) {
            // Typing indicator
            if (event.userId !== CURRENT_USER.id) {
               const user = activeUsers.find(u => u.id === event.userId) || { name: 'Remote User' };
               setIsTyping(user.name);
               setTimeout(() => setIsTyping(null), 2000);
            }

            // Handle Update
            if (event.action === 'replace') {
                setContent(event.text);
            } else if (event.action === 'insert') {
                setContent(prev => {
                    const insertPos = event.position !== undefined ? event.position : prev.length;
                    // Safely handle out of bounds (append if huge number)
                    const safePos = Math.min(Math.max(0, insertPos), prev.length);
                    
                    // Track where local cursor was before update
                    if (textareaRef.current) {
                         lastCursorPos.current = textareaRef.current.selectionStart;
                    }
                    
                    return prev.slice(0, safePos) + event.text + prev.slice(safePos);
                });
            }
          }
          break;
      }
    });

    return () => {
      unsubscribe();
      collaborationService.disconnect();
    };
  }, [activeUsers, showToast]);

  // Restore cursor position after a remote update (very basic preservation)
  useLayoutEffect(() => {
    if (lastCursorPos.current !== null && textareaRef.current) {
        // If content length increased, and cursor was after insertion point, shift it?
        // This is complex to get perfect without Operational Transformation. 
        // For now, we try to keep the cursor where it was if possible, 
        // but often React resets it to end on controlled update if not handled.
        // Actually, if we are typing, we are fine. If remote updates, we might lose position.
        
        // Simple heuristic: If we weren't focused, don't worry.
        if (document.activeElement === textareaRef.current) {
             const len = content.length;
             // Restore to previous or end if shorter
             // textareaRef.current.setSelectionRange(lastCursorPos.current, lastCursorPos.current);
             // Note: This often conflicts with local typing updates. 
             // Leaving simplified for prototype stability.
        }
        lastCursorPos.current = null;
    }
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // In a real app, we'd calculate diff and send 'insert'/'delete'
    // For this prototype, we'll send 'replace' to keep state consistent across simple peers
    collaborationService.send({ 
        type: 'text_update', 
        text: newContent, 
        userId: CURRENT_USER.id,
        action: 'replace' 
    });
  };

  const handleCursorMove = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const pos = target.selectionStart;
    
    collaborationService.send({
        type: 'cursor_move',
        userId: CURRENT_USER.id,
        position: pos
    });
  };

  // Helper to render remote cursors using the "Mirror" technique
  const renderRemoteCursors = () => {
    return activeUsers.filter(u => u.id !== CURRENT_USER.id && u.cursorPosition !== undefined).map(user => {
        // Clamp cursor position
        const safePos = Math.min(Math.max(0, user.cursorPosition || 0), content.length);
        const beforeCursor = content.substring(0, safePos);
        
        return (
            <div key={user.id} className="absolute inset-0 pointer-events-none whitespace-pre-wrap font-serif text-lg leading-relaxed p-12 lg:px-24" style={{ color: 'transparent' }}>
                <span>{beforeCursor}</span>
                <span className="relative inline-block align-text-bottom h-6 w-0.5 -ml-[1px] -mb-[4px] z-10 transition-all duration-100" style={{ backgroundColor: user.color || '#D4A017' }}>
                    <div className="absolute top-[-24px] left-[-8px] px-2 py-0.5 rounded-md text-[10px] text-white font-bold whitespace-nowrap shadow-md transition-opacity duration-300 opacity-100" style={{ backgroundColor: user.color || '#D4A017' }}>
                        {user.name}
                    </div>
                </span>
            </div>
        );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        
        {/* Header / Toolbar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center z-20">
          <div className="flex-1 mr-4">
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400 w-full"
              placeholder="Untitled Document"
            />
            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
              <span className={`flex items-center ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
                <Wifi size={12} className="mr-1" />
                {isConnected ? 'Online' : 'Connecting...'}
              </span>
              <span>•</span>
              <span>All changes saved</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Active Users Stack */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                <div className="flex -space-x-2 mr-2">
                {activeUsers.map((user, idx) => (
                    <div key={`${user.id}-${idx}`} className="relative group transition-transform hover:z-10 hover:scale-110 cursor-help">
                    <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                        style={{ borderColor: user.color || 'transparent' }}
                    />
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 shadow-lg">
                        {user.name}
                    </div>
                    </div>
                ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium px-1">
                    {activeUsers.length > 1 ? `${activeUsers.length} editors` : 'Just you'}
                </div>
            </div>

            <button className="p-2 text-techbridge-maroon dark:text-techbridge-gold bg-techbridge-maroon/10 dark:bg-white/5 rounded-full hover:bg-techbridge-maroon/20 transition-colors">
                <MessageSquare size={20} />
            </button>

            <button 
                onClick={() => onSave(title, content)}
                className="flex items-center px-6 py-2 bg-[#7A0019] text-white rounded-full hover:bg-[#600014] transition-colors text-sm font-bold shadow-lg shadow-techbridge-maroon/20"
            >
              <Save size={16} className="mr-2" />
              Save
            </button>
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Editor Toolbar */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 px-6 py-2 flex items-center space-x-1 overflow-x-auto shrink-0 z-10">
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Bold size={18} /></button>
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Italic size={18} /></button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><List size={18} /></button>
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><LinkIcon size={18} /></button>
            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><ImageIcon size={18} /></button>
            <div className="flex-1"></div>
            {isTyping && (
                <div className="text-xs text-[#7A0019] dark:text-[#D4A017] font-medium animate-in fade-in slide-in-from-right-4 flex items-center bg-[#7A0019]/10 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-[#7A0019] dark:bg-[#D4A017] rounded-full mr-2 animate-bounce"></span>
                    {isTyping} is typing...
                </div>
            )}
        </div>

        {/* Main Editor Area with Mirror Cursor Layer */}
        <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden flex flex-col relative">
            <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                <div className="max-w-4xl mx-auto min-h-full bg-white dark:bg-gray-900 shadow-sm p-12 lg:px-24 relative">
                    
                    {/* Remote Cursor Overlay (Mirror Layer) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
                         {renderRemoteCursors()}
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleContentChange}
                        onSelect={handleCursorMove}
                        onKeyUp={handleCursorMove}
                        onClick={handleCursorMove}
                        className="w-full h-full min-h-[600px] resize-none outline-none border-none bg-transparent text-gray-900 dark:text-gray-100 leading-relaxed text-lg placeholder-gray-300 dark:placeholder-gray-700 font-serif relative z-10 selection:bg-techbridge-maroon/20 dark:selection:bg-techbridge-gold/20"
                        placeholder="Start typing your story..."
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
        
        {/* Footer Status */}
        <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 flex justify-between">
            <span className="font-mono">Ln {content.split('\n').length}, Col {content.length}</span>
            <div className="flex items-center space-x-4">
                 <span>UTF-8</span>
                 <span className="flex items-center"><Wifi size={10} className="mr-1 text-green-500"/> Connected</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;