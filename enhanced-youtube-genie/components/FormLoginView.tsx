import React, { useState } from 'react';

const PLAYFAIR = "'Playfair Display', Georgia, serif";
const INTER    = "Inter, system-ui, sans-serif";

interface FormLoginViewProps {
  appName: string;
  appSubtitle: string;
  onGoogleLogin: () => void;
  error?: string;
  videoBackground?: string;
}

export const FormLoginView: React.FC<FormLoginViewProps> = ({
  appName,
  appSubtitle,
  onGoogleLogin,
  error,
  videoBackground,
}) => {
  const [redirecting, setRedirecting] = useState(false);

  const handleClick = () => {
    setRedirecting(true);
    setTimeout(() => onGoogleLogin(), 300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'hidden',
        opacity: redirecting ? 0 : 1,
        transition: 'opacity 0.3s ease',
        background: videoBackground ? 'transparent' : 'linear-gradient(135deg, #0f0c07 0%, #1a1612 50%, #0f0c07 100%)',
      }}
    >
      {videoBackground && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        >
          <source src={videoBackground} type="video/mp4" />
        </video>
      )}

      {/* Scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo + App Name */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="https://techbridge.edu.gh/static/TUC_LOGO_1.png"
            alt="Techbridge University College"
            style={{ width: '56px', height: 'auto', marginBottom: '16px' }}
          />
          <h1
            style={{
              fontFamily: PLAYFAIR,
              fontSize: '26px',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 6px',
              letterSpacing: '0.02em',
            }}
          >
            {appName}
          </h1>
          <p
            style={{
              fontFamily: INTER,
              fontSize: '12px',
              color: 'rgba(255,255,255,0.55)',
              margin: 0,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Powered by Techbridge AI
          </p>
        </div>

        {/* Glass Card */}
        <div
          style={{
            width: '100%',
            borderRadius: '20px',
            padding: '36px 32px',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(18px) saturate(160%)',
            WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
        >
          <h2
            style={{
              fontFamily: PLAYFAIR,
              fontSize: '22px',
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
              margin: '0 0 8px',
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              fontFamily: INTER,
              fontSize: '14px',
              color: 'rgba(255,255,255,0.65)',
              textAlign: 'center',
              margin: '0 0 28px',
              lineHeight: '1.5',
            }}
          >
            {appSubtitle}
          </p>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleClick}
            disabled={redirecting}
            style={{
              width: '100%',
              padding: '13px 16px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.32)',
              borderRadius: '10px',
              color: '#ffffff',
              fontFamily: INTER,
              fontSize: '14px',
              fontWeight: 500,
              cursor: redirecting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: redirecting ? 0.55 : 1,
              transition: 'background 0.2s, opacity 0.2s',
            }}
            onMouseEnter={e => !redirecting && ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.24)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {redirecting ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {/* OAuth error */}
          {error && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                background: 'rgba(220,38,38,0.22)',
                border: '1px solid rgba(220,38,38,0.40)',
                borderRadius: '8px',
                color: '#fca5a5',
                fontFamily: INTER,
                fontSize: '13px',
                textAlign: 'center',
                lineHeight: '1.5',
              }}
            >
              {error}
            </div>
          )}

          <p
            style={{
              fontFamily: INTER,
              fontSize: '12px',
              color: 'rgba(255,255,255,0.40)',
              textAlign: 'center',
              margin: '20px 0 0',
              lineHeight: '1.6',
            }}
          >
            We use Google authentication to protect our tools.
          </p>
        </div>
      </div>
    </div>
  );
};
