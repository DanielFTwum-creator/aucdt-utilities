import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginView() {
  const { login, isLoading } = useAuth();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050200",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Trebuchet MS', 'Lucida Grande', sans-serif",
      padding: 16,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src="https://techbridge.edu.gh/static/campus_tour_web.mp4"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />

      {/* Floating particles background effect */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle, rgba(255,140,0,0.05) 0%, transparent 80%)",
        zIndex: 0,
        pointerEvents: "none"
      }} />

      {/* Main Login Card */}
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "linear-gradient(145deg, #0f0800 0%, #0a0500 50%, #080600 100%)",
        borderRadius: 24,
        border: "1px solid rgba(255,180,0,0.2)",
        boxShadow: "0 0 80px rgba(255,100,0,0.2), 0 0 160px rgba(255,60,0,0.1)",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
        backdropFilter: "blur(8px)",
        padding: "40px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      }}>
        {/* Aesthetic top border line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          background: "linear-gradient(90deg, #D2143A, #FFD700, #009E60)"
        }} />

        {/* Title */}
        <div style={{
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 6,
          display: "inline-block"
        }}>
          🔥 <span style={{
            backgroundImage: "linear-gradient(to right, #D2143A, #FFD700, #009E60)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>DEEP DUB VIBES</span>
        </div>
        <div style={{ 
          fontSize: 10, 
          color: "#FF8C00", 
          letterSpacing: 3, 
          textTransform: "uppercase", 
          marginBottom: 36,
          fontWeight: "bold"
        }}>
          Hologram AI Records · TUC Auth
        </div>

        {/* Spinning Vinyl Graphic for Auth Screen */}
        <div style={{
          position: "relative",
          width: 140,
          height: 140,
          marginBottom: 36,
          borderRadius: "50%",
          boxShadow: "0 0 30px rgba(255,215,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Animated vinyl base */}
          <div style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "#111",
            border: "2px solid #222",
            position: "absolute",
            animation: "spinSlow 10s linear infinite"
          }} />
          
          {/* Inner groove circles */}
          <div style={{
            width: "80%",
            height: "80%",
            borderRadius: "50%",
            border: "1px solid #1a1a1a",
            position: "absolute"
          }} />
          <div style={{
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            border: "1px solid #1a1a1a",
            position: "absolute"
          }} />

          {/* Central Label */}
          <div style={{
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            background: "#FFD700",
            position: "absolute",
            border: "1px solid #D2143A",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}>
            <div style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              background: "linear-gradient(135deg, rgba(210,20,58,0.2), rgba(0,158,96,0.2))"
            }} />
            <div style={{
              fontSize: 6,
              fontWeight: "bold",
              color: "#D2143A",
              zIndex: 1,
              letterSpacing: 0.5
            }}>HOLOGRAM</div>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#000",
              zIndex: 1,
              marginTop: 2
            }} />
          </div>
        </div>

        <style>{`
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .google-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
          }
          .google-btn:active {
            transform: translateY(0);
          }
        `}</style>

        {/* Continue with Google button */}
        <button
          type="button"
          onClick={() => login()}
          disabled={isLoading}
          className="google-btn"
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            border: "none",
            borderRadius: 12,
            color: "#fff",
            fontSize: 14,
            fontWeight: "bold",
            padding: "14px 24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            opacity: isLoading ? 0.7 : 1,
            pointerEvents: isLoading ? "none" : "auto",
          }}
        >
          {/* Google Icon */}
          <svg style={{ width: 18, height: 18, flexShrink: 0 }} viewBox="0 0 24 24">
            <path
              fill="#ffffff"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#ffffff"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              opacity="0.85"
            />
            <path
              fill="#ffffff"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              opacity="0.8"
            />
            <path
              fill="#ffffff"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              opacity="0.9"
            />
          </svg>
          {isLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>

        {/* Footer info text */}
        <div style={{
          marginTop: 40,
          fontSize: 9,
          color: "rgba(255,180,0,0.4)",
          letterSpacing: 1.5,
          textTransform: "uppercase"
        }}>
          Authorized Personnel Only · TUC ICT
        </div>
      </div>
    </div>
  );
}
