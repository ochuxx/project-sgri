import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const STORAGE_KEY = 'sgri_app_state';

const defaultProjects = [
  { id: 1, name: 'Plataforma de gestión académica — MVP', desc: 'Desarrollo de la interfaz base usando React y Vite con diseño Liquid Glass.', members: ['Tú', 'Ana S.', 'Carlos D.', 'Luis F.', 'Valeria M.'], progress: 38, status: 'Activo', statusClass: 'tag-blue', updated: 'Actualizado hoy' },
  { id: 2, name: 'Módulo de gestión de archivos', desc: 'Implementación del backend para la subida de archivos estilo GitHub.', members: ['Tú', 'Luis F.'], progress: 15, status: 'En curso', statusClass: 'tag-warn', updated: 'Hace 2 días' },
  { id: 3, name: 'Dashboard de avances — Vista profesor', desc: 'Análisis de métricas y exportación de reportes en PDF.', members: ['Tú', 'Valeria M.', 'Jorge P.'], progress: 60, status: 'Avanzado', statusClass: 'tag-green', updated: 'Hace 3 días' }
];

const defaultTasks = [
  { id: 1, title: 'Revisar requerimientos del software', proj: 'Plataforma MVP', pri: 'h', done: false, due: 'Hoy, 18:00', column: 'todo' },
  { id: 2, title: 'Configurar entorno de despliegue', proj: 'Infraestructura', pri: 'm', done: true, due: 'Ayer', column: 'done' },
  { id: 3, title: 'Subir documentación técnica', proj: 'Gestor de archivos', pri: 'l', done: false, due: 'Mañana', column: 'todo' },
  { id: 4, title: 'Revisar informe de reunión', proj: 'Plataforma MVP', pri: 'h', done: false, due: 'En 3 días', column: 'progress' },
  { id: 5, title: 'Diseñar base de datos', proj: 'Plataforma MVP', pri: 'h', done: false, due: 'Viernes', column: 'todo' },
  { id: 6, title: 'Implementar Auth', proj: 'Infraestructura', pri: 'm', done: true, due: 'La semana pasada', column: 'done' }
];

const defaultNotifications = [
  { id: 1, type: 'task', title: 'Nueva tarea asignada', body: 'Prof. Martínez te asignó "Revisar requerimientos del software"', time: 'Hace 5 min', read: false },
  { id: 2, type: 'comment', title: 'Nuevo comentario', body: 'Ana S. comentó en server.js línea 12', time: 'Hace 20 min', read: false },
  { id: 3, type: 'deadline', title: 'Deadline cercano', body: '"Subir documentación técnica" vence mañana', time: 'Hace 1 h', read: false },
  { id: 4, type: 'grade', title: 'Calificación recibida', body: 'Evaluación del Sprint 1: 4.8/5.0', time: 'Hace 3 h', read: true },
  { id: 5, type: 'system', title: 'Actualización del sistema', body: 'Se habilitó la vista Kanban en el módulo de tareas', time: 'Ayer', read: true },
];

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
}

const initialState = {
  projects: loadState()?.projects || defaultProjects,
  tasks: loadState()?.tasks || defaultTasks,
  notifications: loadState()?.notifications || defaultNotifications,
  nextProjectId: loadState()?.nextProjectId || 4,
  nextTaskId: loadState()?.nextTaskId || 7,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PROJECT':
      return { ...state, projects: [{ ...action.payload, id: state.nextProjectId }, ...state.projects], nextProjectId: state.nextProjectId + 1 };
    case 'ADD_TASK':
      return { ...state, tasks: [{ ...action.payload, id: state.nextTaskId }, ...state.tasks], nextTaskId: state.nextTaskId + 1 };
    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload ? { ...t, done: !t.done, column: t.done ? 'todo' : 'done' } : t) };
    case 'MOVE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, column: action.payload.column, done: action.payload.column === 'done' } : t) };
    case 'MARK_NOTIF_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    case 'MARK_ALL_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
