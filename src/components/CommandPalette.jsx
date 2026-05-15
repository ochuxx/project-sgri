import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { state } = useApp();

  // Focused via autoFocus and reset via 'key' in parent

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sections = [
    { label: 'Navegación', icon: '🧭', items: [
      { name: 'Inicio', action: () => { onNavigate('home'); onClose(); } },
      { name: 'Proyectos', action: () => { onNavigate('projects'); onClose(); } },
      { name: 'Tareas', action: () => { onNavigate('tasks'); onClose(); } },
      { name: 'Archivos', action: () => { onNavigate('files'); onClose(); } },
      { name: 'Reportes', action: () => { onNavigate('reports'); onClose(); } },
      { name: 'Comentarios', action: () => { onNavigate('comments'); onClose(); } },
      { name: 'Cronograma', action: () => { onNavigate('schedule'); onClose(); } },
      { name: 'Roles de acceso', action: () => { onNavigate('roles'); onClose(); } },
      { name: 'Configuración', action: () => { onNavigate('settings'); onClose(); } },
    ]},
    { label: 'Proyectos', icon: '📦', items: state.projects.map(p => ({
      name: p.name, sub: `${p.progress}% · ${p.status}`,
      action: () => { onNavigate('projects'); onClose(); }
    }))},
    { label: 'Tareas pendientes', icon: '✅', items: state.tasks.filter(t => !t.done).map(t => ({
      name: t.title, sub: `${t.proj} · ${t.due}`,
      action: () => { onNavigate('tasks'); onClose(); }
    }))},
  ];

  const q = query.toLowerCase().trim();
  const filtered = q ? sections.map(s => ({
    ...s, items: s.items.filter(i => i.name.toLowerCase().includes(q) || (i.sub && i.sub.toLowerCase().includes(q)))
  })).filter(s => s.items.length > 0) : sections;

  return (
    <div className="cp-overlay" onClick={onClose}>
      <div className="cp-container" onClick={e => e.stopPropagation()}>
        <div className="cp-input-wrap">
          <svg width="16" height="16" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            ref={inputRef}
            className="cp-input"
            placeholder="Buscar proyectos, tareas, secciones…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="cp-kbd">ESC</kbd>
        </div>
        <div className="cp-results">
          {filtered.length === 0 && (
            <div className="cp-empty">No se encontraron resultados para "{query}"</div>
          )}
          {filtered.map((section, si) => (
            <div key={si} className="cp-section">
              <div className="cp-section-label">{section.icon} {section.label}</div>
              {section.items.map((item, ii) => (
                <button key={ii} className="cp-item" onClick={item.action}>
                  <span className="cp-item-name">{item.name}</span>
                  {item.sub && <span className="cp-item-sub">{item.sub}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
