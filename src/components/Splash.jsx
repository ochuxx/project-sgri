import { useEffect, useState } from 'react';

export default function Splash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animate progress bar
    const timer1 = setTimeout(() => setProgress(100), 100);

    // Start fade out
    const timer2 = setTimeout(() => setFadeOut(true), 2400);

    // Navigate away
    const timer3 = setTimeout(() => onFinish(), 2900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fadeOut ? 'splash-fade' : ''}`}>
      {/* Animated background orbs */}
      <div className="splash-bg">
        <div className="splash-orb splash-orb-1" />
        <div className="splash-orb splash-orb-2" />
        <div className="splash-orb splash-orb-3" />
      </div>

      {/* Grid pattern overlay */}
      <div className="splash-grid" />

      {/* Main content */}
      <div className="splash-content">
        {/* Logo with rings */}
        <div className="splash-logo-area">
          <div className="splash-ring splash-ring-outer" />
          <div className="splash-ring splash-ring-inner" />
          <div className="splash-logo-box">
            <svg width="48" height="52" viewBox="0 0 100 110" fill="none">
              <path d="M5,5 H95 V65 Q95,105 50,108 Q5,105 5,65 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <path d="M8,8 H49 V54 H8 Z" fill="rgba(255,255,255,0.9)"/>
              <path d="M51,8 H92 V54 H51 Z" fill="rgba(255,255,255,0.6)"/>
              <path d="M8,56 H49 V87 Q8,94 8,72 Z" fill="rgba(255,255,255,0.9)"/>
              <path d="M51,56 H92 V72 Q92,94 51,87 Z" fill="rgba(255,255,255,0.25)"/>
              <line x1="50" y1="8" x2="50" y2="90" stroke="rgba(255,255,255,0.12)" strokeWidth="3"/>
              <line x1="8" y1="55" x2="92" y2="55" stroke="rgba(255,255,255,0.12)" strokeWidth="3"/>
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="splash-text">
          <h1 className="splash-title">SGRI</h1>
          <p className="splash-subtitle">Campus Académico · Investigación</p>
        </div>

        {/* Progress bar */}
        <div className="splash-progress">
          <div className="splash-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="splash-loading">Cargando plataforma…</p>
      </div>

      <style>{`
        .splash-screen {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          overflow: hidden;
          transition: opacity .5s ease, transform .5s ease;
        }
        .splash-fade {
          opacity: 0;
          transform: scale(1.04);
        }

        /* Background */
        .splash-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .splash-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
        }
        .splash-orb-1 {
          width: 500px; height: 500px;
          background: var(--c-700);
          top: -15%; left: 50%;
          transform: translateX(-50%);
          opacity: .2;
          animation: orbFloat1 6s ease-in-out infinite;
        }
        .splash-orb-2 {
          width: 350px; height: 350px;
          background: var(--c-300);
          bottom: -10%; left: 20%;
          opacity: .15;
          animation: orbFloat2 8s ease-in-out infinite;
        }
        .splash-orb-3 {
          width: 300px; height: 300px;
          background: var(--success);
          bottom: 10%; right: 10%;
          opacity: .08;
          animation: orbFloat3 7s ease-in-out infinite;
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(20px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        /* Grid pattern */
        .splash-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
        }

        /* Content */
        .splash-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          text-align: center;
        }

        /* Logo area */
        .splash-logo-area {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
        }
        .splash-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.1);
        }
        .splash-ring-outer {
          width: 120px; height: 120px;
          animation: splashPulse 2.5s ease-in-out infinite;
        }
        .splash-ring-inner {
          width: 150px; height: 150px;
          border: 1px solid rgba(255,255,255,.05);
          animation: splashPulse 2.5s .5s ease-in-out infinite;
        }
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); opacity: .6; }
          50% { transform: scale(1.08); opacity: .2; }
        }

        .splash-logo-box {
          position: relative;
          z-index: 2;
          width: 88px; height: 88px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.08);
          animation: logoBreath 4s ease-in-out infinite;
        }
        @keyframes logoBreath {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* Text */
        .splash-text {
          margin-bottom: 40px;
        }
        .splash-title {
          font-family: 'DM Serif Display', serif;
          font-size: 2.4rem;
          color: var(--text-1);
          letter-spacing: 1px;
          line-height: 1;
          margin: 0 0 8px;
          font-weight: 400;
        }
        .splash-subtitle {
          font-size: .8rem;
          color: var(--text-4);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin: 0;
        }

        /* Progress */
        .splash-progress {
          width: 180px;
          height: 3px;
          background: rgba(255,255,255,.08);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .splash-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--c-700), var(--c-300));
          border-radius: 3px;
          transition: width 2.2s cubic-bezier(.25, .1, .25, 1);
        }
        .splash-loading {
          font-size: .72rem;
          color: var(--text-4);
          letter-spacing: .5px;
          margin: 0;
          animation: loadBlink 1.5s ease-in-out infinite;
        }
        @keyframes loadBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
      `}</style>
    </div>
  );
}
