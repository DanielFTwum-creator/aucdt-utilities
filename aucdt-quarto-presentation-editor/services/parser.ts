import type { Frontmatter, Slide, PresentationData } from '../types';

const parseFrontmatter = (text: string): Frontmatter => {
  const frontmatter: Frontmatter = {};
  const lines = text.split('\n');
  lines.forEach(line => {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (key === 'title' || key === 'subtitle' || key === 'author') {
        // Keep potential HTML like <br> in title
        frontmatter[key as keyof Frontmatter] = value.replace(/^['"]|['"]$/g, '').trim();
      }
    }
  });
  return frontmatter;
};

export const parseQmd = (content: string): PresentationData => {
  let frontmatter: Frontmatter = {};
  let markdownContent = content;

  const yamlMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);
  if (yamlMatch) {
    frontmatter = parseFrontmatter(yamlMatch[1]);
    markdownContent = content.substring(yamlMatch[0].length);
  }

  // Split slides by '## ' but handle the case where the first slide has no title
  const slideSplits = markdownContent.trim().split(/(?:\r?\n)## /);

  const slides: Slide[] = slideSplits
    .map((slideContent, index) => {
      if (index === 0 && !markdownContent.trim().startsWith('## ')) {
        // This is the content before the first H2, if it exists
        if (slideContent.trim() === '') return null;
        return {
          id: `slide-0`,
          content: slideContent.trim(),
        };
      }
      
      if (slideContent.trim() === '') return null;
      
      // Re-add the '## ' that was removed by split()
      const finalContent = `## ${slideContent}`;

      return {
        id: `slide-${index}`,
        content: finalContent.trim(),
      };
    })
    .filter((s): s is Slide => s !== null && s.content !== '');
    
  // A presentation with only frontmatter and no slides is valid
  // But if there's content, ensure the first slide is captured
  if (slides.length === 0 && markdownContent.trim() !== '') {
    slides.push({ id: 'slide-0', content: markdownContent.trim() });
  }

  return { frontmatter, slides };
};

// Shared markdown-to-HTML parser
const parseInline = (text: string): string => {
  return text
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" style="margin: 1rem auto; border-radius: 0.25rem; max-width: 100%; height: auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);" />')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
};

export const markdownToHtml = (markdown: string): string => {
  // Regex to split by double newlines, but not inside HTML tags
  const blocks = markdown.trim().split(/(\n\s*\n)/)
    .reduce((acc, part) => {
        if (part.trim() === '') {
            if (acc.length > 0 && !acc[acc.length - 1].isHtml) {
                acc[acc.length - 1].content += '\n\n';
            }
        } else if (part.startsWith('<div')) {
            acc.push({ content: part, isHtml: true });
        } else if (acc.length > 0 && acc[acc.length - 1].isHtml) {
            acc.push({ content: part, isHtml: false });
        } else if (acc.length > 0) {
            acc[acc.length - 1].content += part;
        } else {
            acc.push({ content: part, isHtml: false });
        }
        return acc;
    }, [] as { content: string, isHtml: boolean }[]);

  return blocks.map(({ content, isHtml }) => {
    if (isHtml) return content; // Passthrough for HTML blocks

    const block = content.trim();
    if (block.startsWith('## ')) return `<h2>${parseInline(block.substring(3))}</h2>`;
    if (block.startsWith('### ')) return `<h3>${parseInline(block.substring(4))}</h3>`;
    if (block.startsWith('#### ')) return `<h4>${parseInline(block.substring(5))}</h4>`;
    if (block.match(/^(\s*-\s)/)) { // List block
      const items = block.split('\n').map(item => {
        const content = item.replace(/^\s*-\s/, '');
        return `<li>${parseInline(content)}</li>`;
      }).join('');
      return `<ul>${items}</ul>`;
    }
    return `<p>${parseInline(block.replace(/\n/g, '<br/>'))}</p>`; // Paragraph
  }).join('');
};
