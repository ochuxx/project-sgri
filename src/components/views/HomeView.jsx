import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function HomeView({ onNavigate, onCreateTask }) {
  const { state, dispatch } = useApp();
  const pendingTasks = state.tasks.filter(t => !t.done);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [showAllModules, setShowAllModules] = useState(false);

  const toggleTask = (id) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    // Simular unión a proyecto
    dispatch({
      type: 'ADD_PROJECT',
      payload: {
        name: `Proyecto (Código: ${joinCode.trim()})`,
        desc: 'Te has unido a este proyecto exitosamente.',
        members: ['Tú'],
        progress: 0,
        status: 'Nuevo',
        statusClass: 'tag-blue',
        updated: 'Ahora'
      }
    });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id: Date.now(), type: 'system', title: 'Te uniste a un proyecto', body: `Código: ${joinCode.trim()}`, time: 'Ahora', read: false }
    });
    setShowJoin(false);
    setJoinCode('');
  };

  const modules = [
    { icon: <svg width="18" height="18" fill="none" stroke="var(--text-2)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>, name: 'Gestión de proyectos', desc: 'Crea y administra proyectos con múltiples tipos de tareas', target: 'projects' },
    { icon: <svg width="18" height="18" fill="none" stroke="var(--success)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>, name: 'Tipos de tareas', desc: 'Personaliza categorías que determinan el avance real', target: 'tasks' },
    { icon: <svg width="18" height="18" fill="none" stroke="var(--warn)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>, name: 'Dashboard de avances', desc: 'Métricas en tiempo real para profesores y estudiantes', target: 'reports' },
    { icon: <svg width="18" height="18" fill="none" stroke="var(--c-accent)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>, name: 'Gestor de archivos', desc: 'Sube, organiza y versiona archivos por proyecto', target: 'files' },
    { icon: <svg width="18" height="18" fill="none" stroke="var(--success)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>, name: 'Comentarios', desc: 'Retroalimentación entre profesores y estudiantes', target: 'comments' },
    { icon: <svg width="18" height="18" fill="none" stroke="var(--warn)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, name: 'Cronograma', desc: 'Línea de tiempo de entregas y presentaciones', target: 'schedule' },
    { icon: <svg width="18" height="18" fill="none" stroke="var(--c-accent)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, name: 'Roles de acceso', desc: 'Gestiona participantes y permisos de la plataforma', target: 'roles' },
    { icon: <svg width="18" height="18" fill="none" stroke="var(--text-2)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, name: 'Configuración', desc: 'Ajustes de tu cuenta, perfil y preferencias', target: 'settings' },
  ];

  const displayedModules = showAllModules ? modules : modules.slice(0, 6);
  const avgProgress = state.projects.length > 0 ? Math.round(state.projects.reduce((a, p) => a + p.progress, 0) / state.projects.length) : 0;

  return (
    <>
      <div className="ph fu1">
        <div className="ph-top">
          <div>
            <div className="ph-title">Panel principal</div>
            <div className="ph-sub">Resumen de proyectos, tareas y actividad reciente</div>
          </div>
          <div className="btn-row">
            <button className="btn-s btn-ghost" onClick={() => setShowJoin(true)}>
              <svg style={{ display: 'inline', marginRight: 4, verticalAlign: '-2px' }} width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
              Unirse a proyecto
            </button>
            <button className="btn-s btn-solid" onClick={onCreateTask}>Nueva tarea</button>
          </div>
        </div>
      </div>

      {/* Modal Unirse a proyecto */}
      {showJoin && (
        <div className="modal-overlay" onClick={() => setShowJoin(false)}>
          <div className="modal-box" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Unirse a un Proyecto</h3><button className="modal-close" onClick={() => setShowJoin(false)}>✕</button></div>
            <form onSubmit={handleJoin} className="modal-form">
              <div className="modal-field">
                <label>Código de invitación</label>
                <input type="text" placeholder="Ej: PROJ-2026-ABC" value={joinCode} onChange={e => setJoinCode(e.target.value)} autoFocus />
                <span style={{ fontSize: '.72rem', color: 'var(--text-4)', marginTop: '4px' }}>Solicita el código a tu profesor o líder de proyecto.</span>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-s btn-ghost" onClick={() => setShowJoin(false)}>Cancelar</button>
                <button type="submit" className="btn-s btn-solid">Unirse</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats clickeables */}
      <div className="stats fu2">
        <div className="stat" onClick={() => onNavigate('projects')} style={{ cursor: 'pointer' }}>
          <div className="stat-l">Proyectos activos</div>
          <div className="stat-v">{state.projects.length}</div>
          <div className="stat-d up">↑ {state.projects.length} total · Ver →</div>
        </div>
        <div className="stat" onClick={() => onNavigate('tasks')} style={{ cursor: 'pointer' }}>
          <div className="stat-l">Tareas pendientes</div>
          <div className="stat-v">{pendingTasks.length}</div>
          <div className="stat-d neutral">{pendingTasks.filter(t => t.pri === 'h').length} de alta prioridad · Ver →</div>
        </div>
        <div className="stat" onClick={() => onNavigate('reports')} style={{ cursor: 'pointer' }}>
          <div className="stat-l">Avance promedio</div>
          <div className="stat-v">{avgProgress}<span style={{ fontSize: '.95rem', color: 'var(--text-3)' }}>%</span></div>
          <div className="stat-d up">↑ Ver dashboard →</div>
        </div>
        <div className="stat" onClick={() => onNavigate('files')} style={{ cursor: 'pointer' }}>
          <div className="stat-l">Archivos subidos</div>
          <div className="stat-v">27</div>
          <div className="stat-d neutral">Abrir gestor →</div>
        </div>
      </div>

      {pendingTasks.filter(t => t.pri === 'h').length > 0 && (
        <div className="announce fu3" onClick={() => onNavigate('tasks')} style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>📌</span>
          <div>
            <h4>Tienes tareas pendientes sin iniciar</h4>
            <p>Revisa tus tareas asignadas — algunas tienen prioridad alta y están bloqueando el avance del sprint actual. <strong>Click para ver →</strong></p>
          </div>
        </div>
      )}

      <div className="content-grid fu4">
        <div className="col-left">
          {/* Módulos funcionales */}
          <div className="card">
            <div className="card-head">
              <span className="card-head-title">Módulos disponibles</span>
              <a href="#" className="card-link" onClick={(e) => { e.preventDefault(); setShowAllModules(!showAllModules); }}>
                {showAllModules ? 'Mostrar menos' : `Explorar todos (${modules.length})`}
              </a>
            </div>
            <div className="mod-grid">
              {displayedModules.map((mod, i) => (
                <div key={i} className="mod-card" onClick={() => onNavigate(mod.target)} style={{ cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--sh)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div className="mod-icon">{mod.icon}</div>
                  <div className="mod-name">{mod.name}</div>
                  <div className="mod-desc">{mod.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Proyectos recientes */}
          <div className="card">
            <div className="card-head">
              <span className="card-head-title">Proyectos recientes</span>
              <a href="#" className="card-link" onClick={(e) => { e.preventDefault(); onNavigate('projects'); }}>Ver todos →</a>
            </div>
            {state.projects.slice(0, 3).map(p => (
              <div key={p.id} className="proj-row" onClick={() => onNavigate('projects')} style={{ cursor: 'pointer' }}>
                <div className="proj-accent" style={{ color: p.statusClass === 'tag-blue' ? 'var(--c-500)' : p.statusClass === 'tag-warn' ? 'var(--warn)' : 'var(--success)' }}></div>
                <div className="proj-info">
                  <div className="proj-name">{p.name}</div>
                  <div className="proj-meta">
                    <span>{p.members.length} participantes</span>
                    <span>{p.updated}</span>
                  </div>
                </div>
                <div className="prog-wrap">
                  <div className="prog-bar">
                    <div className="prog-fill" style={{ width: `${p.progress}%`, color: p.statusClass === 'tag-blue' ? 'var(--c-500)' : p.statusClass === 'tag-warn' ? 'var(--warn)' : 'var(--success)', background: 'currentColor' }}></div>
                  </div>
                  <div className="prog-label">{p.progress}%</div>
                </div>
                <span className={`tag ${p.statusClass}`}>{p.status}</span>
              </div>
            ))}
          </div>

          {/* Tareas */}
          <div className="card">
            <div className="card-head">
              <span className="card-head-title">Mis tareas</span>
              <a href="#" className="card-link" onClick={(e) => { e.preventDefault(); onNavigate('tasks'); }}>Ver todas →</a>
            </div>
            {pendingTasks.slice(0, 4).map(t => (
              <div className="task-item" key={t.id}>
                <div className={`task-cb ${t.done ? 'done' : ''}`} onClick={() => toggleTask(t.id)}>
                  {t.done && <svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div className="task-info">
                  <div className={`task-title ${t.done ? 'done' : ''}`}>{t.title}</div>
                  <div className="task-proj">{t.proj}</div>
                </div>
                <span className={`task-pri pri-${t.pri}`}>{t.pri === 'h' ? 'Alta' : t.pri === 'm' ? 'Media' : 'Baja'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-right">
          {/* Actividad reciente — arriba */}
          <div className="card">
            <div className="card-head"><span className="card-head-title">Actividad reciente</span></div>
            <div style={{ padding: '4px 20px 16px' }}>
              {[
                { time: 'Hace 5 min', text: 'Nueva tarea asignada', icon: '📋' },
                { time: 'Hace 20 min', text: 'Ana S. comentó en server.js', icon: '💬' },
                { time: 'Hace 1 h', text: 'Deadline cercano: documentación', icon: '⏰' },
                { time: 'Hace 3 h', text: 'Calificación Sprint 1: 4.8/5.0', icon: '🎓' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border-lt)' : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: '.9rem' }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.82rem', color: 'var(--text-2)' }}>{a.text}</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--text-4)' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roles clickeable */}
          <div className="card" onClick={() => onNavigate('roles')} style={{ cursor: 'pointer' }}>
            <div className="card-head"><span className="card-head-title">Roles del sistema</span><span className="card-link">Ver todos →</span></div>
            <div className="mini-list">
              <div className="mini-item"><span className="mini-label"><div className="mini-dot" style={{ color: 'var(--c-500)', background: 'currentColor' }}></div>Estudiante <span className="tag tag-blue" style={{ marginLeft: 4 }}>Tú</span></span><span className="mini-val" style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>Vista de tareas</span></div>
              <div className="mini-item"><span className="mini-label"><div className="mini-dot" style={{ color: 'var(--success)', background: 'currentColor' }}></div>Profesor</span><span className="mini-val" style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>Dashboard completo</span></div>
              <div className="mini-item"><span className="mini-label"><div className="mini-dot" style={{ color: 'var(--warn)', background: 'currentColor' }}></div>Administrador</span><span className="mini-val" style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>Gestión global</span></div>
            </div>
          </div>

          {/* Sprint interactivo */}
          <div className="card">
            <div className="card-head">
              <span className="card-head-title">Sprint actual</span>
              <span className="tag tag-blue">Semana 4 de 26</span>
            </div>
            <div className="sprint-body">
              <div className="sprint-label"><span>Progreso del MVP</span><span>{avgProgress}%</span></div>
              <div className="sprint-bar"><div className="sprint-fill" style={{ width: `${avgProgress}%` }}></div></div>
              <div className="sprint-grid">
                <div className="sprint-box" onClick={() => onNavigate('tasks')} style={{ cursor: 'pointer' }}>
                  <div className="sprint-num">{state.tasks.filter(t => t.done).length}</div>
                  <div className="sprint-lbl">Completadas</div>
                </div>
                <div className="sprint-box" onClick={() => onNavigate('tasks')} style={{ cursor: 'pointer' }}>
                  <div className="sprint-num">{pendingTasks.length}</div>
                  <div className="sprint-lbl">Pendientes</div>
                </div>
              </div>
              <div className="sprint-dates"><span>Inicio: Apr 2026</span><span>22 sem. restantes</span><span>Fin: Oct 2026</span></div>
              <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <div style={{ fontSize: '.75rem', color: 'var(--text-4)', marginBottom: '8px', fontWeight: 600 }}>Desglose de prioridad</div>
                {[
                  { label: 'Alta', key: 'h', color: 'var(--danger)' },
                  { label: 'Media', key: 'm', color: 'var(--warn)' },
                  { label: 'Baja', key: 'l', color: 'var(--success)' },
                ].map(p => {
                  const total = state.tasks.filter(t => t.pri === p.key).length;
                  const done = state.tasks.filter(t => t.pri === p.key && t.done).length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div key={p.key} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', color: 'var(--text-3)', marginBottom: '4px' }}>
                        <span>{p.label} ({done}/{total})</span>
                        <span>{pct}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'var(--bg-panel)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: p.color, borderRadius: '2px', transition: 'width .3s' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
