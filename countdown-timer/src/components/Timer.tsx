import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import FluidBackground from './FluidBackground';
import VideoWall from './VideoWall';

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { theme } = useTheme();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const savedTarget = localStorage.getItem('timer-target');
      let targetDate: Date;
      
      if (savedTarget) {
        targetDate = new Date(savedTarget);
      } else {
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7);
        localStorage.setItem('timer-target', targetDate.toISOString().slice(0, 16));
      }

      const difference = +targetDate - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <main 
      className="flex h-screen w-full bg-bg-primary overflow-hidden font-sans transition-colors duration-300"
      aria-label="Countdown Timer Page"
    >
      {/* Left side - Image */}
      <div className="flex-1 relative flex items-center justify-center p-12" aria-hidden="true">
        <div className="absolute inset-0 z-0">
          {theme !== 'high-contrast' && (
            <>
              <FluidBackground />
              <VideoWall config={{
                gridSize: 20,
                decay: 0.95,
                colorPrimary: '#00c6ff',
                colorSecondary: '#0072ff',
                sensitivity: 0.8,
                mode: 'plasma',
                activeShape: 'africa',
                silhouetteSize: 1,
                activeVideo: [
                  'https://media.techbridge.edu.gh/media/banner1.mp4',
                  'https://media.techbridge.edu.gh/media/banner2.mp4',
                  'https://media.techbridge.edu.gh/media/banner3.mp4',
                  'https://media.techbridge.edu.gh/media/banner4.mp4',
                  'https://media.techbridge.edu.gh/media/banner5.mp4',
                  'https://media.techbridge.edu.gh/media/banner6.mp4',
                  'https://media.techbridge.edu.gh/media/banner7.mp4'
                ],
                useVideoBackground: true
              }} />
            </>
          )}
        </div>
      </div>

      {/* Right side - Timer Panel */}
      <section 
        className="w-[180px] bg-bg-secondary text-text-secondary flex flex-col items-center justify-center py-12 z-10 shadow-2xl hc-border transition-colors duration-300"
        aria-label="Timer Panel"
      >
        <h1 className="text-xs font-bold mb-8 uppercase tracking-wider text-center">
          Starting in
        </h1>
        
        <div 
          className="flex flex-col items-center gap-8"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
        >
          <div className="flex flex-col items-center" aria-hidden="true">
            <span className="text-4xl font-bold tracking-tighter">{pad(timeLeft.days)}</span>
            <span className="text-sm font-bold mt-1">d</span>
          </div>
          
          <div className="flex flex-col items-center" aria-hidden="true">
            <span className="text-4xl font-bold tracking-tighter">{pad(timeLeft.hours)}</span>
            <span className="text-sm font-bold mt-1">h</span>
          </div>
          
          <div className="flex flex-col items-center" aria-hidden="true">
            <span className="text-4xl font-bold tracking-tighter">{pad(timeLeft.minutes)}</span>
            <span className="text-sm font-bold mt-1">m</span>
          </div>
          
          <div className="flex flex-col items-center" aria-hidden="true">
            <span className="text-4xl font-bold tracking-tighter">{pad(timeLeft.seconds)}</span>
            <span className="text-sm font-bold mt-1">s</span>
          </div>
        </div>

        <Link 
          to="/admin" 
          className="mt-12 flex items-center gap-2 text-xs opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent p-2 rounded transition-opacity"
          aria-label="Go to Admin Panel"
        >
          <Settings size={16} />
          <span>Admin</span>
        </Link>
      </section>
    </main>
  );
}
