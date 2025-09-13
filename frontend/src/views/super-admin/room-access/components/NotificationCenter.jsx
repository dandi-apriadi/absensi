import React, { useState, useEffect } from 'react';
import {
    MdNotifications,
    MdSecurity,
    MdWarning,
    MdInfo,
    MdCheckCircle,
    MdError,
    MdClose,
    MdVolumeUp,
    MdVolumeOff
} from 'react-icons/md';

const NotificationCenter = ({ notifications = [], onDismiss, soundEnabled = true, onToggleSound }) => {
    const [localNotifications, setLocalNotifications] = useState([]);

    useEffect(() => {
        // Add new notifications with auto-dismiss timers
        notifications.forEach(notification => {
            if (!localNotifications.find(n => n.id === notification.id)) {
                const newNotification = {
                    ...notification,
                    timestamp: new Date(),
                    autoClose: notification.type !== 'critical'
                };
                
                setLocalNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Keep max 5
                
                // Auto-dismiss non-critical notifications after 5 seconds
                if (newNotification.autoClose) {
                    setTimeout(() => {
                        dismissNotification(notification.id);
                    }, 5000);
                }
                
                // Play sound for critical notifications
                if (soundEnabled && notification.type === 'critical') {
                    // Browser notification sound
                    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhUVGv5QA');
                    audio.play().catch(() => {}); // Ignore errors if audio can't play
                }
            }
        });
    }, [notifications, soundEnabled]);

    const dismissNotification = (id) => {
        setLocalNotifications(prev => prev.filter(n => n.id !== id));
        if (onDismiss) {
            onDismiss(id);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return <MdCheckCircle className="w-5 h-5" />;
            case 'warning': return <MdWarning className="w-5 h-5" />;
            case 'error': return <MdError className="w-5 h-5" />;
            case 'critical': return <MdSecurity className="w-5 h-5" />;
            case 'info':
            default: return <MdInfo className="w-5 h-5" />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'success': return 'from-emerald-500 to-green-600 border-emerald-200';
            case 'warning': return 'from-yellow-500 to-orange-600 border-yellow-200';
            case 'error': return 'from-red-500 to-red-600 border-red-200';
            case 'critical': return 'from-purple-500 to-purple-600 border-purple-200';
            case 'info':
            default: return 'from-blue-500 to-blue-600 border-blue-200';
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = Math.floor((now - timestamp) / 1000);
        
        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        return timestamp.toLocaleDateString('id-ID');
    };

    if (localNotifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
            {/* Sound Toggle */}
            <div className="flex justify-end">
                <button
                    onClick={onToggleSound}
                    className={`p-2 rounded-lg transition-colors ${
                        soundEnabled 
                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={soundEnabled ? 'Matikan suara notifikasi' : 'Aktifkan suara notifikasi'}
                >
                    {soundEnabled ? <MdVolumeUp className="w-4 h-4" /> : <MdVolumeOff className="w-4 h-4" />}
                </button>
            </div>

            {/* Notifications */}
            {localNotifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`bg-gradient-to-r ${getNotificationColor(notification.type)} text-white rounded-xl shadow-2xl border backdrop-blur-sm transform transition-all duration-300 animate-slide-in-right`}
                >
                    <div className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold mb-1">
                                        {notification.title}
                                    </h4>
                                    <p className="text-sm opacity-90">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs opacity-75 mt-2">
                                        {formatTimestamp(notification.timestamp)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => dismissNotification(notification.id)}
                                className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <MdClose className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Progress bar for auto-close */}
                    {notification.autoClose && (
                        <div className="h-1 bg-white/20 rounded-b-xl overflow-hidden">
                            <div 
                                className="h-full bg-white/40 animate-progress" 
                                style={{ animationDuration: '5s' }}
                            ></div>
                        </div>
                    )}
                </div>
            ))}

            <style jsx>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
                
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
                
                .animate-progress {
                    animation: progress linear;
                }
            `}</style>
        </div>
    );
};

export default NotificationCenter;