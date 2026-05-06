
import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { Notification } from '../types';
import { Bell, Check, Trash2 } from 'lucide-react';

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };
    
    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-aucdt-green mb-6">Notifications</h1>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {notifications.map(notification => (
                        <li 
                            key={notification.id} 
                            className={`p-4 flex items-start justify-between transition-colors ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
                        >
                           <div className="flex items-start">
                                <div className={`flex-shrink-0 p-2 rounded-full mr-4 mt-1 ${notification.read ? 'bg-gray-200 text-gray-500' : 'bg-aucdt-gold/20 text-aucdt-gold'}`}>
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className={`text-aucdt-brown ${!notification.read && 'font-semibold'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </p>
                                </div>
                           </div>
                           <div className="flex items-center space-x-2 ml-4">
                                {!notification.read && (
                                    <button onClick={() => markAsRead(notification.id)} className="p-2 text-aucdt-green hover:bg-aucdt-green/10 rounded-full" title="Mark as read">
                                        <Check size={18} />
                                    </button>
                                )}
                                <button onClick={() => deleteNotification(notification.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full" title="Delete notification">
                                    <Trash2 size={18} />
                                </button>
                           </div>
                        </li>
                    ))}
                    {notifications.length === 0 && (
                        <li className="p-8 text-center text-gray-500">
                            You have no notifications.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NotificationsPage;
