import { useState } from 'react';

export default function CommentsView() {
  const [threads, setThreads] = useState([
    {
      id: 1, title: 'Auth en server.js', file: 'server.js', line: 'L15-L18', contextType: 'code',
      contextSnippet: `app.post('/api/login', (req, res) => {\n  // TODO: Implementar JWT\n  res.json({ token: 'mock-token' });\n});`,
      comments: [
        { id: 1, author: 'Ana S.', role: 'Estudiante', avatar: 'A', time: 'Hace 2 horas', content: '¿Aquí vamos a usar JWT o Firebase Auth?' },
        { id: 2, author: 'Prof. Silva', role: 'Profesor', avatar: 'S', time: 'Hace 1 hora', content: 'Implementen JWT propio para entender el ciclo completo de vida del token.' }
      ]
    },
    {
      id: 2, title: 'Contraste en Sidebar', file: 'style.css', line: 'L260-L265', contextType: 'code',
      contextSnippet: `.sidebar {\n  background: rgba(15, 23, 42, 0.3);\n  border-right: 1px solid var(--border);\n}`,
      comments: [
        { id: 1, author: 'Prof. Gómez', role: 'Profesor', avatar: 'G', time: 'Hace 1 día', content: 'Ese rgba() estático hace que la barra se vea muy oscura en el tema Beige. Hay que usar variables CSS.' },
        { id: 2, author: 'Carlos D.', role: 'Estudiante', avatar: 'C', time: 'Hace 5 horas', content: 'Corregido. Lo cambié a var(--bg-panel).' }
      ]
    },
    {
      id: 3, title: 'Requisitos de Roles', file: 'Doc_Requisitos_v2.docx', line: 'Sección 3.1', contextType: 'text',
      contextSnippet: `"El administrador del sistema podrá asignar roles a los usuarios, pero no podrá ver las calificaciones de los estudiantes a menos que también tenga rol de profesor."`,
      comments: [
        { id: 1, author: 'Valeria M.', role: 'Estudiante', avatar: 'V', time: 'Hace 2 días', content: 'Creo que este requerimiento es contradictorio con la sección 4. ¿Lo revisamos en la próxima reunión?' }
      ]
    }
  ]);

  const [activeThread, setActiveThread] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', file: '', line: '', snippet: '', type: 'code' });

  const currentThread = threads.find(t => t.id === activeThread);

  const handlePost = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentThread) return;
    const comment = {
      id: Date.now(),
      author: 'Tú',
      role: 'Estudiante',
      avatar: 'T',
      time: 'Ahora',
      content: newComment.trim()
    };
    setThreads(threads.map(t =>
      t.id === activeThread ? { ...t, comments: [...t.comments, comment] } : t
    ));
    setNewComment('');
  };

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newThread.title.trim()) return;
    const thread = {
      id: Date.now(),
      title: newThread.title,
      file: newThread.file || 'Sin archivo',
      line: newThread.line || '-',
      contextType: newThread.type,
      contextSnippet: newThread.snippet || 'Sin contexto adjunto.',
      comments: []
    };
    setThreads([thread, ...threads]);
    setActiveThread(thread.id);
    setShowNewThread(false);
    setNewThread({ title: '', file: '', line: '', snippet: '', type: 'code' });
  };

  return (
    <div className="view-comments fu1" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(100vh - 120px)' }}>
      <div className="ph-top" style={{ marginBottom: '20px' }}>
        <div>
          <div className="ph-title">Revisión Contextual y Comentarios</div>
          <div className="ph-sub">Comenta sobre archivos específicos, hojas de estilo o documentos</div>
        </div>
        <button className="btn-s btn-solid" onClick={() => setShowNewThread(true)}>Nuevo Hilo</button>
      </div>

      {/* Modal Nuevo Hilo */}
      {showNewThread && (
        <div className="modal-overlay" onClick={() => setShowNewThread(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nuevo Hilo de Revisión</h3>
              <button className="modal-close" onClick={() => setShowNewThread(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateThread} className="modal-form">
              <div className="modal-field">
                <label>Título del hilo</label>
                <input type="text" placeholder="Ej: Bug en autenticación" value={newThread.title} onChange={e => setNewThread({...newThread, title: e.target.value})} autoFocus />
              </div>
              <div className="modal-row">
                <div className="modal-field" style={{flex:1}}>
                  <label>Archivo</label>
                  <input type="text" placeholder="Ej: server.js" value={newThread.file} onChange={e => setNewThread({...newThread, file: e.target.value})} />
                </div>
                <div className="modal-field" style={{flex:1}}>
                  <label>Línea / Sección</label>
                  <input type="text" placeholder="Ej: L15-L18" value={newThread.line} onChange={e => setNewThread({...newThread, line: e.target.value})} />
                </div>
              </div>
              <div className="modal-field">
                <label>Tipo de contexto</label>
                <select value={newThread.type} onChange={e => setNewThread({...newThread, type: e.target.value})}>
                  <option value="code">Código fuente</option>
                  <option value="text">Texto / Documento</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Fragmento de contexto</label>
                <textarea placeholder="Pega aquí el código o texto relevante…" value={newThread.snippet} onChange={e => setNewThread({...newThread, snippet: e.target.value})} rows="4" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-s btn-ghost" onClick={() => setShowNewThread(false)}>Cancelar</button>
                <button type="submit" className="btn-s btn-solid">Crear Hilo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Panel Izquierdo: Lista de Hilos */}
        <div style={{ width: '320px', borderRight: '1px solid var(--border)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-4)' }}>
            Hilos Abiertos ({threads.length})
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {threads.map(t => (
              <div
                key={t.id}
                onClick={() => setActiveThread(t.id)}
                style={{
                  padding: '16px', borderBottom: '1px solid var(--border-lt)', cursor: 'pointer',
                  background: activeThread === t.id ? 'rgba(1,131,192,0.1)' : 'transparent',
                  borderLeft: activeThread === t.id ? '3px solid var(--c-500)' : '3px solid transparent',
                  transition: 'background .15s'
                }}
              >
                <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: '4px' }}>{t.title}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-3)' }}>
                  📄 {t.file} <span style={{ color: 'var(--text-4)' }}>• {t.line}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', alignItems: 'center' }}>
                  {t.comments.slice(0, 4).map(c => (
                    <div key={c.id} style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--c-600)', color: '#fff', fontSize: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.avatar}
                    </div>
                  ))}
                  <span style={{ fontSize: '.75rem', color: 'var(--text-4)', marginLeft: '4px' }}>{t.comments.length} msgs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Detalle */}
        {currentThread ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span className="tag tag-blue">Resolviendo</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-1)' }}>{currentThread.title}</span>
              </div>
              <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '8px 16px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', fontSize: '.8rem', color: 'var(--text-3)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{currentThread.file}</span>
                  <span>{currentThread.line}</span>
                </div>
                <div style={{ padding: '16px', overflowX: 'auto' }}>
                  {currentThread.contextType === 'code' ? (
                    <pre style={{ margin: 0, fontFamily: "'Fira Code', monospace", fontSize: '.85rem', color: 'var(--text-2)' }}>
                      <code>{currentThread.contextSnippet}</code>
                    </pre>
                  ) : (
                    <div style={{ fontSize: '.9rem', fontStyle: 'italic', color: 'var(--text-2)', borderLeft: '3px solid var(--c-accent)', paddingLeft: '12px' }}>
                      {currentThread.contextSnippet}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {currentThread.comments.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-4)', padding: '40px' }}>Sé el primero en comentar en este hilo.</div>
              )}
              {currentThread.comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', background: c.role === 'Profesor' ? 'var(--c-700)' : 'var(--c-500)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', flexShrink: 0
                  }}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text-1)' }}>{c.author}</span>
                      <span style={{ fontSize: '.7rem', color: c.role === 'Profesor' ? 'var(--success)' : 'var(--text-4)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '4px' }}>{c.role}</span>
                      <span style={{ fontSize: '.75rem', color: 'var(--text-4)', marginLeft: 'auto' }}>{c.time}</span>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', borderTopLeftRadius: '2px' }}>
                      <p style={{ fontSize: '.9rem', color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{c.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
              <form onSubmit={handlePost} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text" placeholder="Responde a este hilo..."
                    value={newComment} onChange={(e) => setNewComment(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: '12px 48px 12px 20px', fontSize: '.9rem', color: 'var(--text-1)', outline: 'none' }}
                  />
                  <button type="submit" style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', width: '32px', borderRadius: '50%', background: 'var(--c-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19V5m0 0l-7 7m7-7l7 7"/></svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)' }}>
            Selecciona un hilo para ver la conversación
          </div>
        )}
      </div>
    </div>
  );
}
