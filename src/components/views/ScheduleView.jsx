import { useState } from 'react';

export default function ScheduleView() {
  const [events, setEvents] = useState([
    { id: 1, date: '2026-05-15', dateLabel: '15 Mayo 2026', title: 'Definición de Requerimientos', type: 'Entrega', proj: 'Plataforma MVP', status: 'done', desc: 'Entrega del documento formal de requisitos funcionales y no funcionales.' },
    { id: 2, date: '2026-05-22', dateLabel: '22 Mayo 2026', title: 'Revisión Arquitectura', type: 'Actividad', proj: 'Plataforma MVP', status: 'active', desc: 'Reunión de revisión técnica con el Prof. Martínez sobre la infraestructura de React+Node.' },
    { id: 3, date: '2026-05-30', dateLabel: '30 Mayo 2026', title: 'Primera versión funcional', type: 'Hito', proj: 'Plataforma MVP', status: 'upcoming', desc: 'Despliegue del MVP con Autenticación y Dashboard básico operativo.' },
    { id: 4, date: '2026-06-10', dateLabel: '10 Junio 2026', title: 'Pruebas de Usabilidad', type: 'Actividad', proj: 'UX/UI', status: 'upcoming', desc: 'Pruebas de la interfaz "Liquid Glass" con un grupo de 5 usuarios.' },
    { id: 5, date: '2026-06-25', dateLabel: '25 Junio 2026', title: 'Presentación Final', type: 'Presentación', proj: 'General', status: 'upcoming', desc: 'Defensa del proyecto ante el comité evaluador de la universidad.' }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newEvt, setNewEvt] = useState({ title: '', date: '', type: 'Actividad', proj: '', desc: '' });
  const [filter, setFilter] = useState('all');

  const typeColors = {
    'Entrega': 'var(--c-500)',
    'Hito': 'var(--c-accent)',
    'Presentación': 'var(--warn)',
    'Actividad': 'var(--text-3)'
  };

  const toggleStatus = (id) => {
    setEvents(events.map(e => {
      if (e.id !== id) return e;
      const next = e.status === 'done' ? 'upcoming' : e.status === 'upcoming' ? 'active' : 'done';
      return { ...e, status: next };
    }));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const addEvent = (ev) => {
    ev.preventDefault();
    if (!newEvt.title.trim()) return;
    const dateObj = newEvt.date ? new Date(newEvt.date + 'T12:00:00') : new Date();
    const dateLabel = dateObj.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
    setEvents([...events, {
      id: Date.now(), date: newEvt.date || new Date().toISOString().slice(0, 10),
      dateLabel, title: newEvt.title, type: newEvt.type, proj: newEvt.proj || 'General',
      status: 'upcoming', desc: newEvt.desc || ''
    }].sort((a, b) => a.date.localeCompare(b.date)));
    setShowAdd(false);
    setNewEvt({ title: '', date: '', type: 'Actividad', proj: '', desc: '' });
  };

  const filtered = filter === 'all' ? events : events.filter(e => e.status === filter);

  return (
    <div className="view-schedule fu1" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(100vh - 120px)' }}>
      <div className="ph-top" style={{ marginBottom: '24px' }}>
        <div>
          <div className="ph-title">Cronograma de Actividades</div>
          <div className="ph-sub">Línea de tiempo de entregas, hitos y presentaciones</div>
        </div>
        <div className="btn-row">
          <div className="view-toggle">
            <button className={`vt-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')} style={{fontSize:'.75rem',padding:'6px 12px'}}>Todos</button>
            <button className={`vt-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')} style={{fontSize:'.75rem',padding:'6px 12px'}}>Pendientes</button>
            <button className={`vt-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')} style={{fontSize:'.75rem',padding:'6px 12px'}}>Activos</button>
            <button className={`vt-btn ${filter === 'done' ? 'active' : ''}`} onClick={() => setFilter('done')} style={{fontSize:'.75rem',padding:'6px 12px'}}>Hechos</button>
          </div>
          <button className="btn-s btn-solid" onClick={() => setShowAdd(true)}>Agregar Evento</button>
        </div>
      </div>

      {/* Modal agregar evento */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Nuevo Evento</h3><button className="modal-close" onClick={() => setShowAdd(false)}>✕</button></div>
            <form onSubmit={addEvent} className="modal-form">
              <div className="modal-field"><label>Título</label><input type="text" placeholder="Ej: Entrega del Sprint 2" value={newEvt.title} onChange={e => setNewEvt({...newEvt, title: e.target.value})} autoFocus /></div>
              <div className="modal-row">
                <div className="modal-field" style={{flex:1}}><label>Fecha</label><input type="date" value={newEvt.date} onChange={e => setNewEvt({...newEvt, date: e.target.value})} /></div>
                <div className="modal-field" style={{flex:1}}><label>Tipo</label>
                  <select value={newEvt.type} onChange={e => setNewEvt({...newEvt, type: e.target.value})}>
                    <option>Actividad</option><option>Entrega</option><option>Hito</option><option>Presentación</option>
                  </select>
                </div>
              </div>
              <div className="modal-field"><label>Proyecto</label><input type="text" placeholder="Ej: Plataforma MVP" value={newEvt.proj} onChange={e => setNewEvt({...newEvt, proj: e.target.value})} /></div>
              <div className="modal-field"><label>Descripción</label><textarea placeholder="Describe el evento…" value={newEvt.desc} onChange={e => setNewEvt({...newEvt, desc: e.target.value})} rows="3" /></div>
              <div className="modal-actions"><button type="button" className="btn-s btn-ghost" onClick={() => setShowAdd(false)}>Cancelar</button><button type="submit" className="btn-s btn-solid">Agregar</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ flex: 1, overflowY: 'auto', padding: '30px 40px' }}>
        {filtered.length === 0 && <div style={{textAlign:'center',color:'var(--text-4)',padding:'60px'}}>No hay eventos en esta categoría.</div>}
        <div style={{ position: 'relative' }}>
          {filtered.length > 0 && <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)', zIndex: 0 }}></div>}
          {filtered.map((evt, idx) => (
            <div key={evt.id} style={{ display: 'flex', gap: '24px', marginBottom: idx === filtered.length - 1 ? '0' : '40px', position: 'relative', zIndex: 1, opacity: evt.status === 'done' ? 0.6 : 1 }}>
              <div onClick={() => toggleStatus(evt.id)} title="Click para cambiar estado" style={{
                width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer',
                background: evt.status === 'active' ? 'var(--c-500)' : 'var(--bg-panel)',
                border: `${evt.status === 'done' ? '3px solid var(--text-4)' : evt.status === 'active' ? '3px solid var(--c-accent)' : '3px solid var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: evt.status === 'active' ? '0 0 15px rgba(1,131,192,0.4)' : 'none',
                transition: 'all .2s'
              }}>
                {evt.status === 'done' && <svg width="14" height="14" fill="none" stroke="var(--text-4)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                {evt.status === 'active' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }}></div>}
              </div>
              <div style={{ flex: 1, background: evt.status === 'active' ? 'rgba(1,131,192,0.1)' : 'var(--bg-card)', border: `${evt.status === 'active' ? '1px solid var(--c-500)' : '1px solid var(--border)'}`, padding: '20px', borderRadius: '12px', transition: 'all .2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '.8rem', fontWeight: 700, color: typeColors[evt.type] || 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{evt.type}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-1)' }}>{evt.title}</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text-2)' }}>{evt.dateLabel}</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-4)' }}>{evt.proj}</div>
                    <button onClick={() => deleteEvent(evt.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '.7rem', cursor: 'pointer', padding: '2px 6px' }}>Eliminar</button>
                  </div>
                </div>
                {evt.desc && <p style={{ fontSize: '.9rem', color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>{evt.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
