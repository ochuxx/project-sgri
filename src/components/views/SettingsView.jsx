import { useState, useEffect } from 'react';

export default function SettingsView({ userProfile, theme, setTheme }) {
  const [profileData, setProfileData] = useState({
    name: userProfile?.realName || 'Demo Usuario',
    username: userProfile?.username || 'demo_usuario',
    email: 'demo@est.unicafam.edu.co',
    bio: 'Estudiante de Ingeniería. Enfocado en el desarrollo de plataformas web MVP.'
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('sgri_notif_prefs');
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
    return { email: true, push: false, weeklyReport: true };
  });

  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    localStorage.setItem('sgri_notif_prefs', JSON.stringify(notifications));
  }, [notifications]);

  const handleSave = () => {
    localStorage.setItem('sgri_profile', JSON.stringify(profileData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExport = () => {
    const data = { profile: profileData, theme, notifications };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campus_settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'account', label: 'Cuenta', icon: '🔒' },
    { id: 'appearance', label: 'Apariencia', icon: '🎨' },
    { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { id: 'advanced', label: 'Avanzado', icon: '⚙️' },
  ];

  return (
    <div className="view-settings fu1" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(100vh - 120px)' }}>
      <div className="ph-top" style={{ marginBottom: '24px' }}>
        <div>
          <div className="ph-title">Configuración de la Cuenta</div>
          <div className="ph-sub">Gestiona tu perfil, preferencias visuales y notificaciones</div>
        </div>
        <div className="btn-row">
          {saved && <span style={{color:'var(--success)',fontSize:'.85rem',fontWeight:600}}>✓ Guardado</span>}
          <button className="btn-s btn-solid" onClick={handleSave}>Guardar Cambios</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', gap: '24px', paddingBottom: '40px' }}>
        
        {/* Sidebar de secciones */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          <div className="card" style={{ padding: '8px' }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '8px',
                background: activeSection === s.id ? 'var(--bg-panel)' : 'transparent',
                border: activeSection === s.id ? '1px solid var(--border)' : '1px solid transparent',
                color: activeSection === s.id ? 'var(--text-1)' : 'var(--text-3)',
                fontSize: '.85rem', fontWeight: activeSection === s.id ? 600 : 400, cursor: 'pointer',
                transition: 'all .15s', textAlign: 'left', fontFamily: 'inherit'
              }}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido principal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {activeSection === 'profile' && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-1)', marginBottom: '20px' }}>Perfil Público</h3>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--c-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 'bold', flexShrink: 0 }}>
                  {profileData.name.charAt(0)}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="modal-field">
                    <label>Nombre Completo</label>
                    <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                  </div>
                  <div className="modal-field">
                    <label>Nombre de Usuario (@)</label>
                    <input type="text" value={profileData.username} onChange={(e) => setProfileData({...profileData, username: e.target.value})} />
                  </div>
                  <div className="modal-field">
                    <label>Biografía</label>
                    <textarea value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} rows="3" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-1)', marginBottom: '20px' }}>Datos de la Cuenta</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="modal-field">
                  <label>Correo Electrónico Institucional</label>
                  <input type="email" value={profileData.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  <span style={{ fontSize: '.7rem', color: 'var(--text-4)', marginTop: '4px' }}>El correo institucional no puede ser modificado.</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button className="btn-s btn-ghost" style={{ color: 'var(--warn)', borderColor: 'var(--warn)' }}>Cambiar Contraseña</button>
                  <button className="btn-s btn-ghost" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>Eliminar Cuenta</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-1)', marginBottom: '20px' }}>Apariencia</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: 'dark', name: 'Oscuro', desc: 'Tema original Liquid Glass', color: '#0b1120' },
                  { id: 'dim', name: 'Oscuro Suave', desc: 'Tonos pizarra relajantes', color: '#1e293b' },
                  { id: 'eye-care', name: 'Cuidado Visual', desc: 'Tonos beige cálidos', color: '#fdfbf7' },
                  { id: 'light', name: 'Claro', desc: 'Aspecto blanco limpio', color: '#f4f7fb' },
                ].map(t => (
                  <button key={t.id} onClick={() => setTheme && setTheme(t.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                    background: theme === t.id ? 'rgba(1,131,192,0.1)' : 'var(--bg-panel)',
                    border: theme === t.id ? '1px solid var(--c-500)' : '1px solid var(--border)',
                    borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all .2s'
                  }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: t.color, border: '2px solid var(--border)', flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '.9rem', color: 'var(--text-1)', fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-4)' }}>{t.desc}</div>
                    </div>
                    {theme === t.id && <span style={{color:'var(--success)',fontWeight:700}}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-1)', marginBottom: '20px' }}>Notificaciones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'email', label: 'Alertas por correo electrónico', desc: 'Recibe un correo cuando te asignen tareas o publiquen calificaciones.' },
                  { key: 'push', label: 'Notificaciones Push (Navegador)', desc: 'Alertas emergentes en tu escritorio cuando haya actividad.' },
                  { key: 'weeklyReport', label: 'Reporte semanal de proyectos', desc: 'Resumen de avance de tus proyectos enviado cada lunes.' },
                ].map(n => (
                  <label key={n.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', transition: 'background .15s' }}>
                    <input type="checkbox" checked={notifications[n.key]} onChange={(e) => setNotifications({...notifications, [n.key]: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: 'var(--c-500)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '.9rem', color: 'var(--text-1)', fontWeight: 500 }}>{n.label}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-4)', marginTop: '2px' }}>{n.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'advanced' && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-1)', marginBottom: '20px' }}>Avanzado</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '.9rem', color: 'var(--text-1)', fontWeight: 500 }}>Exportar configuración</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-4)', marginTop: '2px' }}>Descarga un JSON con tu perfil y preferencias.</div>
                  </div>
                  <button className="btn-s btn-ghost" onClick={handleExport}>Descargar JSON</button>
                </div>
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '.9rem', color: 'var(--text-1)', fontWeight: 500 }}>Limpiar datos locales</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-4)', marginTop: '2px' }}>Borra toda la persistencia de la app en este navegador.</div>
                  </div>
                  <button className="btn-s btn-ghost" style={{color:'var(--danger)',borderColor:'var(--danger)'}} onClick={() => { localStorage.clear(); window.location.reload(); }}>Limpiar</button>
                </div>
                <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '.9rem', color: 'var(--text-1)', fontWeight: 500, marginBottom: '8px' }}>Información del sistema</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text-3)', lineHeight: 1.8 }}>
                    Plataforma: Campus Académico v1.0<br />
                    Motor: React + Vite<br />
                    Tema: Liquid Glass ({theme})<br />
                    Almacenamiento: localStorage ({(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
