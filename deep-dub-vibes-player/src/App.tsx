import React, { useState, useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginView from "./components/LoginView";

const INITIAL_TRACKS = [
  { id: 1, title: "Deep Dub Vibes", artist: "DJ KoFAi", duration: 214, bpm: 75, key: "Dm" },
  { id: 2, title: "Roots Rock Riddim", artist: "DJ KoFAi", duration: 187, bpm: 68, key: "Gm" },
  { id: 3, title: "Dub Is Live", artist: "DJ CyStorm", duration: 241, bpm: 72, key: "Am" },
  { id: 4, title: "Street Fire Dub", artist: "DJ Genie", duration: 198, bpm: 80, key: "Em" },
  { id: 5, title: "Conscious Riddim", artist: "DJ KoFAi", duration: 223, bpm: 70, key: "Bm" },
];

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const WAVEFORM_BARS = Array.from({ length: 64 }, (_, i) => ({
  id: i,
  base: 0.15 + Math.random() * 0.7,
  phase: Math.random() * Math.PI * 2,
  speed: 0.8 + Math.random() * 1.4,
}));

const VinylRecord = ({ isPlaying, track, bgMediaUrl, bgMediaType }: { isPlaying: boolean; track: any; bgMediaUrl?: string; bgMediaType?: "video" | "image" }) => {
  const rotation = useRef(0);
  const rafRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const spin = () => {
      rotation.current = (rotation.current + (isPlaying ? 0.4 : 0.08)) % 360;
      if (svgRef.current) {
        svgRef.current.style.transform = `rotate(${rotation.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [isPlaying]);

  return (
    <div style={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>
      {/* Glow ring */}
      <div style={{
        position: "absolute", inset: -12,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,180,0,0.18) 0%, transparent 70%)",
        animation: isPlaying ? "pulseGlow 2s ease-in-out infinite" : "none",
      }} />
      {/* Spinning vinyl */}
      <svg ref={svgRef} width="220" height="220" viewBox="0 0 220 220"
        style={{ display: "block", willChange: "transform", transition: "none" }}>
        
        {/* Main disc */}
        <circle cx="110" cy="110" r="105" fill="#111" />

        {/* Grooves */}
        {[80, 60, 45].map(r => (
          <circle key={r} cx="110" cy="110" r={r} fill="none" stroke="#222" strokeWidth="1" />
        ))}

        {/* Label */}
        <defs>
          <clipPath id="labelClip">
            <circle cx="110" cy="110" r="35" />
          </clipPath>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D2143A" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#009E60" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r="35" fill="#FFD700" />
        
        {bgMediaUrl && (
          <foreignObject x="75" y="75" width="70" height="70" clipPath="url(#labelClip)">
            {bgMediaType === "video" ? (
              <video src={bgMediaUrl} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <img src={bgMediaUrl} alt="label background" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </foreignObject>
        )}
        
        <circle cx="110" cy="110" r="35" fill="rgba(255, 215, 0, 0.5)" />
        <circle cx="110" cy="110" r="32" fill="none" stroke="#D2143A" strokeWidth="2" opacity="0.6" />
        <circle cx="110" cy="110" r="29" fill="none" stroke="#009E60" strokeWidth="2" opacity="0.6" />
        
        {/* Simple Label Text */}
        <text x="110" y="106" textAnchor="middle" fill="url(#textGrad)" fontSize="6"
          fontFamily="sans-serif" fontWeight="bold">HOLOGRAM</text>
        <text x="110" y="118" textAnchor="middle" fill="url(#textGrad)" fontSize="5"
          fontFamily="sans-serif">RECORDS</text>

        {/* Center hole */}
        <circle cx="110" cy="110" r="4" fill="#050200" />
      </svg>

      {/* Tonearm */}
      <div style={{
        position: "absolute", top: 8, right: -10,
        width: 4, height: 90,
        background: "#555",
        borderRadius: 2,
        transformOrigin: "top center",
        transform: isPlaying ? "rotate(-22deg)" : "rotate(-38deg)",
        transition: "transform 0.8s ease",
        zIndex: 10,
      }}>
        <div style={{
          position: "absolute", bottom: -4, left: -4,
          width: 12, height: 16, background: "#333", borderRadius: 2
        }} />
      </div>
    </div>
  );
};

const WaveformVisualizer = ({ isPlaying, progress }: { isPlaying: boolean; progress: number }) => {
  const [heights, setHeights] = useState(WAVEFORM_BARS.map(b => b.base));
  const rafRef = useRef<number | null>(null);
  const tRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      setHeights(WAVEFORM_BARS.map(b => b.base * 0.3));
      return;
    }
    const animate = (ts: number) => {
      tRef.current = ts / 1000;
      setHeights(WAVEFORM_BARS.map(b =>
        Math.abs(Math.sin(tRef.current * b.speed + b.phase)) * b.base * 0.75 + 0.1
      ));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [isPlaying]);

  const played = Math.floor(progress * WAVEFORM_BARS.length);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 56, width: "100%" }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${h * 100}%`,
          minHeight: 3,
          borderRadius: 2,
          background: i < played
            ? "linear-gradient(to top, #D2143A, #FFD700, #009E60)"
            : i === played
            ? "#FFFFFF"
            : "rgba(255,215,0,0.25)",
          transition: "height 0.05s ease",
        }} />
      ))}
    </div>
  );
};

