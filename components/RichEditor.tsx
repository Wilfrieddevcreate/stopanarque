"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ active, disabled, onClick, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-all ${
        active
          ? "bg-primary text-white shadow-sm"
          : "text-gray-500 hover:bg-gray-100 hover:text-foreground"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-border mx-0.5 shrink-0" />;
}

export function RichEditor({ value, onChange, placeholder, minHeight = 280 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Placeholder.configure({ placeholder: placeholder || "Rédigez votre contenu ici…" }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none px-4 py-3",
        style: `min-height: ${minHeight}px`,
      },
    },
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. switching language tabs)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || "";
    if (current !== incoming && incoming !== (current === "<p></p>" ? "" : current)) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const can = editor.can().chain().focus();

  return (
    <div className="rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-colors bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap px-2 py-2 border-b border-border bg-gray-50/80">
        {/* Text style */}
        <ToolbarButton
          title="Gras (Ctrl+B)"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!can.toggleBold().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" opacity=".4"/>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
          </svg>
        </ToolbarButton>

        <ToolbarButton
          title="Italique (Ctrl+I)"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!can.toggleItalic().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/>
            <line x1="15" y1="4" x2="9" y2="20"/>
          </svg>
        </ToolbarButton>

        <ToolbarButton
          title="Souligné (Ctrl+U)"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 4v6a6 6 0 0 0 12 0V4"/>
            <line x1="4" y1="20" x2="20" y2="20"/>
          </svg>
        </ToolbarButton>

        <ToolbarButton
          title="Barré"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!can.toggleStrike().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          title="Titre 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>

        <ToolbarButton
          title="Titre 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <span className="text-xs font-bold">H3</span>
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          title="Liste à puces"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/>
            <line x1="9" y1="18" x2="20" y2="18"/>
            <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/>
            <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/>
            <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </ToolbarButton>

        <ToolbarButton
          title="Liste numérotée"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/>
            <line x1="10" y1="18" x2="21" y2="18"/>
            <path d="M4 6h1v4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 10h2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </ToolbarButton>

        <ToolbarButton
          title="Citation"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          title="Aligner à gauche"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/>
            <line x1="3" y1="18" x2="18" y2="18"/>
          </svg>
        </ToolbarButton>

        <ToolbarButton
          title="Centrer"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </ToolbarButton>

        <ToolbarButton
          title="Aligner à droite"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/>
            <line x1="6" y1="18" x2="21" y2="18"/>
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          title="Insérer un lien"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </ToolbarButton>

        <ToolbarButton
          title="Code en ligne"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!can.toggleCode().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </ToolbarButton>

        <Divider />

        {/* History */}
        <ToolbarButton
          title="Annuler (Ctrl+Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!can.undo().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
          </svg>
        </ToolbarButton>

        <ToolbarButton
          title="Rétablir (Ctrl+Y)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!can.redo().run()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Word count */}
      <div className="px-4 py-1.5 border-t border-border bg-gray-50/50 flex justify-end">
        <span className="text-[11px] text-muted">
          {editor.storage.characterCount?.characters?.() ??
            editor.getText().length} caractères
        </span>
      </div>
    </div>
  );
}
