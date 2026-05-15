import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const typeIcons = {
  task: '📋', comment: '💬', deadline: '⏰', grade: '🎓', system: '⚙️'
};

export default function NotificationsPanel({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const panelRef = useRef(null);
  const unread = state.notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="notif-panel" ref={panelRef}>
      <div className="notif-header">
        <span className="notif-title">Notificaciones</span>
        {unread > 0 && (
          <button className="notif-mark-all" onClick={() => dispatch({ type: 'MARK_ALL_READ' })}>
            Marcar todas como leídas
          </button>
        )}
      </div>
      <div className="notif-list">
        {state.notifications.map(n => (
          <div
            key={n.id}
            className={`notif-item ${n.read ? '' : 'unread'}`}
            onClick={() => dispatch({ type: 'MARK_NOTIF_READ', payload: n.id })}
          >
            <span className="notif-icon">{typeIcons[n.type] || '📌'}</span>
            <div className="notif-content">
              <div className="notif-item-title">{n.title}</div>
              <div className="notif-item-body">{n.body}</div>
              <div className="notif-item-time">{n.time}</div>
            </div>
            {!n.read && <div className="notif-unread-dot"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
