import React, { useState } from 'react';
import { User, Message } from '../types';

interface MessagesProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const Messages: React.FC<MessagesProps> = ({ currentUser, users, messages, setMessages }) => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(users.find(u => u.id !== currentUser.id)?.id || null);
  const [inputText, setInputText] = useState('');

  // Get contacts (exclude self)
  const contacts = users.filter(u => u.id !== currentUser.id);

  // Filter messages for current conversation
  const conversation = messages.filter(
    m => (m.senderId === currentUser.id && m.receiverId === selectedContactId) ||
         (m.senderId === selectedContactId && m.receiverId === currentUser.id)
  ).sort((a, b) => a.timestamp - b.timestamp);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContactId) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedContactId,
      content: inputText,
      timestamp: Date.now(),
      read: false
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-darkcard rounded-xl shadow-sm overflow-hidden border dark:border-gray-700">
      {/* Contacts List */}
      <div className="w-1/3 border-r dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-bold text-gray-700 dark:text-gray-200">Contacts</h3>
        </div>
        <div className="overflow-y-auto flex-1" role="list" aria-label="Contact list">
            {contacts.map(contact => (
                <button 
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`w-full text-left p-4 flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ${selectedContactId === contact.id ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
                    aria-selected={selectedContactId === contact.id}
                >
                    <img src={contact.avatar} alt="" className="w-10 h-10 rounded-full mr-3" aria-hidden="true"/>
                    <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.role}</p>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-darkbg">
        {selectedContactId ? (
            <>
                <div className="p-4 bg-white dark:bg-darkcard border-b dark:border-gray-700 flex items-center">
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                        {users.find(u => u.id === selectedContactId)?.name}
                    </span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-label="Message History">
                    {conversation.map(msg => {
                        const isMe = msg.senderId === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600'}`}>
                                    {msg.content}
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {conversation.length === 0 && (
                        <div className="text-center text-gray-400 text-sm mt-10">No messages yet. Start the conversation!</div>
                    )}
                </div>

                <form onSubmit={handleSend} className="p-4 bg-white dark:bg-darkcard border-t dark:border-gray-700 flex gap-2">
                    <label htmlFor="messageInput" className="sr-only">Message</label>
                    <input 
                        id="messageInput"
                        type="text" 
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border dark:border-gray-600 dark:bg-gray-800 p-2.5 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    />
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="Send Message">
                        <i className="fas fa-paper-plane" aria-hidden="true"></i>
                    </button>
                </form>
            </>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
                Select a contact to start messaging
            </div>
        )}
      </div>
    </div>
  );
};