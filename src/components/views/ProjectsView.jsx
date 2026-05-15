import { useApp } from '../../context/AppContext';

export default function ProjectsView() {
  const { state } = useApp();

  return (
    <div className="view-projects fu1">
      <div className="ph-top" style={{ marginBottom: '24px' }}>
        <div>
          <div className="ph-title">Mis Proyectos</div>
          <div className="ph-sub">Gestión de proyectos en los que estás inscrito</div>
        </div>
        <button className="btn-s btn-solid">Unirse a un proyecto</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {state.projects.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-head">
              <span className="card-head-title">{p.name}</span>
            </div>
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '.85rem', color: 'var(--text-3)', marginBottom: '16px', lineHeight: 1.5 }}>
                {p.desc}
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', marginBottom: '8px', color: 'var(--text-2)' }}>
                  <span>Progreso del proyecto</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="prog-bar" style={{ marginBottom: 0 }}>
                  <div className="prog-fill" style={{ width: `${p.progress}%`, background: 'var(--c-500)' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ fontSize: '.75rem', color: 'var(--text-4)' }}>
                  {p.members.join(', ')}
                </div>
                <span className={`tag ${p.statusClass}`}>{p.status}</span>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel)' }}>
              <span style={{ fontSize: '.7rem', color: 'var(--text-4)' }}>{p.updated}</span>
              <button className="btn-s btn-ghost" style={{ padding: '6px 12px', fontSize: '.75rem' }}>Acceder</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