const BANDS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  speed: 2 + Math.random() * 3,
  offset: Math.random() * Math.PI * 2,
}));

const FrequencyAnalyzer = ({ isPlaying }: { isPlaying: boolean }) => {
  const [bands, setBands] = useState(BANDS.map(() => 0.1));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setBands(BANDS.map(() => 0.1));
      return;
    }
    const animate = (ts: number) => {
      const t = ts / 1000;
      setBands(BANDS.map(b => {
        const val1 = Math.sin(t * b.speed + b.offset) * 0.5 + 0.5;
        const val2 = Math.cos(t * b.speed * 0.7 - b.offset) * 0.5 + 0.5;
        const bounce = Math.random() * 0.3;
        let combined = (val1 * 0.4 + val2 * 0.3 + bounce + 0.1);
        if (b.id < 6) combined *= 1.2 + Math.random() * 0.3;
        return Math.min(1, combined);
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [isPlaying]);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32, width: "100%", opacity: 0.8, marginTop: 12 }}>
      {bands.map((h, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${h * 100}%`,
          minHeight: 4,
          background: "linear-gradient(to top, #D2143A, #FFD700, #009E60)",
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          transition: "height 0.05s linear",
          boxShadow: `0 0 8px rgba(255, 215, 0, ${h * 0.4})`
        }} />
      ))}
    </div>
  );
};

const VibeParticle: React.FC<{ style: any }> = ({ style }) => {
  const colors = ["#D2143A", "#FFD700", "#009E60"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <div style={{
      position: "absolute",
      width: 4 + Math.random() * 6,
      height: 4 + Math.random() * 6,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color}, transparent)`,
      opacity: 0.7,
      animation: `floatVibe ${1.5 + Math.random()}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 2}s`,
      ...style,
    }} />
  );
};

