import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const COLUMNS = [
  { id: 'todo', label: 'Por hacer', color: 'var(--c-accent)' },
  { id: 'progress', label: 'En progreso', color: 'var(--warn)' },
  { id: 'review', label: 'En revisión', color: '#a78bfa' },
  { id: 'done', label: 'Completada', color: 'var(--success)' },
];

export default function TasksView() {
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState('kanban'); // 'list' | 'kanban'
  const [draggedId, setDraggedId] = useState(null);

  const toggleTask = (id) => dispatch({ type: 'TOGGLE_TASK', payload: id });

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, column) => {
    e.preventDefault();
    if (draggedId !== null) {
      dispatch({ type: 'MOVE_TASK', payload: { id: draggedId, column } });
      setDraggedId(null);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  return (
    <div className="view-tasks fu1">
      <div className="ph-top" style={{ marginBottom: '24px' }}>
        <div>
          <div className="ph-title">Mis Tareas</div>
          <div className="ph-sub">Gestiona y haz seguimiento de tus asignaciones</div>
        </div>
        <div className="btn-row">
          <div className="view-toggle">
            <button className={`vt-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <button className={`vt-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
            </button>
          </div>
          <button className="btn-s btn-solid">Nueva tarea</button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {COLUMNS.map(col => {
            const colTasks = state.tasks.filter(t => t.column === col.id);
            return (
              <div
                key={col.id}
                className="kanban-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="kanban-col-head">
                  <div className="kanban-col-dot" style={{ background: col.color }}></div>
                  <span className="kanban-col-title">{col.label}</span>
                  <span className="kanban-col-count">{colTasks.length}</span>
                </div>
                <div className="kanban-col-body">
                  {colTasks.map(t => (
                    <div
                      key={t.id}
                      className="kanban-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, t.id)}
                    >
                      <div className="kanban-card-title">{t.title}</div>
                      <div className="kanban-card-meta">
                        <span>{t.proj}</span>
                        <span className={`task-pri pri-${t.pri}`} style={{ marginLeft: 0 }}>
                          {t.pri === 'h' ? 'Alta' : t.pri === 'm' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                      <div className="kanban-card-due">⏱️ {t.due}</div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="kanban-empty">Arrastra tareas aquí</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="card-head" style={{ padding: '16px 20px', display: 'flex', gap: '20px' }}>
            <span style={{ fontSize: '.85rem', color: 'var(--text-1)', fontWeight: 600 }}>Pendientes ({state.tasks.filter(t => !t.done).length})</span>
            <span style={{ fontSize: '.85rem', color: 'var(--text-4)' }}>Completadas ({state.tasks.filter(t => t.done).length})</span>
          </div>
          <div>
            {state.tasks.map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                borderBottom: '1px solid var(--border)', transition: 'background .2s',
                background: t.done ? 'rgba(0,0,0,0.1)' : 'transparent',
                opacity: t.done ? 0.6 : 1
              }} className="task-row-hover">
                <div className={`task-cb ${t.done ? 'done' : ''}`} onClick={() => toggleTask(t.id)}>
                  {t.done && <svg viewBox="0 0 12 12" fill="none" width="9" height="9"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.9rem', color: 'var(--text-1)', fontWeight: 500, marginBottom: '4px', textDecoration: t.done ? 'line-through' : 'none' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-4)', display: 'flex', gap: '12px' }}>
                    <span>📦 {t.proj}</span>
                    <span>⏱️ {t.due}</span>
                  </div>
                </div>
                <span className={`task-pri pri-${t.pri}`}>
                  {t.pri === 'h' ? 'Alta Prioridad' : t.pri === 'm' ? 'Media Prioridad' : 'Baja Prioridad'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
