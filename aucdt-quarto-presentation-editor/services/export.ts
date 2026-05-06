import type { PresentationData } from '../types';
import { markdownToHtml } from './parser';

export const generateHtmlForExport = (data: PresentationData): string => {
  const { frontmatter, slides } = data;
  const title = frontmatter.title?.replace(/<br>/g, ' ') || 'AUCDT Presentation';

  const titleSlideHtml = `
    <div class="slide active title-slide">
      <div>
        ${frontmatter.title ? `<h1>${frontmatter.title}</h1>` : ''}
        ${frontmatter.subtitle ? `<h2 class="subtitle">${frontmatter.subtitle}</h2>` : ''}
        ${frontmatter.author ? `<p class="author">${frontmatter.author}</p>` : ''}
      </div>
    </div>
  `;

  const contentSlidesHtml = slides.map((slide) => {
    const slideContent = markdownToHtml(slide.content);
    return `
      <div class="slide">
        <div class="slide-content">${slideContent}</div>
      </div>
    `;
  }).join('\\n');

  return `
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --burgundy-primary: #8B1538;
            --burgundy-dark: #6B1028;
            --gold-accent: #D4AF37;
            --gold-light: #F4E4BC;
            --cream-bg: #F8F6F0;
            --warm-beige: #E6D5C7;
            --campus-green: #2E4034;
            --primary-text: #2C1810;
            --light-text: #FFFFFF;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
            width: 100%;
            height: 100%;
            font-family: 'Poppins', sans-serif;
            background: var(--cream-bg);
            color: var(--primary-text);
            line-height: 1.6;
            overflow: hidden;
        }

        .app-wrapper {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100%;
        }

        .header {
            background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy-primary) 100%);
            color: var(--light-text);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 4px solid var(--gold-accent);
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 100;
        }

        .header-title {
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .header-info { display: flex; gap: 2rem; align-items: center; }

        .header-counter {
            font-size: 1rem;
            font-weight: 600;
            background: var(--gold-accent);
            color: var(--burgundy-primary);
            padding: 0.4rem 1rem;
            border-radius: 20px;
            min-width: 80px;
            text-align: center;
        }

        .header-nav { font-size: 0.9rem; opacity: 0.85; }
        .slides-container { flex: 1; position: relative; overflow: hidden; }

        .slide {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            padding: 2rem 3rem 3rem 3rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease-in-out;
            background: var(--cream-bg);
            overflow-y: auto;
        }

        .slide.active { opacity: 1; pointer-events: auto; }

        .footer {
            background: var(--burgundy-dark);
            color: var(--light-text);
            padding: 1rem 2rem;
            font-weight: 500;
            border-top: 4px solid var(--gold-accent);
            flex-shrink: 0;
            text-align: center;
            font-size: 0.9rem;
            z-index: 100;
        }

        .slide-content { max-width: 900px; margin: 0 auto; width: 100%; }
        
        h1, h2, h3, h4 { margin: 1.5rem 0 1rem 0; }
        .slide-content > h2:first-child, .slide-content > h3:first-child, .slide-content > h4:first-child { margin-top: 0; }
        
        h2 {
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--light-text);
            background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy-primary) 100%);
            padding: 1rem 1.5rem;
            margin: -2rem -3rem 1.5rem -3rem;
            border-bottom: 4px solid var(--gold-accent);
            box-shadow: 0 4px 12px rgba(139, 21, 56, 0.3);
        }

        h3 {
            font-size: 1.6rem;
            font-weight: 600;
            color: var(--burgundy-dark);
            border-left: 6px solid var(--gold-accent);
            padding-left: 1rem;
        }

        h4 {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--burgundy-primary);
            border-bottom: 3px solid var(--gold-accent);
            padding-bottom: 0.5rem;
            display: inline-block;
        }

        .title-slide {
            text-align: center;
            background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy-primary) 100%);
            color: var(--light-text);
            justify-content: center;
            align-items: center;
        }

        .title-slide h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin: 0; padding: 0; background: none; border: none;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: -1px;
        }

        .title-slide .subtitle {
            font-size: 1.8rem;
            font-weight: 600;
            background: var(--gold-light);
            color: var(--burgundy-primary);
            padding: 1.2rem 2.5rem;
            display: inline-block;
            border-left: 6px solid var(--gold-accent);
            margin: 2rem 0;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .title-slide .author {
            font-size: 1.3rem;
            font-weight: 500;
            color: var(--gold-light);
            margin-top: 2rem;
            letter-spacing: 0.5px;
        }

        .highlight-box {
            background: var(--light-text);
            border-left: 6px solid var(--gold-accent);
            border-top: 2px solid var(--gold-light);
            padding: 1.5rem; margin: 1.5rem 0;
            box-shadow: 0 4px 12px rgba(139, 21, 56, 0.15);
            border-radius: 4px;
        }

        .burgundy-box {
            background: var(--burgundy-primary);
            color: var(--light-text);
            padding: 1.5rem; border-radius: 4px;
            border-top: 6px solid var(--gold-accent);
            margin: 1.5rem 0;
            box-shadow: 0 4px 12px rgba(139, 21, 56, 0.4);
        }
        .burgundy-box strong { color: var(--gold-accent); }
        
        .key-point {
            background: linear-gradient(135deg, var(--gold-light) 0%, var(--warm-beige) 100%);
            padding: 1.5rem; border-radius: 4px;
            border: 3px solid var(--gold-accent);
            margin: 1.5rem 0; font-weight: 500;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .columns {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem; margin: 1.5rem 0;
        }

        .column {
            background: var(--light-text);
            padding: 1.5rem; border-radius: 4px;
            border-left: 4px solid var(--gold-accent);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        ul { list-style: none; padding-left: 0; margin: 1rem 0; }
        ul li { padding: 0.6rem 0 0.6rem 2rem; position: relative; line-height: 1.5; }
        ul li:before {
            content: "▸";
            color: var(--gold-accent);
            font-weight: bold;
            position: absolute; left: 0; font-size: 1.2em;
        }
        strong { color: var(--burgundy-primary); font-weight: 600; }
    </style>
</head>
<body>
    <div class="app-wrapper">
        <div class="header">
            <span class="header-title">${title} • AUCDT</span>
            <div class="header-info">
                <span class="header-counter"><span id="current">1</span> / <span id="total">${slides.length + 1}</span></span>
                <span class="header-nav">← → or Space</span>
            </div>
        </div>
        <div class="slides-container">
            ${titleSlideHtml}
            ${contentSlidesHtml}
        </div>
        <div class="footer">
            AUCDT - Excellence in Design & Technology
        </div>
    </div>
    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        const counter = document.getElementById('current');

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[n].classList.add('active');
            counter.textContent = n + 1;
        }

        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                showSlide(currentSlide);
            }
        }

        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                showSlide(currentSlide);
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault(); nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault(); prevSlide();
            }
        });
        showSlide(0);
    </script>
</body>
</html>
  `;
};
