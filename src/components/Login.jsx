import { useState } from 'react';

export default function Login({ onLogin }) {
  const [realName, setRealName] = useState('Demo Usuario');
  const [username, setUsername] = useState('demo_usuario');
  const [loading, setLoading] = useState(false);

  const doLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    const finalRealName = realName.trim() || 'Demo Usuario';
    const finalUsername = username.trim().startsWith('@') ? username.trim().slice(1) : username.trim() || 'demo_usuario';

    setTimeout(() => {
      onLogin({ realName: finalRealName, username: finalUsername, photo: null, frame: 'none' });
    }, 1300);
  };

  return (
    <div id="login" className="page active" style={{ flexDirection: 'column', display: 'flex' }}>
      <div className="login-topbar"></div>
      <div className="login-body">
        <div className="login-card">
          <div className="login-logo-wrap">
            <div className="login-logo-box">
              <svg width="42" height="46" viewBox="0 0 100 110" fill="none">
                <path d="M5,5 H95 V65 Q95,105 50,108 Q5,105 5,65 Z" fill="rgba(0,0,0,0.02)" stroke="#0265a7" strokeWidth="2"/>
                <path d="M8,8 H49 V54 H8 Z" fill="#0265a7"/>
                <path d="M51,8 H92 V54 H51 Z" fill="#0183c0"/>
                <path d="M8,56 H49 V87 Q8,94 8,72 Z" fill="#0265a7"/>
                <path d="M51,56 H92 V72 Q92,94 51,87 Z" fill="#a4cce3"/>
                <line x1="50" y1="8" x2="50" y2="90" stroke="white" strokeWidth="3.5"/>
                <line x1="8" y1="55" x2="92" y2="55" stroke="white" strokeWidth="3.5"/>
              </svg>
            </div>
            <div className="login-title">UNICAFAM</div>
            <div className="login-subtitle">Campus Académico · MVP v0.1</div>
          </div>

          <div className="login-hint" style={{ marginBottom: 20 }}>
            <span style={{ fontSize: '.9rem', flexShrink: 0, marginTop: 1 }}>💡</span>
            <p><strong>Cuenta de prueba:</strong><br/>Correo: <code>demo@unicafam.edu.co</code> · Contraseña: <code>Demo2026</code></p>
          </div>

          <form className="login-form" onSubmit={doLogin}>
            <div className="fgroup">
              <label className="flabel">Nombre completo</label>
              <input 
                className="finput" 
                type="text" 
                placeholder="Ej: María Rodríguez" 
                value={realName} 
                onChange={(e) => setRealName(e.target.value)}
                required
              />
            </div>
            <div className="fgroup">
              <label className="flabel">Nombre de usuario</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', fontSize: '.9rem', pointerEvents: 'none' }}>@</span>
                <input 
                  className="finput" 
                  type="text" 
                  placeholder="mi_usuario" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: 26 }} 
                  required
                />
              </div>
              <span style={{ fontSize: '.7rem', color: 'var(--text-4)' }}>Solo letras, números y guiones bajos</span>
            </div>
            <div className="fgroup">
              <label className="flabel">Correo institucional</label>
              <input className="finput" type="email" placeholder="usuario@unicafam.edu.co" defaultValue="demo@unicafam.edu.co"/>
            </div>
            <div className="fgroup">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="flabel" style={{ margin: 0 }}>Contraseña</span>
                <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
              </div>
              <input className="finput" type="password" placeholder="••••••••" defaultValue="Demo2026"/>
            </div>
            <button type="submit" className="btn-login" style={{ marginTop: 4 }} disabled={loading}>
              <span style={{ display: loading ? 'none' : 'block' }}>Ingresar al campus</span>
              <div className="btn-spinner" style={{ display: loading ? 'block' : 'none' }}></div>
            </button>
          </form>

          <div className="divider-line" style={{ margin: '18px 0' }}><span>o continúa con</span></div>
          <button className="sso-btn" style={{ marginBottom: 10 }}>
            <svg width="15" height="15" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            Cuenta de Microsoft Institucional
          </button>
          <button className="sso-btn">
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Cuenta de Google Institucional
          </button>
          <p className="login-footer">© 2026 UNICAFAM · Proyecto open source</p>
        </div>
      </div>
    </div>
  );
}
