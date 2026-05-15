import { useRef } from 'react';

export default function ReportsView() {
  const printRef = useRef(null);

  const reports = [
    { id: 1, title: 'Evaluación del Sprint 1', date: '25 May 2026', author: 'Prof. Martínez', grade: '4.8/5.0', comments: 'Excelente progreso en la arquitectura base. La documentación está muy completa.', status: 'Excelente' },
    { id: 2, title: 'Revisión de Requerimientos', date: '10 May 2026', author: 'Prof. Silva', grade: '4.0/5.0', comments: 'Falta detallar más los casos de uso para los roles de administrador.', status: 'Aprobado' },
    { id: 3, title: 'Feedback de Diseño UI', date: '02 May 2026', author: 'Prof. Gómez', grade: '-', comments: 'El esquema Liquid Glass me parece innovador, pero cuiden los contrastes para la accesibilidad.', status: 'Revisión' }
  ];

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reportes - Campus Académico UNICAFAM</title>
          <style>
            body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #1a1a1a; }
            h1 { font-size: 1.5rem; margin-bottom: 8px; }
            .subtitle { color: #666; font-size: .9rem; margin-bottom: 32px; }
            .report { border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
            .report-head { display: flex; justify-content: space-between; margin-bottom: 12px; }
            .report-title { font-weight: 600; font-size: 1.05rem; }
            .report-meta { color: #888; font-size: .8rem; margin-top: 4px; }
            .grade { font-size: 1.2rem; font-weight: 700; color: #22c55e; }
            .status { display: inline-block; padding: 4px 10px; border-radius: 50px; font-size: .75rem; font-weight: 600; background: #f0f0f0; }
            .comment-box { background: #f8f9fa; padding: 14px; border-radius: 8px; border-left: 3px solid #0183c0; margin-top: 12px; }
            .comment-box p { font-size: .85rem; line-height: 1.6; color: #333; }
            .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: .75rem; }
          </style>
        </head>
        <body>
          <h1>📋 Reportes y Evaluaciones</h1>
          <div class="subtitle">Campus Académico UNICAFAM · Generado el ${new Date().toLocaleDateString('es-CO')}</div>
          ${reports.map(r => `
            <div class="report">
              <div class="report-head">
                <div>
                  <div class="report-title">${r.title}</div>
                  <div class="report-meta">Por <strong>${r.author}</strong> el ${r.date}</div>
                </div>
                <div style="text-align: right;">
                  ${r.grade !== '-' ? `<div class="grade">${r.grade}</div>` : ''}
                  <span class="status">${r.status}</span>
                </div>
              </div>
              <div class="comment-box"><p>"${r.comments}"</p></div>
            </div>
          `).join('')}
          <div class="footer">© 2026 UNICAFAM · Campus Académico</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="view-reports fu1" ref={printRef}>
      <div className="ph-top" style={{ marginBottom: '24px' }}>
        <div>
          <div className="ph-title">Reportes y Evaluaciones</div>
          <div className="ph-sub">Retroalimentación oficial y calificaciones de tus profesores</div>
        </div>
        <button className="btn-s btn-ghost" onClick={handlePrint}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: 4, verticalAlign: '-2px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Exportar PDF
        </button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {reports.map(r => (
          <div key={r.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-1)' }}>{r.title}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-4)', marginTop: '4px' }}>
                  Por <strong>{r.author}</strong> el {r.date}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                {r.grade !== '-' && <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>{r.grade}</div>}
                <span className={`tag ${r.status === 'Excelente' ? 'tag-green' : r.status === 'Revisión' ? 'tag-warn' : 'tag-blue'}`}>{r.status}</span>
              </div>
            </div>
            
            <div style={{ background: 'var(--bg-panel)', padding: '16px', borderRadius: '12px', borderLeft: '3px solid var(--c-500)' }}>
              <p style={{ fontSize: '.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>"{r.comments}"</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button className="btn-s btn-ghost">Ver rúbrica</button>
              <button className="btn-s btn-ghost">Añadir comentario privado</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
