import { useState, useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import Splash from './components/Splash'
import Onboarding from './components/Onboarding'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [userProfile, setUserProfile] = useState({
    realName: 'Demo Usuario',
    username: 'demo_usuario',
    photo: null,
    frame: 'none'
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sgri_theme') || 'dark';
  });

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('sgri_theme', theme);
  }, [theme]);

  return (
    <AppProvider>
      {currentPage === 'splash' && <Splash onFinish={() => setCurrentPage('onboarding')} />}
      {currentPage === 'onboarding' && <Onboarding onFinish={() => setCurrentPage('login')} />}
      {currentPage === 'login' && <Login onLogin={(profile) => { setUserProfile(profile); setCurrentPage('app'); }} />}
      {currentPage === 'app' && <Dashboard userProfile={userProfile} onUpdateProfile={setUserProfile} onLogout={() => setCurrentPage('login')} theme={theme} setTheme={setTheme} />}
    </AppProvider>
  )
}

export default App
