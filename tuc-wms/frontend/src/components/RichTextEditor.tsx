import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

/**
 * Tiptap rich-text editor for task descriptions (FR-TASK-002 — "rich text via Tiptap").
 * Emits HTML on change. Controlled-ish: syncs external `value` only when it differs
 * from the current document (avoids cursor jumps while typing).
 */
export default function RichTextEditor({ value, onChange }: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { style: 'outline:none; min-height:96px; padding:10px 12px; font-size:14px;' },
    },
  });

  // Sync when the parent replaces the value (e.g. opening a different task).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const btn = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--tuc-maroon)' : 'transparent',
    color: active ? '#fff' : 'var(--muted)',
    border: '1px solid var(--border)', borderRadius: 6,
    width: 30, height: 28, cursor: 'pointer', fontSize: 13, fontWeight: 700,
  });

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'var(--card)' }}>
      <div style={toolbar}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btn(editor.isActive('bold'))} title="Bold">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={{ ...btn(editor.isActive('italic')), fontStyle: 'italic' }} title="Italic">I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} style={{ ...btn(editor.isActive('strike')), textDecoration: 'line-through' }} title="Strikethrough">S</button>
        <span style={sep} />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btn(editor.isActive('heading', { level: 2 }))} title="Heading">H</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btn(editor.isActive('bulletList'))} title="Bullet list">•</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btn(editor.isActive('orderedList'))} title="Numbered list">1.</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btn(editor.isActive('blockquote'))} title="Quote">”</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={btn(editor.isActive('codeBlock'))} title="Code block">{'</>'}</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

const toolbar: React.CSSProperties = { display: 'flex', gap: 4, padding: 6, borderBottom: '1px solid var(--border)', flexWrap: 'wrap', alignItems: 'center' };
const sep: React.CSSProperties = { width: 1, height: 20, background: 'var(--border)', margin: '0 2px' };
