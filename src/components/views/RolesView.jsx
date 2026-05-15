import { useState } from 'react';

export default function RolesView() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'Estudiante' });
  const [users, setUsers] = useState([
    { id: 1, name: 'Alejandro Vargas', email: 'a.vargas@unicafam.edu.co', role: 'Administrador', status: 'Activo' },
    { id: 2, name: 'Prof. Carlos Martínez', email: 'cmartinez@unicafam.edu.co', role: 'Profesor', status: 'Activo' },
    { id: 3, name: 'Prof. Laura Silva', email: 'lsilva@unicafam.edu.co', role: 'Profesor', status: 'Activo' },
    { id: 4, name: 'Ana Sofía Rojas', email: 'asrojas@est.unicafam.edu.co', role: 'Estudiante', status: 'Activo' },
    { id: 5, name: 'Carlos Díaz', email: 'cdiaz@est.unicafam.edu.co', role: 'Estudiante', status: 'Inactivo' },
    { id: 6, name: 'Valeria Mendoza', email: 'vmendoza@est.unicafam.edu.co', role: 'Estudiante', status: 'Activo' }
  ]);

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'Todos' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getRoleStyle = (role) => {
    switch(role) {
      case 'Administrador': return { bg: 'rgba(170,59,255,0.15)', color: 'var(--c-accent)', border: '1px solid rgba(170,59,255,0.3)' };
      case 'Profesor': return { bg: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' };
      default: return { bg: 'rgba(59,130,246,0.15)', color: 'var(--c-accent)', border: '1px solid rgba(59,130,246,0.3)' };
    }
  };

  const changeRole = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Activo' ? 'Inactivo' : 'Activo' } : u));
  };

  const removeUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteData.name.trim() || !inviteData.email.trim()) return;
    setUsers([...users, { id: Date.now(), name: inviteData.name, email: inviteData.email, role: inviteData.role, status: 'Activo' }]);
    setShowInvite(false);
    setInviteData({ name: '', email: '', role: 'Estudiante' });
  };

  const exportCSV = () => {
    const header = 'Nombre,Email,Rol,Estado\n';
    const rows = users.map(u => `${u.name},${u.email},${u.role},${u.status}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_campus_academico.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="view-roles fu1" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(100vh - 120px)' }}>
      <div className="ph-top" style={{ marginBottom: '24px' }}>
        <div>
          <div className="ph-title">Roles de Acceso y Usuarios</div>
          <div className="ph-sub">Gestiona los permisos y listado de participantes de la plataforma</div>
        </div>
        <button className="btn-s btn-solid" onClick={() => setShowInvite(true)}>Invitar Usuario</button>
      </div>

      {/* Modal Invitar */}
      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Invitar Usuario</h3><button className="modal-close" onClick={() => setShowInvite(false)}>✕</button></div>
            <form onSubmit={handleInvite} className="modal-form">
              <div className="modal-field"><label>Nombre completo</label><input type="text" placeholder="Ej: María López" value={inviteData.name} onChange={e => setInviteData({...inviteData, name: e.target.value})} autoFocus /></div>
              <div className="modal-field"><label>Correo electrónico</label><input type="email" placeholder="usuario@unicafam.edu.co" value={inviteData.email} onChange={e => setInviteData({...inviteData, email: e.target.value})} /></div>
              <div className="modal-field"><label>Rol</label>
                <select value={inviteData.role} onChange={e => setInviteData({...inviteData, role: e.target.value})}>
                  <option>Estudiante</option><option>Profesor</option><option>Administrador</option>
                </select>
              </div>
              <div className="modal-actions"><button type="button" className="btn-s btn-ghost" onClick={() => setShowInvite(false)}>Cancelar</button><button type="submit" className="btn-s btn-solid">Invitar</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-4)' }} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 16px 8px 36px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-panel)', color: 'var(--text-1)', fontSize: '.85rem', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="view-toggle">
              {['Todos', 'Estudiante', 'Profesor', 'Administrador'].map(r => (
                <button key={r} className={`vt-btn ${roleFilter === r ? 'active' : ''}`} onClick={() => setRoleFilter(r)} style={{fontSize:'.72rem',padding:'5px 10px'}}>{r}</button>
              ))}
            </div>
            <button className="btn-s btn-ghost" onClick={exportCSV}>Exportar CSV</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '.75rem', color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase' }}>Usuario</th>
                <th style={{ padding: '16px 24px', fontSize: '.75rem', color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase' }}>Rol de Acceso</th>
                <th style={{ padding: '16px 24px', fontSize: '.75rem', color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase' }}>Estado</th>
                <th style={{ padding: '16px 24px', fontSize: '.75rem', color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => {
                const rs = getRoleStyle(u.role);
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-lt)', transition: 'background .15s' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--c-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '.9rem' }}>{u.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text-1)' }}>{u.name}</div>
                          <div style={{ fontSize: '.75rem', color: 'var(--text-4)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} style={{ background: rs.bg, color: rs.color, border: rs.border, padding: '4px 10px', borderRadius: '20px', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                        <option value="Estudiante">Estudiante</option>
                        <option value="Profesor">Profesor</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <button onClick={() => toggleStatus(u.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.8rem', color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.status === 'Activo' ? 'var(--success)' : 'var(--text-4)', transition: 'background .2s' }}></div>
                        {u.status}
                      </button>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button onClick={() => removeUser(u.id)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.75rem', padding: '4px 8px' }}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr><td colSpan="4" style={{padding:'40px',textAlign:'center',color:'var(--text-4)'}}>No se encontraron usuarios.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
