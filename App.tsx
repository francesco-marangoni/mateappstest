import React, { useState, useEffect } from 'react';
import { Menu, X, Calculator, Thermometer, Divide, Grid3X3, ArrowLeft } from 'lucide-react';
import { AppViewer } from './components/AppViewer';
import { useSound } from './hooks/useSound';
import { APPS_DATA, AppKey } from './data/apps';

// Map icons to app keys
const ICONS: Record<AppKey, React.ReactNode> = {
  espressioni: <Calculator size={20} />,
  termometro: <Thermometer size={20} />,
  mcmmcd: <Divide size={20} />,
  sudoku: <Grid3X3 size={20} />,
};

export default function App() {
  const [activeApp, setActiveApp] = useState<AppKey>('espressioni');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { playHover, playClick } = useSound();

  // Handle responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 850);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAppChange = (key: AppKey) => {
    playClick();
    setActiveApp(key);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    playClick();
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen bg-[#f0f2f5] overflow-hidden font-['Nunito']">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 backdrop-blur-[2px]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && !isSidebarOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-[#2c3e50]/90 text-white flex items-center justify-center shadow-lg backdrop-blur-sm active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <nav 
        className={`
          fixed md:relative z-30 h-full bg-[#2c3e50] text-white
          transition-transform duration-300 ease-out shadow-2xl
          w-[280px] flex flex-col py-6
          ${isSidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="px-6 mb-10 flex items-center gap-3">
          <span className="text-3xl">🧮</span>
          <span className="font-['Kalam'] text-3xl font-bold tracking-wide">MATEAPPS</span>
        </div>

        {/* Menu Items */}
        <div className="flex-1 flex flex-col gap-2 px-3">
          {Object.entries(APPS_DATA).map(([key, data]) => (
            <button
              key={key}
              onMouseEnter={playHover}
              onClick={() => handleAppChange(key as AppKey)}
              className={`
                flex items-center gap-4 px-4 py-4 rounded-r-full text-left transition-all duration-200
                font-bold text-lg
                ${activeApp === key 
                  ? 'bg-[#f0f2f5] text-[#1565c0] shadow-[-5px_5px_10px_rgba(0,0,0,0.1)] translate-x-0' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5 hover:translate-x-1'
                }
              `}
            >
              {ICONS[key as AppKey]}
              {data.title}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 mt-auto text-center text-slate-400 font-['Kalam'] text-sm">
          Monoennio Piombino
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-[#f0f2f5] h-full overflow-hidden">
        {/* Mobile Header (optional visual anchor) */}
        {isMobile && (
          <div className="h-20 w-full" /> 
        )}
        
        <div className="absolute inset-0 w-full h-full">
           <AppViewer htmlContent={APPS_DATA[activeApp].html} title={APPS_DATA[activeApp].title} />
        </div>
      </main>
    </div>
  );
}