import { useState } from 'react';

export default function FilesView() {
  const [archivoActivo, setArchivoActivo] = useState('servidor.js');
  const [pestañas, setPestañas] = useState(['servidor.js']);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [contenidoEdicion, setContenidoEdicion] = useState('');
  const [mostrarVersiones, setMostrarVersiones] = useState(false);

  const [archivos, setArchivos] = useState([
    { nombre: 'src', tipo: 'carpeta', abierta: true, hijos: [
      { nombre: 'componentes', tipo: 'carpeta', abierta: false, hijos: [
        { nombre: 'Panel.jsx', tipo: 'archivo', lenguaje: 'react' },
        { nombre: 'Ingreso.jsx', tipo: 'archivo', lenguaje: 'react' },
      ] },
      { nombre: 'App.jsx', tipo: 'archivo', lenguaje: 'react' },
      { nombre: 'estilos.css', tipo: 'archivo', lenguaje: 'css' },
    ]},
    { nombre: 'servidor.js', tipo: 'archivo', lenguaje: 'javascript' },
    { nombre: 'paquete.json', tipo: 'archivo', lenguaje: 'json' },
    { nombre: 'LEEME.md', tipo: 'archivo', lenguaje: 'markdown' }
  ]);

  // Contenido de cada archivo
  const [contenidos, setContenidos] = useState({
    'servidor.js': `const express = require('express');
const aplicacion = express();
const puerto = process.env.PUERTO || 3000;

// Configuración de middlewares
aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));

// Rutas base de la API
aplicacion.get('/api/estado', (req, res) => {
  res.json({ estado: 'en línea', version: '1.0.0' });
});

// Inicialización del servidor
aplicacion.listen(puerto, () => {
  console.log(\`Servidor corriendo en http://localhost:\${puerto}\`);
});`,
    'paquete.json': `{
  "nombre": "sgri-backend",
  "version": "1.0.0",
  "descripcion": "Servidor para plataforma MVP",
  "principal": "servidor.js",
  "scripts": {
    "iniciar": "node servidor.js",
    "desarrollo": "nodemon servidor.js"
  },
  "dependencias": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}`,
    'App.jsx': `import React from 'react';
import Panel from './Panel';

export default function App() {
  return (
    <div className="contenedor-app">
      <Panel />
    </div>
  );
}`,
    'Panel.jsx': `import React from 'react';
import VistaInicio from './vistas/VistaInicio';

export default function Panel() {
  const [pestañaActiva, setPestañaActiva] = useState('inicio');
  
  return (
    <div className="panel">
      <nav className="barra-superior">...</nav>
      <aside className="barra-lateral">...</aside>
      <main>{renderizarVista()}</main>
    </div>
  );
}`,
    'Ingreso.jsx': `import React, { useState } from 'react';

export default function Ingreso({ alIngresar }) {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  
  return (
    <div className="pagina-ingreso">
      <form onSubmit={manejarEnvio}>
        <input value={correo} onChange={e => setCorreo(e.target.value)} placeholder="Correo electrónico" />
        <input type="password" value={clave} onChange={e => setClave(e.target.value)} placeholder="Contraseña" />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}`,
    'estilos.css': `:root {
  --fondo-principal: #0b1120;
  --color-texto: #ffffff;
}
body {
  background: var(--fondo-principal);
  color: var(--color-texto);
  font-family: 'Inter', sans-serif;
}`,
    'LEEME.md': `# Plataforma de Gestión Académica

MVP del gestor de proyectos y tareas para estudiantes y profesores de UNICAFAM.

## Instalación
1. Clona el repositorio
2. Ejecuta \`npm install\`
3. Inicia el servidor con \`npm run desarrollo\`

## Tecnologías
- React + Vite
- Node.js + Express
- Diseño Liquid Glass

## Equipo
- Alejandro Vargas — Desarrollador principal
`
  });

  // Historial de versiones por archivo
  const [versiones, setVersiones] = useState({});

  const guardarVersion = (nombre, contenidoAnterior) => {
    const ahora = new Date();
    const etiqueta = ahora.toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const nuevaVersion = {
      id: Date.now(),
      fecha: etiqueta,
      contenido: contenidoAnterior,
      tamaño: contenidoAnterior.length
    };
    setVersiones(prev => ({
      ...prev,
      [nombre]: [...(prev[nombre] || []), nuevaVersion]
    }));
  };

  const restaurarVersion = (nombre, contenidoVersion) => {
    guardarVersion(nombre, contenidos[nombre]); // guardar actual antes de restaurar
    setContenidos({ ...contenidos, [nombre]: contenidoVersion });
    setMostrarVersiones(false);
    setModoEdicion(false);
  };

  const alternarCarpeta = (items, nombreObjetivo) => {
    return items.map(item => {
      if (item.nombre === nombreObjetivo && item.tipo === 'carpeta') {
        return { ...item, abierta: !item.abierta };
      }
      if (item.hijos) {
        return { ...item, hijos: alternarCarpeta(item.hijos, nombreObjetivo) };
      }
      return item;
    });
  };

  const abrirArchivo = (nombre) => {
    setArchivoActivo(nombre);
    if (!pestañas.includes(nombre)) setPestañas([...pestañas, nombre]);
    setModoEdicion(false);
    setMostrarVersiones(false);
  };

  const cerrarPestaña = (nombre, e) => {
    e.stopPropagation();
    const nuevas = pestañas.filter(t => t !== nombre);
    setPestañas(nuevas);
    if (archivoActivo === nombre) setArchivoActivo(nuevas[nuevas.length - 1] || '');
    setModoEdicion(false);
    setMostrarVersiones(false);
  };

  const iniciarEdicion = () => {
    setContenidoEdicion(contenidos[archivoActivo] || '');
    setModoEdicion(true);
  };

  const guardarEdicion = () => {
    guardarVersion(archivoActivo, contenidos[archivoActivo]); // guardar versión anterior
    setContenidos({ ...contenidos, [archivoActivo]: contenidoEdicion });
    setModoEdicion(false);
  };

  const crearArchivo = (e) => {
    e.preventDefault();
    if (!nombreNuevo.trim()) return;
    const nombre = nombreNuevo.trim();
    setArchivos([...archivos, { nombre, tipo: 'archivo', lenguaje: 'texto' }]);
    setContenidos({ ...contenidos, [nombre]: `// ${nombre} — Archivo creado el ${new Date().toLocaleDateString('es-CO')}\n` });
    abrirArchivo(nombre);
    setMostrarCrear(false);
    setNombreNuevo('');
  };

  const obtenerNumLineas = (codigo) => {
    const lineas = (codigo || '').split('\n');
    return lineas.map((_, i) => i + 1).join('\n');
  };

  const versionesDelArchivo = versiones[archivoActivo] || [];

  const renderizarArbol = (items, profundidad = 0) => {
    return items.map((item, i) => (
      <div key={`${item.nombre}-${i}`}>
        <div
          className={`file-tree-item ${item.tipo === 'archivo' && archivoActivo === item.nombre ? 'active' : ''}`}
          style={{ paddingLeft: `${profundidad * 14 + 12}px` }}
          onClick={() => item.tipo === 'carpeta' ? setArchivos(alternarCarpeta(archivos, item.nombre)) : abrirArchivo(item.nombre)}
        >
          {item.tipo === 'carpeta' ? (
            <svg width="14" height="14" fill="var(--c-accent)" viewBox="0 0 24 24" style={{ transform: item.abierta ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .15s' }}>
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
          ) : (
            <svg width="14" height="14" fill="var(--text-3)" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          )}
          <span>{item.nombre}</span>
        </div>
        {item.tipo === 'carpeta' && item.abierta && item.hijos && (
          <div>{renderizarArbol(item.hijos, profundidad + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="view-files fu1" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="ph-top" style={{ marginBottom: '20px' }}>
        <div>
          <div className="ph-title">Gestor de Archivos</div>
          <div className="ph-sub">Explorador de código fuente con control de versiones (Plataforma MVP)</div>
        </div>
        <div className="btn-row">
          <button className="btn-s btn-ghost">Rama: principal</button>
          <button className="btn-s btn-solid" onClick={() => setMostrarCrear(true)}>Nuevo archivo</button>
        </div>
      </div>

      {/* Ventana emergente: crear archivo */}
      {mostrarCrear && (
        <div className="modal-overlay" onClick={() => setMostrarCrear(false)}>
          <div className="modal-box" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Crear Archivo</h3><button className="modal-close" onClick={() => setMostrarCrear(false)}>✕</button></div>
            <form onSubmit={crearArchivo} className="modal-form">
              <div className="modal-field"><label>Nombre del archivo</label><input type="text" placeholder="Ej: utilidades.js" value={nombreNuevo} onChange={e => setNombreNuevo(e.target.value)} autoFocus /></div>
              <div className="modal-actions"><button type="button" className="btn-s btn-ghost" onClick={() => setMostrarCrear(false)}>Cancelar</button><button type="submit" className="btn-s btn-solid">Crear</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="ide-container card" style={{ display: 'flex', flex: 1, minHeight: '500px', overflow: 'hidden' }}>
        {/* Barra lateral de archivos */}
        <div style={{ width: '260px', borderRight: '1px solid var(--border)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '.75rem', fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Explorador
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {renderizarArbol(archivos)}
          </div>
        </div>

        {/* Área del editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Pestañas de archivos abiertos */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
            {pestañas.map(tab => (
              <div key={tab} onClick={() => { setArchivoActivo(tab); setModoEdicion(false); setMostrarVersiones(false); }} style={{
                padding: '10px 16px', fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                background: archivoActivo === tab ? 'var(--bg-panel)' : 'transparent',
                borderTop: archivoActivo === tab ? '2px solid var(--c-500)' : '2px solid transparent',
                color: archivoActivo === tab ? 'var(--text-1)' : 'var(--text-4)',
                whiteSpace: 'nowrap'
              }}>
                {tab}
                <span onClick={(e) => cerrarPestaña(tab, e)} style={{ fontSize: '.7rem', color: 'var(--text-4)', cursor: 'pointer', marginLeft: '6px' }}>✖</span>
              </div>
            ))}
          </div>

          {/* Barra de herramientas */}
          {archivoActivo && (
            <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '.78rem', color: 'var(--text-4)' }}>
                {archivoActivo} • {(contenidos[archivoActivo] || '').split('\n').length} líneas • {(contenidos[archivoActivo] || '').length} caracteres
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-s btn-ghost" onClick={() => setMostrarVersiones(!mostrarVersiones)} style={{ padding: '4px 10px', fontSize: '.75rem' }}>
                  🕒 Versiones ({versionesDelArchivo.length})
                </button>
                {modoEdicion ? (
                  <>
                    <button className="btn-s btn-ghost" onClick={() => setModoEdicion(false)} style={{ padding: '4px 10px', fontSize: '.75rem' }}>Cancelar</button>
                    <button className="btn-s btn-solid" onClick={guardarEdicion} style={{ padding: '4px 10px', fontSize: '.75rem' }}>💾 Guardar</button>
                  </>
                ) : (
                  <button className="btn-s btn-ghost" onClick={iniciarEdicion} style={{ padding: '4px 10px', fontSize: '.75rem' }}>✏️ Editar</button>
                )}
              </div>
            </div>
          )}

          {/* Panel de versiones */}
          {mostrarVersiones && archivoActivo && (
            <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', maxHeight: '200px', overflowY: 'auto' }}>
              <div style={{ padding: '12px 16px', fontSize: '.78rem', fontWeight: 600, color: 'var(--text-4)', borderBottom: '1px solid var(--border)' }}>
                Historial de versiones — {archivoActivo}
              </div>
              {versionesDelArchivo.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '.8rem', color: 'var(--text-4)' }}>
                  Aún no hay versiones guardadas. Al editar y guardar un archivo, la versión anterior se almacena aquí.
                </div>
              ) : (
                versionesDelArchivo.slice().reverse().map((v, i) => (
                  <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border-lt)', fontSize: '.8rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>Versión {versionesDelArchivo.length - i}</span>
                      <span style={{ color: 'var(--text-4)', marginLeft: '12px' }}>{v.fecha}</span>
                      <span style={{ color: 'var(--text-4)', marginLeft: '12px' }}>{v.tamaño} car.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-s btn-ghost" onClick={() => {
                        const w = window.open('', '_blank', 'width=600,height=400');
                        w.document.write(`<pre style="font-family:monospace;padding:20px;background:#1a1a2e;color:#e0e0e0">${v.contenido.replace(/</g, '&lt;')}</pre>`);
                        w.document.title = `${archivoActivo} — Versión ${versionesDelArchivo.length - i}`;
                      }} style={{ padding: '3px 8px', fontSize: '.72rem' }}>Ver</button>
                      <button className="btn-s btn-solid" onClick={() => restaurarVersion(archivoActivo, v.contenido)} style={{ padding: '3px 8px', fontSize: '.72rem' }}>Restaurar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Área de código */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex' }}>
            {archivoActivo ? (
              modoEdicion ? (
                <textarea
                  value={contenidoEdicion}
                  onChange={e => setContenidoEdicion(e.target.value)}
                  style={{
                    flex: 1, padding: '20px', margin: 0, border: 'none', resize: 'none', outline: 'none',
                    background: 'var(--bg)', color: 'var(--text-1)',
                    fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: '.9rem', lineHeight: 1.6, tabSize: 2
                  }}
                  spellCheck={false}
                  placeholder="Escribe tu código aquí..."
                />
              ) : (
                <>
                  <pre style={{ padding: '20px 12px', margin: 0, textAlign: 'right', color: 'var(--text-4)', fontSize: '.8rem', fontFamily: "'Fira Code', monospace", lineHeight: 1.6, userSelect: 'none', borderRight: '1px solid var(--border)' }}>
                    {obtenerNumLineas(contenidos[archivoActivo])}
                  </pre>
                  <pre style={{ flex: 1, padding: '20px', margin: 0, fontSize: '.9rem', fontFamily: "'Fira Code', 'Courier New', monospace", lineHeight: 1.6, color: 'var(--text-2)', overflowX: 'auto' }}>
                    <code>{contenidos[archivoActivo] || '// Archivo vacío'}</code>
                  </pre>
                </>
              )
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', flexDirection: 'column', gap: '8px' }}>
                <svg width="40" height="40" fill="none" stroke="var(--text-4)" viewBox="0 0 24 24" style={{ opacity: .4 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                <span>Selecciona un archivo del explorador para ver su contenido</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .file-tree-item { display: flex; align-items: center; gap: 8px; padding: 6px 16px; font-size: .85rem; color: var(--text-2); cursor: pointer; transition: background .15s; }
        .file-tree-item:hover { background: rgba(255,255,255,0.05); }
        .file-tree-item.active { background: rgba(1,131,192,.15); color: var(--text-1); border-left: 2px solid var(--c-500); }
      `}</style>
    </div>
  );
}
