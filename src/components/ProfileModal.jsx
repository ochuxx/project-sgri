import { useState, useRef } from 'react';

export default function ProfileModal({ isOpen, onClose, userProfile, onSave }) {
  const [realName, setRealName] = useState(userProfile.realName);
  const [username, setUsername] = useState(userProfile.username);
  const [frame, setFrame] = useState(userProfile.frame);
  const [photo, setPhoto] = useState(userProfile.photo);
  const fileInputRef = useRef(null);

  // State is now initialized from props and reset via 'key' in parent

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const saveProfile = () => {
    const finalRealName = realName.trim() || 'Demo Usuario';
    const finalUsername = username.trim().startsWith('@') ? username.trim().slice(1) : username.trim() || 'demo_usuario';
    onSave({ realName: finalRealName, username: finalUsername, frame, photo });
    onClose();
  };

  const getInitials = (name) => {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  };

  return (
    <div className={`modal-backdrop ${isOpen ? 'visible' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">✏️ Personalizar perfil</span>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="modal-body">
          {/* Foto */}
          <div className="photo-section">
            <div className="photo-avatar" onClick={() => fileInputRef.current?.click()}>
              <div className="photo-avatar-inner">
                {photo ? <img src={photo} alt="Avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(realName)}
              </div>
              <div className="photo-overlay">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>
                <span>Cambiar</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload}/>
            <div className="photo-btn-row">
              <button className="photo-btn primary" onClick={() => fileInputRef.current?.click()}>📷 Subir foto</button>
              <button className="photo-btn" onClick={removePhoto}>Eliminar</button>
            </div>
          </div>
          {/* Marcos */}
          <div>
            <div className="section-label" style={{ marginBottom: 10 }}>Marco de perfil</div>
            <div className="frames-grid">
              {['none', 'azul', 'verde', 'dorado', 'morado', 'rojo', 'gradiente'].map(f => (
                <div 
                  key={f} 
                  className={`frame-opt ${frame === f ? 'active' : ''}`} 
                  onClick={() => setFrame(f)}
                >
                  <div className={`frame-preview ${f} ${f !== 'none' ? `avatar-frame-${f}` : ''}`}>
                    {f === 'none' && 'None'}
                  </div>
                  <span className="frame-label">{f === 'none' ? 'Ninguno' : f.charAt(0).toUpperCase() + f.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Campos */}
          <div className="profile-fields">
            <div className="pf-group">
              <label className="pf-label" htmlFor="modal-inp-realname">Nombre completo</label>
              <input id="modal-inp-realname" className="pf-input" type="text" placeholder="Ej: María Rodríguez" value={realName} onChange={e => setRealName(e.target.value)} />
              <span className="pf-hint">Tu identidad principal en el campus.</span>
            </div>
            <div className="pf-group">
              <label className="pf-label" htmlFor="modal-inp-username">Nombre de usuario</label>
              <div className="pf-prefix">
                <span>@</span>
                <input id="modal-inp-username" className="pf-input" type="text" placeholder="mi_usuario" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <span className="pf-hint">Se muestra debajo del nombre real. Solo letras, números y _</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={saveProfile}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
