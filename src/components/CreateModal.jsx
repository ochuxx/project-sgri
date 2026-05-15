import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CreateModal({ isOpen, onClose, type = 'task' }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({ name: '', desc: '', pri: 'm', due: '', proj: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (type === 'project') {
      dispatch({
        type: 'ADD_PROJECT',
        payload: {
          name: form.name,
          desc: form.desc || 'Sin descripción',
          members: ['Tú'],
          progress: 0,
          status: 'Nuevo',
          statusClass: 'tag-blue',
          updated: 'Ahora'
        }
      });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id: Date.now(), type: 'system', title: 'Proyecto creado', body: `"${form.name}" ha sido creado exitosamente`, time: 'Ahora', read: false }
      });
    } else {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          title: form.name,
          proj: form.proj || 'Sin proyecto',
          pri: form.pri,
          done: false,
          due: form.due || 'Sin fecha',
          column: 'todo'
        }
      });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id: Date.now(), type: 'task', title: 'Tarea creada', body: `"${form.name}" añadida a tus pendientes`, time: 'Ahora', read: false }
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{type === 'project' ? 'Nuevo Proyecto' : 'Nueva Tarea'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label>Nombre</label>
            <input
              type="text"
              placeholder={type === 'project' ? 'Nombre del proyecto…' : 'Título de la tarea…'}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>
          <div className="modal-field">
            <label>{type === 'project' ? 'Descripción' : 'Proyecto asociado'}</label>
            {type === 'project' ? (
              <textarea
                placeholder="Describe brevemente el proyecto…"
                value={form.desc}
                onChange={e => setForm({ ...form, desc: e.target.value })}
                rows="3"
              />
            ) : (
              <input
                type="text"
                placeholder="Ej: Plataforma MVP"
                value={form.proj}
                onChange={e => setForm({ ...form, proj: e.target.value })}
              />
            )}
          </div>
          {type === 'task' && (
            <div className="modal-row">
              <div className="modal-field" style={{ flex: 1 }}>
                <label>Prioridad</label>
                <select value={form.pri} onChange={e => setForm({ ...form, pri: e.target.value })}>
                  <option value="h">Alta</option>
                  <option value="m">Media</option>
                  <option value="l">Baja</option>
                </select>
              </div>
              <div className="modal-field" style={{ flex: 1 }}>
                <label>Fecha límite</label>
                <input type="text" placeholder="Ej: Viernes" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} />
              </div>
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="btn-s btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-s btn-solid">
              {type === 'project' ? 'Crear Proyecto' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
