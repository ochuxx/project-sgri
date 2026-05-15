import { useState } from 'react';

const SLIDES = [
  {
    icon: (
      <svg width="44" height="44" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    ),
    color: '#a78bfa', // Purple/Violet
    bgColor: 'rgba(167, 139, 250, 0.15)',
    title: 'Bienvenido a SGRI',
    desc: 'Sistema de Gestión de la Investigación Institucional desarrollado para la Fundación Universitaria Cafam. Una herramienta centralizada para potenciar el conocimiento.',
    badge: 'Institucional'
  },
  {
    icon: (
      <svg width="44" height="44" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
    ),
    color: '#38bdf8', // Lighter blue
    bgColor: 'rgba(56, 189, 248, 0.15)',
    title: 'Gestión de proyectos académicos',
    desc: 'Crea proyectos, asigna tareas y controla el avance de tu equipo en tiempo real desde un solo lugar.',
    badge: 'Proyectos'
  },
  {
    icon: (
      <svg width="44" height="44" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
    color: '#4ade80', // Lighter green
    bgColor: 'rgba(74, 222, 128, 0.15)',
    title: 'Seguimiento de tareas en detalle',
    desc: 'Define tipos de tareas, asigna prioridades y marca el progreso. Nunca pierdas de vista lo importante.',
    badge: 'Tareas'
  },
  {
    icon: (
      <svg width="44" height="44" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
    color: '#fbbf24', // Amber
    bgColor: 'rgba(251, 191, 36, 0.15)',
    title: 'Dashboards para profesores',
    desc: 'Visualiza el avance por proyecto, grupo y estudiante. Toma decisiones informadas con métricas actualizadas.',
    badge: 'Métricas'
  }
];

export default function Onboarding({ onFinish }) {
  const [slide, setSlide] = useState(0);

  const goNext = () => {
    if (slide < SLIDES.length - 1) {
      setSlide(slide + 1);
    } else {
      onFinish();
    }
  };

  const goTo = (i) => {
    setSlide(i);
  };

  const current = SLIDES[slide];

  return (
    <div className="ob-screen">
      {/* Background */}
      <div className="ob-bg">
        <div className="ob-bg-orb ob-bg-orb-1" style={{ background: current.color, transition: 'background .6s' }} />
        <div className="ob-bg-orb ob-bg-orb-2" />
      </div>

      {/* Content area */}
      <div className="ob-body">
        <div className="ob-card" key={slide}>
          {/* Badge */}
          <div className="ob-badge" style={{ color: current.color, borderColor: current.bgColor, background: current.bgColor }}>
            {current.badge}
          </div>

          {/* Icon */}
          <div className="ob-icon" style={{ color: current.color, background: current.bgColor, borderColor: current.bgColor }}>
            <div className="ob-icon-dashed" style={{ borderColor: current.color }} />
            {current.icon}
          </div>

          {/* Text */}
          <h2 className="ob-title">{current.title}</h2>
          <p className="ob-desc">{current.desc}</p>

          {/* Feature hints */}
          <div className="ob-features">
            <div className="ob-feature-dot" style={{ background: current.color }} />
            <span>Slide {slide + 1} de {SLIDES.length}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="ob-footer">
        <button className="ob-skip-btn" onClick={onFinish}>Omitir</button>

        <div className="ob-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`ob-dot ${slide === i ? 'ob-dot-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button className="ob-next-btn" onClick={goNext}>
          {slide === SLIDES.length - 1 ? 'Comenzar' : 'Continuar'}
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <style>{`
        .ob-screen {
          position: fixed;
          inset: 0;
          z-index: 150;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          overflow: hidden;
        }

        /* Background */
        .ob-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .ob-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
        }
        .ob-bg-orb-1 {
          width: 450px; height: 450px;
          top: 50%; left: 50%;
          transform: translate(-50%, -60%);
          opacity: .12;
          transition: background .6s ease;
        }
        .ob-bg-orb-2 {
          width: 300px; height: 300px;
          bottom: -5%; right: 20%;
          background: var(--c-300);
          opacity: .06;
        }

        /* Body */
        .ob-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          box-sizing: border-box;
        }

        /* Card */
        .ob-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 440px;
          width: 100%;
          animation: obSlideIn .45s cubic-bezier(.4, 0, .2, 1);
        }
        @keyframes obSlideIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Badge */
        .ob-badge {
          font-size: .7rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          border: 1px solid;
          margin-bottom: 28px;
          transition: all .4s ease;
        }

        /* Icon */
        .ob-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          position: relative;
          border: 1px solid;
          transition: all .4s ease;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 0 20px rgba(255,255,255,0.05);
        }
        .ob-icon-dashed {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 1.5px dashed;
          opacity: .15;
          animation: obSpin 25s linear infinite;
        }
        @keyframes obSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Text */
        .ob-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.8rem;
          color: var(--text-1);
          margin: 0 0 12px;
          line-height: 1.2;
          font-weight: 400;
        }
        .ob-desc {
          color: var(--text-3);
          font-size: .9rem;
          line-height: 1.7;
          margin: 0;
          max-width: 360px;
        }

        /* Feature hint */
        .ob-features {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 28px;
          font-size: .72rem;
          color: var(--text-4);
        }
        .ob-feature-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          transition: background .4s;
        }

        /* Footer */
        .ob-footer {
          padding: 20px 32px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,.02);
          border-top: 1px solid var(--border);
          box-sizing: border-box;
        }

        .ob-skip-btn {
          font-size: .82rem;
          color: var(--text-4);
          padding: 10px 16px;
          border-radius: 10px;
          transition: color .15s, background .15s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          min-width: 80px;
          text-align: left;
        }
        .ob-skip-btn:hover {
          color: var(--text-2);
          background: rgba(255,255,255,.04);
        }

        /* Dots */
        .ob-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .ob-dot {
          width: 8px; height: 8px;
          border-radius: 8px;
          background: var(--border);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all .35s cubic-bezier(.4, 0, .2, 1);
        }
        .ob-dot:hover {
          background: var(--text-4);
        }
        .ob-dot-active {
          width: 28px;
          background: var(--c-500);
        }

        /* Next button */
        .ob-next-btn {
          padding: 11px 24px;
          background: linear-gradient(135deg, var(--c-700), var(--c-500));
          color: #fff;
          border-radius: 12px;
          font-size: .85rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(1,131,192,.35);
          transition: transform .15s, box-shadow .15s, opacity .15s;
          min-width: 120px;
          justify-content: center;
        }
        .ob-next-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(1,131,192,.45);
        }
        .ob-next-btn:active {
          transform: translateY(0) scale(.98);
        }

        /* Mobile adjustments */
        @media (max-width: 480px) {
          .ob-title { font-size: 1.4rem; }
          .ob-desc { font-size: .82rem; }
          .ob-icon { width: 80px; height: 80px; }
          .ob-icon svg { width: 36px; height: 36px; }
          .ob-footer { padding: 16px 20px 24px; }
          .ob-next-btn { padding: 10px 18px; font-size: .8rem; min-width: 100px; }
          .ob-skip-btn { padding: 8px 10px; font-size: .78rem; min-width: 60px; }
        }
      `}</style>
    </div>
  );
}