function DeepDubVibesPlayer() {
  const { logout } = useAuth();
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [bgMediaUrl, setBgMediaUrl] = useState("https://techbridge.edu.gh/static/campus_tour_web.mp4");
  const [bgMediaType, setBgMediaType] = useState<"video" | "image">("video");
  const [editing, setEditing] = useState<"title" | "artist" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isYtMode, setIsYtMode] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const track = tracks[currentIdx];

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditing(null);
        setIsYtMode(false);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const startEdit = (field: "title" | "artist", value: string) => {
    setEditing(field);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editing) {
      setTracks(prev => prev.map((t, i) => i === currentIdx ? { ...t, [editing]: editValue } : t));
    }
    setEditing(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") setEditing(null);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          if (e >= track.duration - 1) {
            handleNext();
            return 0;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentIdx, track.duration]);

  useEffect(() => {
    setProgress(elapsed / track.duration);
  }, [elapsed, track.duration]);

  const handlePlay = () => setIsPlaying(p => !p);

  const handleNext = () => {
    setCurrentIdx(i => (i + 1) % tracks.length);
    setElapsed(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIdx(i => (i - 1 + tracks.length) % tracks.length);
    setElapsed(0);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const newElapsed = Math.floor(x * track.duration);
    setElapsed(newElapsed);
  };

  const toggleLike = (id: number) => setLiked(l => ({ ...l, [id]: !l[id] }));

  const firePositions = [
    { bottom: 0, left: "5%" }, { bottom: 0, left: "15%" },
    { bottom: 0, left: "80%" }, { bottom: 0, left: "90%" },
    { bottom: 0, left: "50%" }, { bottom: 0, left: "35%" },
    { bottom: 0, left: "65%" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050200",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Trebuchet MS', 'Lucida Grande', sans-serif",
      padding: isYtMode ? 0 : 16,
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes floatVibe {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-40px) scale(1.3); opacity: 0.4; }
          100% { transform: translateY(-80px) scale(0.5); opacity: 0; }
        }
        @keyframes titlePulse {
          0%, 100% { text-shadow: 0 0 20px #D2143A, 0 0 40px #FFD700; }
          50% { text-shadow: 0 0 40px #FFD700, 0 0 80px #009E60, 0 0 120px #009E60; }
        }
        .track-row:hover { background: rgba(255,180,0,0.08) !important; }
        .ctrl-btn:hover { transform: scale(1.15); color: #FFD700 !important; }
        .ctrl-btn:active { transform: scale(0.95); }
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; }
        input[type=range]::-webkit-slider-runnable-track {
          background: rgba(255,200,0,0.2);
          height: 4px; border-radius: 2px;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #FFD700;
          margin-top: -4px;
          box-shadow: 0 0 8px #FFD700;
        }
      `}</style>

      <div style={{
        width: "100%", 
        maxWidth: isYtMode ? "none" : 780,
        height: isYtMode ? "100vh" : "auto",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(145deg, #0f0800 0%, #0a0500 50%, #080600 100%)",
        borderRadius: isYtMode ? 0 : 24,
        border: isYtMode ? "none" : "1px solid rgba(255,180,0,0.15)",
        boxShadow: isYtMode ? "none" : "0 0 80px rgba(255,100,0,0.15), 0 0 160px rgba(255,60,0,0.06)",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}>
        {bgMediaUrl && bgMediaType === "video" && (
          <video
            autoPlay
            loop
            muted
            playsInline
            src={bgMediaUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />
        )}
        {bgMediaUrl && bgMediaType === "image" && (
          <img
            src={bgMediaUrl}
            alt="background"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Header Banner */}
        <div style={{
          background: "linear-gradient(90deg, rgba(26,8,0,0.8), rgba(42,16,0,0.8), rgba(26,8,0,0.8))",
          padding: "14px 24px",
          borderBottom: "1px solid rgba(255,140,0,0.2)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "relative", zIndex: 1,
          backdropFilter: "blur(4px)",
        }}>
          <div>
            <div style={{
              fontSize: 22, fontWeight: 900, letterSpacing: 3,
              animation: "titlePulse 3s ease-in-out infinite",
              textTransform: "uppercase",
            }}>
              🔥 <span style={{
                backgroundImage: "linear-gradient(to right, #D2143A, #FFD700, #009E60)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>DEEP DUB VIBES</span>
            </div>
            <div style={{ fontSize: 10, color: "#FF8C00", letterSpacing: 4, marginTop: 2 }}>
              HOLOGRAM AI RECORDS · PLCRP
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[
              { name: "ROOTS", color: "#D2143A" },
              { name: "ROCK", color: "#FFD700" },
              { name: "DUB", color: "#009E60" }
            ].map(tag => (
              <span key={tag.name} style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 2,
                padding: "3px 8px", borderRadius: 3,
                border: `1px solid ${tag.color}`,
                color: tag.color,
                opacity: 0.9,
              }}>{tag.name}</span>
            ))}
            {isYtMode && (
              <button 
                onClick={() => setIsYtMode(false)}
                title="Exit YT Mode (ESC)"
                style={{ background: "transparent", border: "1px solid #FF4500", color: "#FF4500", borderRadius: 4, cursor: "pointer", marginLeft: 16, padding: "2px 6px", fontSize: 10, fontWeight: "bold" }}
              >
                EXIT
              </button>
            )}
            <button 
              onClick={logout}
              title="Sign Out (Google)"
              style={{ background: "transparent", border: "1px solid rgba(255, 215, 0, 0.4)", color: "#FFD700", borderRadius: 4, cursor: "pointer", marginLeft: 8, padding: "2px 6px", fontSize: 10, fontWeight: "bold", letterSpacing: 1 }}
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Main Player */}
        <div style={{ 
          padding: isYtMode ? "40px" : "28px 28px 20px", 
          position: "relative", 
          zIndex: 1,
          flex: isYtMode ? 1 : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          {/* Vibe particles */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {firePositions.map((pos, i) => (
              <VibeParticle key={i} style={pos} />
            ))}
          </div>

          <div style={{ 
            display: "flex", 
            gap: isYtMode ? 60 : 28, 
            alignItems: "center", 
            justifyContent: isYtMode ? "center" : "flex-start",
            flexWrap: "wrap",
            maxWidth: isYtMode ? 1200 : "none",
            margin: isYtMode ? "0 auto" : 0,
            width: "100%"
          }}>
            {/* Vinyl */}
            <div>
              <VinylRecord isPlaying={isPlaying} track={track} bgMediaUrl={bgMediaUrl} bgMediaType={bgMediaType} />
            </div>

            {/* Info + Controls */}
            <div style={{ flex: 1, minWidth: 260 }}>
              {/* Track info */}
              <div style={{ marginBottom: 20 }}>
                {editing === "title" ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown}
                    style={{
                      fontSize: 26, fontWeight: 900, color: "#FFD700",
                      backgroundImage: "linear-gradient(to right, #D2143A, #FFD700, #009E60)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: 1, lineHeight: 1.1,
                      backgroundColor: "transparent", border: "none", outline: "none",
                      borderBottom: "1px dashed rgba(255,180,0,0.5)",
                      width: "100%", fontFamily: "inherit"
                    }}
                  />
                ) : (
                  <div
                    onClick={() => startEdit("title", track.title)}
                    title="Click to edit title"
                    style={{
                      fontSize: 26, fontWeight: 900,
                      backgroundImage: "linear-gradient(to right, #D2143A, #FFD700, #009E60)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: 1, lineHeight: 1.1,
                      textShadow: "0 0 20px rgba(0,0,0,0.5)",
                      cursor: "text",
                      display: "inline-block"
                    }}
                  >
                    {track.title}
                  </div>
                )}
                {editing === "artist" ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown}
                    style={{
                      fontSize: 13, color: "#FF8C00", marginTop: 4, letterSpacing: 2,
                      backgroundImage: "linear-gradient(to right, #D2143A, #FFD700, #009E60)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundColor: "transparent", border: "none", outline: "none",
                      borderBottom: "1px dashed rgba(255,140,0,0.5)",
                      width: "100%", fontFamily: "inherit"
                    }}
                  />
                ) : (
                  <div
                    onClick={() => startEdit("artist", track.artist)}
                    title="Click to edit artist"
                    style={{ 
                      fontSize: 13, marginTop: 4, letterSpacing: 2,
                      backgroundImage: "linear-gradient(to right, #D2143A, #FFD700, #009E60)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      cursor: "text", display: "inline-block" 
                    }}
                  >
                    {track.artist}
                  </div>
                )}
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  {[
                    { label: "BPM", val: track.bpm },
                    { label: "KEY", val: track.key },
                    { label: "GHAMRO", val: "✓" },
                    { label: "ASCAP", val: "✓" },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "rgba(255,180,0,0.5)", letterSpacing: 1 }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#FFB800", fontWeight: 700 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <FrequencyAnalyzer isPlaying={isPlaying} />
              </div>

              {/* Waveform */}
              <div style={{
                marginBottom: 10, cursor: "pointer",
                padding: "8px 0",
              }} onClick={handleSeek}>
                <WaveformVisualizer isPlaying={isPlaying} progress={progress} />
              </div>

              {/* Progress bar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
              }}>
                <span style={{ fontSize: 11, color: "#FF8C00", minWidth: 36 }}>
                  {formatTime(elapsed)}
                </span>
                <div style={{
                  flex: 1, height: 4, background: "rgba(255,180,0,0.15)",
                  borderRadius: 2, cursor: "pointer", position: "relative",
                }} onClick={handleSeek}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: `${progress * 100}%`,
                    background: "linear-gradient(to right, #D2143A, #FFD700, #009E60)",
                    borderRadius: 2,
                    boxShadow: "0 0 8px #FFD700",
                    transition: "width 0.5s linear",
                  }} />
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,180,0,0.5)", minWidth: 36, textAlign: "right" }}>
                  {formatTime(track.duration)}
                </span>
              </div>

              {/* Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                <button className="ctrl-btn" onClick={handlePrev}
                  style={{ background: "none", border: "none", color: "#FF8C00", fontSize: 20, cursor: "pointer", transition: "all 0.2s", padding: 4 }}>
                  ⏮
                </button>
                <button onClick={handlePlay}
                  style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: isPlaying
                      ? "linear-gradient(135deg, #009E60, #FFD700)"
                      : "linear-gradient(135deg, #FFD700, #D2143A)",
                    border: "none", cursor: "pointer",
                    fontSize: 22,
                    boxShadow: isPlaying
                      ? "0 0 24px rgba(0,158,96,0.5)"
                      : "0 0 24px rgba(210,20,58,0.5)",
                    transition: "all 0.3s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button className="ctrl-btn" onClick={handleNext}
                  style={{ background: "none", border: "none", color: "#FF8C00", fontSize: 20, cursor: "pointer", transition: "all 0.2s", padding: 4 }}>
                  ⏭
                </button>
                <button onClick={() => toggleLike(track.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, transition: "transform 0.2s", transform: liked[track.id] ? "scale(1.2)" : "scale(1)" }}>
                  {liked[track.id] ? "❤️" : "🤍"}
                </button>

                {/* Volume */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                  <button className="ctrl-btn" onClick={() => setIsMuted(m => !m)}
                    style={{ background: "none", border: "none", color: "#FF8C00", fontSize: 16, cursor: "pointer", transition: "all 0.2s" }}>
                    {isMuted ? "🔇" : volume > 50 ? "🔊" : "🔉"}
                  </button>
                  <input type="range" min="0" max="100" value={isMuted ? 0 : volume}
                    onChange={e => { setVolume(+e.target.value); setIsMuted(false); }}
                    style={{ width: 80, height: 4 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isYtMode && (
        <>
        {/* Tracklist */}
        <div style={{
          borderTop: "1px solid rgba(255,140,0,0.12)",
          padding: "4px 0 0",
          position: "relative", zIndex: 1,
        }}>
          <div style={{
            padding: "8px 28px",
            fontSize: 9, letterSpacing: 3, color: "rgba(255,180,0,0.4)",
            fontWeight: 700,
            display: "grid", gridTemplateColumns: "24px 1fr 80px 50px 40px",
            gap: 8,
          }}>
            <span>#</span><span>TITLE</span><span>ARTIST</span><span>BPM</span><span>TIME</span>
          </div>
          {tracks.map((t, i) => (
            <div key={t.id} className="track-row"
              onClick={() => { setCurrentIdx(i); setElapsed(0); setIsPlaying(true); }}
              style={{
                padding: "10px 28px",
                display: "grid", gridTemplateColumns: "24px 1fr 80px 50px 40px",
                gap: 8, alignItems: "center",
                cursor: "pointer", transition: "background 0.2s",
                background: currentIdx === i ? "rgba(255,140,0,0.1)" : "transparent",
                borderLeft: currentIdx === i ? "3px solid #FFD700" : "3px solid transparent",
              }}>
              <span style={{ fontSize: 11, color: currentIdx === i ? "#FFD700" : "rgba(255,180,0,0.3)", fontWeight: 700 }}>
                {currentIdx === i && isPlaying ? "▶" : String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 13, color: currentIdx === i ? "#FFD700" : "rgba(255,220,100,0.7)", fontWeight: currentIdx === i ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.title}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,140,0,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.artist}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,180,0,0.4)" }}>{t.bpm}</span>
              <span style={{ fontSize: 11, color: "rgba(255,180,0,0.4)" }}>{formatTime(t.duration)}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          position: "relative", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.4)", padding: "4px 4px 4px 12px", borderRadius: 40, border: "1px solid rgba(255,180,0,0.1)" }}>
            <span style={{ fontSize: 9, color: "rgba(255,180,0,0.5)", letterSpacing: 1 }}>BG</span>
            <select
              value={bgMediaType}
              onChange={e => setBgMediaType(e.target.value as "video" | "image")}
              style={{
                background: "transparent",
                border: "none",
                color: "#FFD700",
                outline: "none",
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              <option value="video" style={{ background: "#050200" }}>VIDEO</option>
              <option value="image" style={{ background: "#050200" }}>IMAGE</option>
            </select>
            <input
              type="text"
              placeholder="Paste URL..."
              value={bgMediaUrl}
              onChange={e => setBgMediaUrl(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "#FFD700",
                outline: "none",
                width: 140,
                fontSize: 10,
              }}
            />
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "0 6px" }}>
              <input 
                type="file" 
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBgMediaUrl(URL.createObjectURL(file));
                    setBgMediaType(file.type.startsWith("video/") ? "video" : "image");
                  }
                }}
              />
              <span title="Select from device" style={{ color: "#FF8C00", fontSize: 14 }}>📁</span>
            </label>
            {bgMediaUrl && (
              <button title="Clear Media" onClick={() => setBgMediaUrl("")} style={{ background: "transparent", border: "none", color: "#FF4500", cursor: "pointer", padding: "0 6px", fontSize: 12 }}>×</button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setIsYtMode(true)}
              style={{
                background: "rgba(255, 34, 0, 0.2)",
                border: "1px solid rgba(255, 34, 0, 0.5)",
                color: "#FFD700",
                padding: "6px 16px",
                borderRadius: 40,
                fontSize: 10,
                cursor: "pointer",
                fontWeight: "bold",
                letterSpacing: 1,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span>📺</span> YT PRES. MODE
            </button>
            <div style={{
              fontSize: 10,
              color: "rgba(255,180,0,0.4)",
              letterSpacing: 2,
            }}>
              &copy; 2026 HOLOGRAM AI RECORDS
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#050200",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Trebuchet MS', 'Lucida Grande', sans-serif"
      }}>
        <div style={{ color: "#FFD700", fontSize: 18, letterSpacing: 2, fontWeight: "bold" }}>LOADING...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return <DeepDubVibesPlayer />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
