import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate real-time socket events for demo
    const events = [
      { type: 'approval:created', title: 'Goal Approved', body: 'Your goal "Q4 Revenue Target" was approved by Manager.', icon: 'check', time: new Date() },
      { type: 'comment:added', title: 'New Comment', body: 'Manager left feedback on your achievement entry.', icon: 'comment', time: new Date() },
      { type: 'escalation:triggered', title: 'Escalation Alert', body: '2 goals pending approval for > 5 days.', icon: 'alert', time: new Date() },
      { type: 'reminder', title: 'Submission Reminder', body: 'Q3 goal submission deadline is in 3 days.', icon: 'clock', time: new Date() },
    ];
    setNotifications(events);

    // Real Socket.io connection (when socket.io-client is installed and backend is running)
    let socket;
    const connectSocket = async () => {
      try {
        const { io } = await import('socket.io-client');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        socket = io(API_URL, { transports: ['websocket', 'polling'] });

        socket.on('connect', () => console.log('🔌 Socket connected:', socket.id));
        socket.on('disconnect', () => console.log('🔌 Socket disconnected'));

        socket.on('approval:created', (data) => {
          const n = { type: 'approval:created', title: 'Goal Approved', body: data.message || 'A goal has been approved.', icon: 'check', time: new Date() };
          setNotifications(prev => [n, ...prev]);
          toast.success(n.body, { icon: '✅' });
        });

        socket.on('comment:added', (data) => {
          const n = { type: 'comment:added', title: 'New Comment', body: data.content || 'New comment received.', icon: 'comment', time: new Date() };
          setNotifications(prev => [n, ...prev]);
          toast(n.body, { icon: '💬' });
        });

        socket.on('escalation:triggered', (data) => {
          const n = { type: 'escalation:triggered', title: 'Escalation Alert', body: data.message || 'An escalation has been triggered.', icon: 'alert', time: new Date() };
          setNotifications(prev => [n, ...prev]);
          toast.error(n.body, { icon: '🚨' });
        });
      } catch (e) {
        // socket.io-client not installed — graceful degradation
        console.log('ℹ️ Socket.io-client not available. Running in demo notification mode.');
      }
    };
    connectSocket();

    return () => { if (socket) socket.disconnect(); };
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  return (
    <SocketContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
