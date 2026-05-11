import { PosterData, AspectRatio } from '../types';
import { TOKENS, getPosterDimensions, getLogoSize, getStatsBarHeight, getStripHeight, getHeadlineSizeClass } from '../constants';

export const getPosterHtml = (data: PosterData) => {
  const dims = getPosterDimensions(data.aspectRatio);
  const isVertical = data.aspectRatio === AspectRatio.PORTRAIT || data.aspectRatio === AspectRatio.STORY;
  const isStory = data.aspectRatio === AspectRatio.STORY;
  const isCinema = data.aspectRatio === AspectRatio.CINEMA;
  const isSquare = data.aspectRatio === AspectRatio.SQUARE;
  const isLandscape = data.aspectRatio === AspectRatio.LANDSCAPE || !data.aspectRatio;

  const statsBg = (isStory || isCinema) ? TOKENS.espressoDeep : isSquare ? '#100604' : TOKENS.espresso;
  const headlineSize = getHeadlineSizeClass(data.aspectRatio);
  const logoSize = getLogoSize(data.aspectRatio);
  const stripH = getStripHeight(data.aspectRatio);
  const barH = getStatsBarHeight(data.aspectRatio);

  const titleCaseUrgency = data.urgencyText.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.brandName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Barlow+Condensed:wght@400;500;600&family=JetBrains+Mono:wght@300;400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['Libre Baskerville', 'serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                        condensed: ['Barlow Condensed', 'sans-serif'],
                    },
                    colors: {
                        'tuc-parchment': '${TOKENS.parchment}',
                        'tuc-crimson': '${TOKENS.crimson}',
                        'tuc-gold': '${TOKENS.gold}',
                        'tuc-espresso': '${TOKENS.espresso}',
                        'tuc-espresso-deep': '${TOKENS.espressoDeep}',
                        'tuc-text-primary': '${TOKENS.textPrimary}',
                        'tuc-text-muted': '${TOKENS.textMuted}',
                    }
                }
            }
        }
    </script>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: ${TOKENS.bgPage}; }
        .poster-container {
            width: ${dims.width}px;
            height: ${dims.height}px;
            background-color: ${TOKENS.parchment};
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 40px 100px -20px rgba(0,0,0,0.3);
            font-family: 'Inter', sans-serif;
            color: ${TOKENS.textPrimary};
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        @keyframes slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-down {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
            from { transform: translateY(12px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-marquee { display: flex; animation: marquee 18s linear infinite; }
        .animate-in { animation: fade-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.44s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .animate-slide-down { animation: slide-down 0.4s ease-out forwards; opacity: 0; }
        
        .marquee-mask {
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        .cta-sweep {
            position: relative;
            overflow: hidden;
            transition: color 220ms ease-out;
            z-index: 10;
        }
        .cta-sweep::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: ${TOKENS.crimson};
            transition: transform 220ms ease-out;
            z-index: -1;
        }
        .cta-sweep:hover::before { transform: translateX(100%); }
        .cta-sweep:hover { color: white !important; }
    </style>
</head>
<body>
    <div class="poster-container">
        <!-- Strip -->
        <div style="height: ${stripH}; background: ${TOKENS.crimson}; overflow: hidden; display: flex; align-items: center;" class="marquee-mask">
            ${isSquare ? `
                <div class="w-full text-center">
                    <span style="font-family: 'Barlow Condensed'; font-size: 9px; font-weight: 500; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.3em;">
                        ${data.urgencyText}
                    </span>
                </div>
            ` : `
                <div class="animate-marquee" style="display: flex; flex-direction: row; flex-wrap: nowrap;">
                    <div style="display: flex; align-items: center; white-space: nowrap; flex-direction: row; flex-wrap: nowrap;">
                        ${[1, 2].map(() => `
                            <div style="display: flex; align-items: center; flex-shrink: 0; flex-direction: row; flex-wrap: nowrap;">
                                ${Array(8).fill(`
                                    <div style="display: flex; align-items: center; flex-shrink: 0; flex-direction: row; flex-wrap: nowrap;">
                                        <span style="font-family: 'Barlow Condensed'; font-size: 12px; font-weight: 500; color: #FAF7F0; margin: 0 16px; letter-spacing: -0.04em; text-transform: uppercase; white-space: nowrap;">${data.urgencyText}</span>
                                        <span style="color: ${TOKENS.gold}; font-size: 0.7em;">✦</span>
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `}
        </div>

        <div style="flex: 1; display: flex; flex-direction: ${isVertical || isSquare ? 'column' : 'row'}; position: relative;">
            <div style="flex: ${isLandscape ? '7' : isCinema ? '55' : '1'}; display: flex; flex-direction: column; justify-content: center; padding: ${isVertical ? (isStory ? '28px 20px' : '20px 24px') : isSquare ? '40px 20px' : '48px'}; text-align: ${data.aspectRatio === AspectRatio.PORTRAIT ? 'center' : 'left'};">
                <div style="display: flex; align-items: center; justify-content: ${data.aspectRatio === AspectRatio.PORTRAIT ? 'center' : 'start'}; gap: 12px; margin-bottom: 10px; border-left: 2px solid ${TOKENS.gold}; padding-left: 8px; margin-left: ${data.aspectRatio === AspectRatio.PORTRAIT ? 'auto' : '0'}; margin-right: ${data.aspectRatio === AspectRatio.PORTRAIT ? 'auto' : '0'};">
                    <div style="font-family: 'Barlow Condensed'; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: ${TOKENS.textMuted};">${isLandscape ? 'LIMITED INTAKE · JULY 26 COHORT' : data.eyebrow}</div>
                </div>
                <h1 style="font-family: 'Libre Baskerville'; font-size: ${headlineSize}; line-height: 0.95; margin-bottom: 24px; letter-spacing: -0.03em;">
                    <span style="display: block;">${data.headlineLine1}</span>
                    <span style="color: ${TOKENS.crimson}; font-style: italic; position: relative; top: 3px; display: block;">${data.headlineLine2}</span>
                    <span style="display: block;">${data.headlineLine3}</span>
                    ${data.headlineLine4 ? `<span style="display: block;">${data.headlineLine4}</span>` : ''}
                </h1>
                
                ${isLandscape ? `
                    <div style="background: radial-gradient(circle at center, #FBF3DC 0%, transparent 100%); background-color: #FFFDF4; border: 0.5px solid rgba(200, 184, 152, 0.3); display: flex; flex-direction: column; padding: 16px 20px; border-radius: 16px 4px 16px 4px; width: fit-content; max-width: 280px;">
                        <div style="font-family: 'Barlow Condensed'; font-weight: 500; font-size: 9px; letter-spacing: 0.1em; color: ${TOKENS.crimson}; text-transform: uppercase; margin-bottom: 6px;">SECURE ADMISSION</div>
                        <div style="font-family: 'JetBrains Mono'; font-weight: 300; font-size: 13px; color: ${TOKENS.textMuted}; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${data.ctaUrl.replace(/^https?:\/\//, '')} →</div>
                        <div style="display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px; border: 1.5px solid ${TOKENS.crimson}; font-weight: 600; border-radius: 4px; text-transform: uppercase; font-size: 12px; font-family: 'Barlow Condensed'; color: ${TOKENS.crimson}; letter-spacing: 0.08em; width: fit-content;">
                            ${data.ctaText}
                        </div>
                    </div>
                ` : `
                    <div style="display: inline-flex; align-items: center; gap: 12px; padding: 16px 32px; border: 1px solid ${TOKENS.crimson}; font-weight: bold; border-radius: ${isStory || data.aspectRatio === AspectRatio.PORTRAIT ? '4px' : '16px 4px 16px 4px'}; text-transform: uppercase; font-size: 14px; width: ${isStory ? '100%' : 'fit-content'}; justify-content: center; background: ${isStory ? TOKENS.crimson : 'transparent'}; color: ${isStory ? 'white' : TOKENS.crimson};">
                        ${data.ctaText}
                    </div>
                `}
            </div>

            ${isCinema ? `<div style="width: 0.5px; height: 60%; background: rgba(200, 184, 152, 0.3); position: absolute; left: 55%; top: 50%; transform: translateY(-50%);"></div>` : ''}

            <div style="flex: ${isLandscape ? '3' : isCinema ? '45' : '1'}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: ${isVertical ? '40px' : '24px'}; text-align: center;">
                <div style="width: ${logoSize}px; height: ${logoSize}px; border-radius: 18%; border: 1px solid ${TOKENS.crimson}; padding: 8px; background: ${TOKENS.parchment}; display: flex; align-items: center; justify-content: center;">
                    <img src="${data.logoUrl}" style="width: 88%; height: 88%; object-fit: contain;">
                </div>
                <div style="margin-top: 8px;">
                    <div style="font-weight: bold; text-transform: uppercase; letter-spacing: 0.18em; font-size: 10px; color: ${TOKENS.textMuted}; line-height: 1.5;">${data.brandName.toUpperCase().replace(' UNIVERSITY COLLEGE', '').replace('UNIVERSITY COLLEGE', '')}<br>UNIVERSITY COLLEGE</div>
                    <div style="font-family: 'JetBrains Mono'; font-weight: 300; font-size: 11px; color: ${TOKENS.crimson}; text-align: center;">${data.domainUrl}</div>
                </div>
            </div>
        </div>

        <div style="height: ${barH}; background: ${statsBg}; display: flex; margin: 0; position: relative;">
            ${[
              { v: data.stat1Value, l: data.stat1Label },
              { v: data.stat2Value, l: data.stat2Label },
              { v: data.stat3Value, l: data.stat3Label }
            ].map((stat, i) => `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; white-space: nowrap; position: relative; padding: 0 24px; min-width: 0; overflow: hidden;">
                <span style="font-family: 'Libre Baskerville'; font-size: ${isStory ? '32px' : isSquare ? '22px' : '28px'}; color: ${TOKENS.gold}; font-weight: bold; flex-shrink: 0; line-height: 1;">${stat.v}</span>
                <span style="font-size: ${isStory ? '12px' : '11.5px'}; color: #888888; text-transform: uppercase; letter-spacing: 0.1em; flex-shrink: 0; line-height: 1;">${stat.l}</span>
                ${i < 2 ? `<div style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 0.5px; height: 70%; background: rgba(255,255,255,0.2);"></div>` : ''}
              </div>
            `).join('')}
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 1px; background: linear-gradient(to right, transparent, rgba(196,154,34,0.3), transparent);"></div>
        </div>
    </div>
</body>
</html>`;
};
