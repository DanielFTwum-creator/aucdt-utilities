import { useState, useRef, useEffect, useCallback } from "react";

const THUMB_W = 1280;
const THUMB_H = 720;

function ThumbnailPreview({ bgImage, title1, title2, artist1, artist2, badge, scale = 1 }) {
  const w = THUMB_W * scale;
  const h = THUMB_H * scale;
  const s = (v) => v * scale;

  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Bebas Neue', sans-serif",
        flexShrink: 0,
      }}
    >
      {/* BG Image */}
      {bgImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "brightness(0.85) saturate(1.2)",
          }}
        />
      )}
      {!bgImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #0a0a1a 0%, #1a0020 40%, #001a2a 100%)",
          }}
        />
      )}

      {/* Overlays */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.05) 60%, transparent 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(180,0,80,0.45) 0%, transparent 50%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(0,180,220,0.25) 0%, transparent 55%)" }} />

      {/* Scanlines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)", pointerEvents: "none" }} />

      {/* Glow orbs */}
      <div style={{ position: "absolute", bottom: s(-60), left: s(-60), width: s(400), height: s(400), background: "radial-gradient(circle, rgba(255,10,108,0.35) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: s(-80), right: s(-80), width: s(450), height: s(450), background: "radial-gradient(circle, rgba(0,229,255,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Slash accents */}
      <div style={{ position: "absolute", top: s(-60), right: s(80), width: s(8), height: s(900), background: "linear-gradient(180deg, transparent, #ff0a6c, #ffdd00, #00e5ff, transparent)", transform: "rotate(12deg)", opacity: 0.7 }} />
      <div style={{ position: "absolute", top: s(-60), right: s(60), width: s(3), height: s(900), background: "linear-gradient(180deg, transparent, #ff0a6c80, transparent)", transform: "rotate(12deg)", opacity: 0.5 }} />

      {/* Neon bottom line */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: s(5), background: "linear-gradient(90deg, #ff0a6c, #ffdd00, #00e5ff, #ff0a6c)", boxShadow: `0 0 ${s(20)}px rgba(255,10,108,0.8), 0 0 ${s(40)}px rgba(0,229,255,0.5)` }} />

      {/* Badges */}
      {badge && (
        <div style={{
          position: "absolute", top: s(28), right: s(50),
          background: "linear-gradient(135deg, #ff0a6c, #ff6b00)",
          color: "#fff",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontStyle: "italic", fontWeight: 900,
          fontSize: s(22), letterSpacing: s(3),
          padding: `${s(8)}px ${s(20)}px`,
          clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          {badge}
        </div>
      )}
      <div style={{
        position: "absolute", top: s(28), left: s(50),
        background: "rgba(0,0,0,0.6)",
        border: `${s(1.5)}px solid rgba(255,255,255,0.3)`,
        color: "rgba(255,255,255,0.75)",
        fontFamily: "'Barlow Condensed', sans-serif",
        fontStyle: "italic", fontWeight: 900,
        fontSize: s(17), letterSpacing: s(2),
        padding: `${s(7)}px ${s(16)}px`,
        textTransform: "uppercase",
        backdropFilter: "blur(4px)",
      }}>
        ⚡ SUNO.AI
      </div>

      {/* Main Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: `0 ${s(60)}px ${s(42)}px ${s(60)}px` }}>
        {/* Row 1: BUSS DI */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: s(-8) }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: s(148), lineHeight: 0.88, letterSpacing: s(6),
            color: "#ffffff",
            textShadow: `0 0 ${s(60)}px rgba(255,10,108,0.8), 0 0 ${s(120)}px rgba(255,10,108,0.4), ${s(4)}px ${s(4)}px 0px rgba(0,0,0,0.9)`,
          }}>
            {title1 || "BUSS"}
          </span>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontStyle: "italic", fontWeight: 900,
            fontSize: s(90), lineHeight: 0.88, letterSpacing: s(4),
            color: "#ffdd00",
            textShadow: `0 0 ${s(40)}px rgba(255,210,0,0.7), ${s(3)}px ${s(3)}px 0px rgba(0,0,0,0.9)`,
            marginLeft: s(12),
          }}>
            &nbsp;DI
          </span>
        </div>

        {/* Row 2: CYLINDER */}
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: s(148), lineHeight: 0.88, letterSpacing: s(6),
            color: "#00e5ff",
            textShadow: `0 0 ${s(60)}px rgba(0,229,255,0.8), 0 0 ${s(120)}px rgba(0,229,255,0.4), ${s(4)}px ${s(4)}px 0px rgba(0,0,0,0.9)`,
          }}>
            {title2 || "CYLINDER"}
          </span>
        </div>

        {/* Artists */}
        <div style={{ marginTop: s(16), display: "flex", alignItems: "center", gap: s(18) }}>
          {artist1 && (
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontStyle: "italic", fontWeight: 900,
              fontSize: s(38), letterSpacing: s(4),
              color: "#ffffff", textTransform: "uppercase",
              textShadow: `${s(2)}px ${s(2)}px ${s(8)}px rgba(0,0,0,0.9)`,
            }}>
              {artist1}
            </span>
          )}
          {artist1 && artist2 && (
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: s(30), color: "#ff0a6c",
              textShadow: `0 0 ${s(20)}px rgba(255,10,108,0.9)`,
            }}>✦</span>
          )}
          {artist2 && (
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontStyle: "italic", fontWeight: 900,
              fontSize: s(38), letterSpacing: s(4),
              color: "#ffffff", textTransform: "uppercase",
              textShadow: `${s(2)}px ${s(2)}px ${s(8)}px rgba(0,0,0,0.9)`,
            }}>
              {artist2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [bgImage, setBgImage] = useState(null);
  const [title1, setTitle1] = useState("BUSS");
  const [title2, setTitle2] = useState("CYLINDER");
  const [artist1, setArtist1] = useState("DJ KoFAI");
  const [artist2, setArtist2] = useState("DJ CySTorm");
  const [badge, setBadge] = useState("🔥 NEW DROP");
  const [previewScale, setPreviewScale] = useState(0.5);
  const [exporting, setExporting] = useState(false);
  const fileRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const updateScale = () => {
      const maxW = window.innerWidth - 80;
      setPreviewScale(Math.min(0.6, maxW / THUMB_W));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const exportThumbnail = useCallback(async () => {
    setExporting(true);
    // We render using html2canvas-like approach with a hidden iframe at full size
    // Since html2canvas isn't available, we'll use a canvas-based render

    const canvas = document.createElement("canvas");
    canvas.width = THUMB_W;
    canvas.height = THUMB_H;
    const ctx = canvas.getContext("2d");

    const drawRoundRect = (x, y, w, h, r, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    };

    const loadImg = (src) => new Promise((res, rej) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });

    // BG
    if (bgImage) {
      try {
        const img = await loadImg(bgImage);
        const scale = Math.max(THUMB_W / img.width, THUMB_H / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        ctx.filter = "brightness(85%) saturate(120%)";
        ctx.drawImage(img, (THUMB_W - sw) / 2, 0, sw, sh);
        ctx.filter = "none";
      } catch {}
    } else {
      const grad = ctx.createLinearGradient(0, 0, THUMB_W, THUMB_H);
      grad.addColorStop(0, "#0a0a1a");
      grad.addColorStop(0.4, "#1a0020");
      grad.addColorStop(1, "#001a2a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, THUMB_W, THUMB_H);
    }

    // Overlay bottom
    const ov1 = ctx.createLinearGradient(0, THUMB_H, 0, 0);
    ov1.addColorStop(0, "rgba(0,0,0,0.92)");
    ov1.addColorStop(0.35, "rgba(0,0,0,0.55)");
    ov1.addColorStop(0.6, "rgba(0,0,0,0.05)");
    ov1.addColorStop(1, "transparent");
    ctx.fillStyle = ov1;
    ctx.fillRect(0, 0, THUMB_W, THUMB_H);

    // Overlay left
    const ov2 = ctx.createLinearGradient(0, 0, THUMB_W, 0);
    ov2.addColorStop(0, "rgba(180,0,80,0.45)");
    ov2.addColorStop(0.5, "transparent");
    ctx.fillStyle = ov2;
    ctx.fillRect(0, 0, THUMB_W, THUMB_H);

    // Overlay right
    const ov3 = ctx.createLinearGradient(THUMB_W, 0, 0, 0);
    ov3.addColorStop(0, "rgba(0,180,220,0.25)");
    ov3.addColorStop(0.55, "transparent");
    ctx.fillStyle = ov3;
    ctx.fillRect(0, 0, THUMB_W, THUMB_H);

    // Glow orb pink (bottom-left)
    const go1 = ctx.createRadialGradient(-60, THUMB_H + 60, 0, -60, THUMB_H + 60, 400);
    go1.addColorStop(0, "rgba(255,10,108,0.35)");
    go1.addColorStop(0.65, "transparent");
    ctx.fillStyle = go1;
    ctx.fillRect(0, 0, THUMB_W, THUMB_H);

    // Glow orb cyan (top-right)
    const go2 = ctx.createRadialGradient(THUMB_W + 80, -80, 0, THUMB_W + 80, -80, 450);
    go2.addColorStop(0, "rgba(0,229,255,0.2)");
    go2.addColorStop(0.65, "transparent");
    ctx.fillStyle = go2;
    ctx.fillRect(0, 0, THUMB_W, THUMB_H);

    // Slash accent
    ctx.save();
    ctx.translate(THUMB_W - 80 + 4, -60);
    ctx.rotate((12 * Math.PI) / 180);
    const sa = ctx.createLinearGradient(0, 0, 0, 900);
    sa.addColorStop(0, "transparent");
    sa.addColorStop(0.3, "#ff0a6c");
    sa.addColorStop(0.6, "#ffdd00");
    sa.addColorStop(0.8, "#00e5ff");
    sa.addColorStop(1, "transparent");
    ctx.fillStyle = sa;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-4, 0, 8, 900);
    ctx.globalAlpha = 1;
    ctx.restore();

    // Neon bottom line
    const nb = ctx.createLinearGradient(0, 0, THUMB_W, 0);
    nb.addColorStop(0, "#ff0a6c");
    nb.addColorStop(0.33, "#ffdd00");
    nb.addColorStop(0.66, "#00e5ff");
    nb.addColorStop(1, "#ff0a6c");
    ctx.fillStyle = nb;
    ctx.fillRect(0, THUMB_H - 5, THUMB_W, 5);

    // Suno badge (top-left)
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(50, 28, 140, 46);
    ctx.fill();
    ctx.stroke();
    ctx.font = "italic 900 17px 'Barlow Condensed', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillText("⚡ SUNO.AI", 66, 58);
    ctx.restore();

    // Badge (top-right)
    if (badge) {
      ctx.save();
      const bg = ctx.createLinearGradient(THUMB_W - 210, 28, THUMB_W - 50, 74);
      bg.addColorStop(0, "#ff0a6c");
      bg.addColorStop(1, "#ff6b00");
      ctx.fillStyle = bg;
      ctx.fillRect(THUMB_W - 210, 28, 160, 46);
      ctx.font = "italic 900 22px 'Barlow Condensed', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(badge, THUMB_W - 200, 60);
      ctx.restore();
    }

    // Title text
    ctx.save();
    // BUSS (white, huge)
    ctx.font = `900 148px 'Bebas Neue', sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255,10,108,0.8)";
    ctx.shadowBlur = 60;
    ctx.fillText(title1 || "BUSS", 60, THUMB_H - 200);
    // DI (yellow, italic barlow)
    ctx.font = `italic 900 90px 'Barlow Condensed', sans-serif`;
    ctx.fillStyle = "#ffdd00";
    ctx.shadowColor = "rgba(255,210,0,0.7)";
    ctx.shadowBlur = 40;
    const t1w = ctx.measureText(title1 || "BUSS").width;
    ctx.fillText(" DI", 60 + t1w + 12, THUMB_H - 200);

    // CYLINDER (cyan, huge)
    ctx.font = `900 148px 'Bebas Neue', sans-serif`;
    ctx.fillStyle = "#00e5ff";
    ctx.shadowColor = "rgba(0,229,255,0.8)";
    ctx.shadowBlur = 60;
    ctx.fillText(title2 || "CYLINDER", 60, THUMB_H - 85);
    ctx.restore();

    // Artists
    ctx.save();
    ctx.font = `italic 900 38px 'Barlow Condensed', sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 8;
    let ax = 60;
    const ay = THUMB_H - 42;
    if (artist1) {
      ctx.fillText(artist1.toUpperCase(), ax, ay);
      ax += ctx.measureText(artist1.toUpperCase()).width + 18;
    }
    if (artist1 && artist2) {
      ctx.font = `900 30px 'Bebas Neue', sans-serif`;
      ctx.fillStyle = "#ff0a6c";
      ctx.shadowColor = "rgba(255,10,108,0.9)";
      ctx.shadowBlur = 20;
      ctx.fillText("✦", ax, ay);
      ax += ctx.measureText("✦").width + 18;
    }
    if (artist2) {
      ctx.font = `italic 900 38px 'Barlow Condensed', sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.9)";
      ctx.shadowBlur = 8;
      ctx.fillText(artist2.toUpperCase(), ax, ay);
    }
    ctx.restore();

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `thumbnail-${(title1 + "-" + title2).toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
    setExporting(false);
  }, [bgImage, title1, title2, artist1, artist2, badge]);

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "15px",
    width: "100%",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a14; color: #fff; font-family: 'Barlow Condensed', sans-serif; }
        input:focus { border-color: rgba(0,229,255,0.6) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.3); border-radius: 3px; }
        .upload-zone:hover { border-color: rgba(0,229,255,0.5) !important; background: rgba(0,229,255,0.05) !important; }
        .export-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,10,108,0.5) !important; }
        .export-btn:active { transform: translateY(0); }
        input[type="text"]:hover { border-color: rgba(255,255,255,0.3) !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a14 0%, #0e0018 50%, #000e1a 100%)" }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 40px", display: "flex", alignItems: "center", gap: "16px", background: "rgba(0,0,0,0.3)" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #ff0a6c, #00e5ff)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎵</div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "4px", color: "#fff" }}>THUMBNAIL GENERATOR</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px" }}>YouTube · 1280 × 720</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff0a6c", boxShadow: "0 0 10px rgba(255,10,108,0.8)" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffdd00", boxShadow: "0 0 10px rgba(255,220,0,0.8)" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 10px rgba(0,229,255,0.8)" }} />
          </div>
        </div>

        {/* Main Layout */}
        <div style={{ display: "flex", gap: 0, height: "calc(100vh - 77px)" }}>

          {/* Sidebar */}
          <div style={{ width: "340px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "28px 24px", overflowY: "auto", background: "rgba(0,0,0,0.2)" }}>

            {/* Upload */}
            <div style={{ marginBottom: "28px" }}>
              <span style={labelStyle}>Background Image</span>
              <div
                className="upload-zone"
                onClick={() => fileRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  border: "2px dashed rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: bgImage ? "rgba(0,229,255,0.05)" : "transparent",
                }}
              >
                {bgImage ? (
                  <div>
                    <img src={bgImage} alt="preview" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
                    <div style={{ fontSize: "12px", color: "rgba(0,229,255,0.8)", letterSpacing: "1px" }}>✓ IMAGE LOADED</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>Click to replace</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.5 }}>🖼</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>Drop image or click to upload</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "4px" }}>JPG, PNG, WEBP</div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 0 24px 0" }} />

            {/* Title */}
            <div style={{ marginBottom: "20px" }}>
              <span style={labelStyle}>Title — Line 1 (White)</span>
              <input type="text" value={title1} onChange={(e) => setTitle1(e.target.value)} style={inputStyle} placeholder="BUSS" />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <span style={labelStyle}>Title — Line 2 (Cyan)</span>
              <input type="text" value={title2} onChange={(e) => setTitle2(e.target.value)} style={inputStyle} placeholder="CYLINDER" />
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 0 24px 0" }} />

            {/* Artists */}
            <div style={{ marginBottom: "20px" }}>
              <span style={labelStyle}>Artist 1</span>
              <input type="text" value={artist1} onChange={(e) => setArtist1(e.target.value)} style={inputStyle} placeholder="DJ KoFAI" />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <span style={labelStyle}>Artist 2</span>
              <input type="text" value={artist2} onChange={(e) => setArtist2(e.target.value)} style={inputStyle} placeholder="DJ CySTorm" />
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 0 24px 0" }} />

            {/* Badge */}
            <div style={{ marginBottom: "32px" }}>
              <span style={labelStyle}>Top-Right Badge</span>
              <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} style={inputStyle} placeholder="🔥 NEW DROP" />
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "6px" }}>Leave blank to hide badge</div>
            </div>

            {/* Export */}
            <button
              className="export-btn"
              onClick={exportThumbnail}
              disabled={exporting}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #ff0a6c, #ff6b00)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontStyle: "italic",
                fontWeight: 900,
                fontSize: "18px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: exporting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(255,10,108,0.35)",
                opacity: exporting ? 0.6 : 1,
              }}
            >
              {exporting ? "GENERATING..." : "⬇ EXPORT 1280×720"}
            </button>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "10px", letterSpacing: "1px" }}>Downloads as PNG · Full resolution</div>
          </div>

          {/* Preview Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", background: "rgba(0,0,0,0.1)", overflow: "auto" }}>
            <div style={{ marginBottom: "16px", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "2px", textAlign: "center" }}>
              LIVE PREVIEW · {Math.round(previewScale * 100)}% SCALE
            </div>
            <div style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
              <ThumbnailPreview
                bgImage={bgImage}
                title1={title1}
                title2={title2}
                artist1={artist1}
                artist2={artist2}
                badge={badge}
                scale={previewScale}
              />
            </div>
            <div style={{ marginTop: "16px", fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", textAlign: "center" }}>
              {Math.round(THUMB_W * previewScale)} × {Math.round(THUMB_H * previewScale)} px preview → exports at 1280 × 720
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </>
  );
}
