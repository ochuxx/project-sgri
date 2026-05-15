import { useState, useEffect, useRef } from 'react';
import ProfileModal from './ProfileModal';
import CommandPalette from './CommandPalette';
import NotificationsPanel from './NotificationsPanel';
import CreateModal from './CreateModal';
import { useApp } from '../context/AppContext';

// Vistas
import HomeView from './views/HomeView';
import ProjectsView from './views/ProjectsView';
import TasksView from './views/TasksView';
import FilesView from './views/FilesView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import CommentsView from './views/CommentsView';
import ScheduleView from './views/ScheduleView';
import RolesView from './views/RolesView';

export default function Dashboard({ userProfile, onLogout, onUpdateProfile, theme, setTheme }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [navHistory, setNavHistory] = useState([]);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState('task');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sgri_sidebar') === 'collapsed';
  });
  const dropdownRef = useRef(null);
  const notifBtnRef = useRef(null);
  const { state } = useApp();

  const unreadCount = state.notifications.filter(n => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Perfil
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      // Notificaciones
      if (notifOpen && notifBtnRef.current && !notifBtnRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, notifOpen]);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const getInitials = (name) => {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  };

  const avatarContent = userProfile.photo 
    ? <img src={userProfile.photo} alt={userProfile.realName} /> 
    : getInitials(userProfile.realName);

  const navigateTo = (tab) => {
    if (tab === activeTab) return;
    setNavHistory(prev => [...prev, activeTab]);
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const goBack = () => {
    if (navHistory.length === 0) return;
    const prev = navHistory[navHistory.length - 1];
    setNavHistory(h => h.slice(0, -1));
    setActiveTab(prev);
  };

  const openCreate = (type) => {
    setCreateType(type);
    setCreateOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigate={navigateTo} onCreateProject={() => openCreate('project')} onCreateTask={() => openCreate('task')} />;
      case 'projects': return <ProjectsView />;
      case 'tasks': return <TasksView />;
      case 'files': return <FilesView />;
      case 'reports': return <ReportsView />;
      case 'settings': return <SettingsView userProfile={userProfile} theme={theme} setTheme={setTheme} />;
      case 'comments': return <CommentsView />;
      case 'schedule': return <ScheduleView />;
      case 'roles': return <RolesView />;
      default: return (
        <div className="view-placeholder fu1">
          <h2>Vista en construcción</h2>
          <p>Esta sección ({activeTab}) estará disponible en próximas versiones del campus.</p>
        </div>
      );
    }
  };

  return (
    <div id="app" className="page active" style={{ flexDirection: 'column', display: 'flex' }}>
      <nav className="tnav">
        <div className="tnav-brand">
          {/* Hamburger for mobile */}
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menú">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <svg className="tnav-logo" viewBox="0 0 100 110" fill="none">
            <path d="M5,5 H95 V65 Q95,105 50,108 Q5,105 5,65 Z" fill="rgba(0,0,0,0.02)" stroke="#0265a7" strokeWidth="2"/>
            <path d="M8,8 H49 V54 H8 Z" fill="#0265a7"/>
            <path d="M51,8 H92 V54 H51 Z" fill="#0183c0"/>
            <path d="M8,56 H49 V87 Q8,94 8,72 Z" fill="#0265a7"/>
            <path d="M51,56 H92 V72 Q92,94 51,87 Z" fill="#a4cce3"/>
            <line x1="50" y1="8" x2="50" y2="90" stroke="white" strokeWidth="3.5"/>
            <line x1="8" y1="55" x2="92" y2="55" stroke="white" strokeWidth="3.5"/>
          </svg>
          <span className="tnav-name">UNICAFAM</span>
          <div className="tnav-sep"></div>
          <span className="tnav-context">Campus Académico</span>
        </div>

        {/* Botón Atrás + Breadcrumb */}
        <div className="tnav-nav-info">
          {navHistory.length > 0 && (
            <button className="btn-back" onClick={goBack} title="Volver atrás">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            </button>
          )}
          <span className="tnav-breadcrumb">
            {{ home: 'Inicio', projects: 'Proyectos', tasks: 'Tareas', files: 'Archivos', reports: 'Reportes', settings: 'Configuración', comments: 'Comentarios', schedule: 'Cronograma', roles: 'Roles' }[activeTab] || activeTab}
          </span>
        </div>

        <div className="tnav-right">
          <div className="tnav-search" onClick={() => setCmdOpen(true)}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            Buscar en el campus…
            <span className="tnav-kbd">⌘K</span>
          </div>
          <div className="tnav-icon" ref={notifBtnRef} onClick={() => setNotifOpen(!notifOpen)} style={{ position: 'relative' }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            {unreadCount > 0 && <div className="notif-pip"></div>}
            <NotificationsPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>
          <span className="role-pill">Estudiante</span>

          <div className="avatar-wrap" id="avatar-wrap" ref={dropdownRef}>
            <button 
              className={`profile-trigger ${dropdownOpen ? 'open' : ''}`} 
              onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }} 
              aria-label="Menú de perfil"
            >
              <div className={`tnav-avatar ${userProfile.frame !== 'none' ? `avatar-frame-${userProfile.frame}` : ''}`}>
                {avatarContent}
              </div>
              <div className="profile-trigger-info">
                <span className="profile-trigger-name">{userProfile.realName}</span>
                <span className="profile-trigger-user">@{userProfile.username}</span>
              </div>
              <svg className="profile-trigger-caret" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <div className={`profile-dropdown ${dropdownOpen ? 'visible' : ''}`}>
              <div className="pd-header">
                <div className={`pd-avatar-lg ${userProfile.frame !== 'none' ? `avatar-frame-${userProfile.frame}` : ''}`}>
                  {avatarContent}
                </div>
                <div className="pd-info">
                  <div className="pd-name">{userProfile.realName}</div>
                  <div className="pd-username">@{userProfile.username}</div>
                  <div className="pd-role">Estudiante</div>
                </div>
              </div>
              <div className="pd-menu">
                <div className="theme-selector">
                  <div className="ts-label">Tema Visual</div>
                  <div className="ts-grid">
                    <button className={`ts-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')} title="Oscuro">
                      <div className="ts-color" style={{background: '#0b1120'}}></div>
                    </button>
                    <button className={`ts-btn ${theme === 'dim' ? 'active' : ''}`} onClick={() => setTheme('dim')} title="Oscuro Suave">
                      <div className="ts-color" style={{background: '#1e293b'}}></div>
                    </button>
                    <button className={`ts-btn ${theme === 'eye-care' ? 'active' : ''}`} onClick={() => setTheme('eye-care')} title="Cuidado Visual">
                      <div className="ts-color" style={{background: '#fdfbf7'}}></div>
                    </button>
                    <button className={`ts-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')} title="Claro">
                      <div className="ts-color" style={{background: '#f4f7fb'}}></div>
                    </button>
                  </div>
                </div>
                <div className="pd-sep"></div>
                <button className="pd-item" onClick={() => { setDropdownOpen(false); setModalOpen(true); }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Personalizar perfil
                </button>
                <button className="pd-item" onClick={() => { setDropdownOpen(false); setNotifOpen(true); }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  Notificaciones {unreadCount > 0 && <span className="sb-badge" style={{marginLeft: 'auto'}}>{unreadCount}</span>}
                </button>
                <button className="pd-item" onClick={() => { setDropdownOpen(false); navigateTo('settings'); }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Configuración
                </button>
                <div className="pd-sep"></div>
                <button className="pd-item danger" onClick={onLogout}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="app-body">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
        
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button className="sb-toggle" onClick={() => { const next = !sidebarCollapsed; setSidebarCollapsed(next); localStorage.setItem('sgri_sidebar', next ? 'collapsed' : 'expanded'); }} title={sidebarCollapsed ? 'Expandir' : 'Colapsar'}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
          </button>
          <div className="sb-label">Principal</div>
          <div className={`sb-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')} title="Inicio">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="sb-text">Inicio</span>
          </div>
          <div className={`sb-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => navigateTo('projects')} title="Proyectos">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            <span className="sb-text">Proyectos</span> <span className="sb-badge">{state.projects.length}</span>
          </div>
          <div className={`sb-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => navigateTo('tasks')} title="Mis tareas">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-6 9l2 2 4-4"/></svg>
            <span className="sb-text">Mis tareas</span> <span className="sb-badge">{state.tasks.filter(t => !t.done).length}</span>
          </div>
          <div className={`sb-item ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => navigateTo('comments')} title="Comentarios">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span className="sb-text">Comentarios</span> <span className="sb-badge">2</span>
          </div>
          <div className={`sb-item ${activeTab === 'files' ? 'active' : ''}`} onClick={() => navigateTo('files')} title="Archivos">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
            <span className="sb-text">Archivos</span>
          </div>
          <div className="sb-sep"></div>
          <div className="sb-label">Vistas</div>
          <div className={`sb-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => navigateTo('reports')} title="Dashboard avances">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            <span className="sb-text">Dashboard</span>
          </div>
          <div className={`sb-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => navigateTo('schedule')} title="Cronograma">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span className="sb-text">Cronograma</span>
          </div>
          <div className="sb-sep"></div>
          <div className="sb-label">Sistema</div>
          <div className={`sb-item ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => navigateTo('roles')} title="Roles de acceso">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="sb-text">Roles</span>
          </div>
          <div className={`sb-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => navigateTo('settings')} title="Configuración">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="sb-text">Config</span>
          </div>
        </aside>

        <main className="main">
          <div className="view-transition" key={activeTab}>
            {renderActiveView()}
          </div>
        </main>
      </div>
      
      <ProfileModal 
        key={modalOpen ? `open-${userProfile.realName}` : 'closed'}
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        userProfile={userProfile} 
        onSave={onUpdateProfile} 
      />
      <CommandPalette 
        key={cmdOpen ? 'open' : 'closed'}
        isOpen={cmdOpen} 
        onClose={() => setCmdOpen(false)} 
        onNavigate={navigateTo} 
      />
      <CreateModal 
        key={createOpen ? `create-${createType}` : 'closed'}
        isOpen={createOpen} 
        onClose={() => setCreateOpen(false)} 
        type={createType} 
      />
    </div>
  );
}
