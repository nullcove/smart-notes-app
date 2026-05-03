"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { FontFamily } from "@tiptap/extension-font-family";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/sql";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Code2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote, Minus,
  Table as TableIcon, Link as LinkIcon, Subscript as SubIcon, Superscript as SupIcon,
  Pilcrow, ChevronDown, Type, Palette, Highlighter,
  RotateCcw, RotateCw, Rows3, Columns3, Trash2, Plus,
} from "lucide-react";

const lowlight = createLowlight();
lowlight.register("javascript", js);
lowlight.register("js", js);
lowlight.register("typescript", ts);
lowlight.register("ts", ts);
lowlight.register("python", python);
lowlight.register("py", python);
lowlight.register("css", css);
lowlight.register("html", html);
lowlight.register("xml", html);
lowlight.register("bash", bash);
lowlight.register("sh", bash);
lowlight.register("json", json);
lowlight.register("sql", sql);
lowlight.register("go", go);
lowlight.register("rust", rust);
lowlight.register("java", java);
lowlight.register("cpp", cpp);
lowlight.register("c++", cpp);

const TEXT_COLORS = [
  { label: "Default", color: "" },
  { label: "Red", color: "#ef4444" },
  { label: "Orange", color: "#f97316" },
  { label: "Yellow", color: "#eab308" },
  { label: "Green", color: "#22c55e" },
  { label: "Blue", color: "#3b82f6" },
  { label: "Purple", color: "#a855f7" },
  { label: "Pink", color: "#ec4899" },
  { label: "Gray", color: "#6b7280" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", color: "#fef08a" },
  { label: "Green", color: "#bbf7d0" },
  { label: "Blue", color: "#bfdbfe" },
  { label: "Pink", color: "#fbcfe8" },
  { label: "Orange", color: "#fed7aa" },
  { label: "Purple", color: "#e9d5ff" },
  { label: "Red", color: "#fecaca" },
];

const FONT_FAMILIES = [
  { label: "Sans-serif", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Monospace", value: "'Fira Code', 'SF Mono', monospace" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
];

const CODE_LANGUAGES = [
  "javascript", "typescript", "python", "html", "css", "bash", "json", "sql", "go", "rust", "java", "cpp",
];

interface Props {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
  fontSize?: number;
  zenMode?: boolean;
}

export function RichTextEditor({ content, onChange, editable = true, fontSize = 15, zenMode = false }: Props) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showHeadingPicker, setShowHeadingPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightPickerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "rte-link" } }),
      Placeholder.configure({ placeholder: "Start writing… use the toolbar above or / for commands" }),
      CharacterCount,
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "javascript" }),
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      FontFamily,
    ],
    content: contentToHtml(content),
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-content",
        spellcheck: "true",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const html = contentToHtml(content);
    if (editor.getHTML() !== html) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor.commands as any).setContent(html, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  /* Close pickers on outside click */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) setShowColorPicker(false);
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(e.target as Node)) setShowHighlightPicker(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: url }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const insertTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setShowTableMenu(false);
  };

  if (!editor) return null;

  const currentHeading = editor.isActive("heading", { level: 1 }) ? "H1"
    : editor.isActive("heading", { level: 2 }) ? "H2"
    : editor.isActive("heading", { level: 3 }) ? "H3"
    : editor.isActive("heading", { level: 4 }) ? "H4"
    : editor.isActive("heading", { level: 5 }) ? "H5"
    : editor.isActive("heading", { level: 6 }) ? "H6"
    : "Text";

  const charCount = editor.storage.characterCount?.characters() ?? 0;
  const wordCount = editor.storage.characterCount?.words() ?? 0;

  return (
    <>
      <style>{`
        .rte-wrap { display: flex; flex-direction: column; flex: 1; overflow: hidden; font-size: ${fontSize}px; }
        .rte-toolbar {
          display: flex; flex-direction: column;
          border-bottom: 1px solid var(--border);
          background: var(--bg-editor); flex-shrink: 0; position: sticky; top: 0; z-index: 20;
        }
        .rte-trow {
          display: flex; align-items: center; gap: 4px; padding: 5px 10px;
          flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none;
        }
        .rte-trow:first-child { border-bottom: 1px solid var(--border); }
        .rte-trow::-webkit-scrollbar { display: none; }
        .rte-grp {
          display: flex; flex-direction: column; align-items: center;
          flex-shrink: 0; background: var(--bg-hover); border-radius: 10px;
          padding: 3px 4px 4px; border: 1px solid var(--border);
        }
        .rte-grp-lbl {
          font-size: 8px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.7px; color: var(--text-faint); padding: 0 2px 3px;
          white-space: nowrap; line-height: 1; align-self: stretch; text-align: center;
        }
        .rte-grp-btns {
          display: flex; align-items: center; gap: 1px;
        }
        .rte-btn {
          background: none; border: none; cursor: pointer;
          padding: 4px 7px; border-radius: 6px; color: var(--text-muted);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; transition: all 0.12s;
          min-width: 28px; height: 28px; white-space: nowrap; gap: 3px;
          position: relative;
        }
        .rte-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
        .rte-btn.active { background: var(--accent-light); color: var(--accent-text); }
        .dark .rte-btn.active { color: var(--accent); }
        .rte-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .rte-sep { width: 1px; height: 20px; background: var(--border); margin: 0 3px; flex-shrink: 0; }
        .rte-picker {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: var(--bg-editor); border: 1px solid var(--border-strong);
          border-radius: 12px; padding: 8px; z-index: 100;
          box-shadow: 0 16px 40px rgba(0,0,0,0.25); animation: scaleIn 0.12s ease;
          min-width: 160px;
        }
        .rte-picker-grid { display: flex; flex-wrap: wrap; gap: 5px; }
        .rte-color-dot {
          width: 22px; height: 22px; border-radius: 6px; cursor: pointer;
          border: 2px solid transparent; transition: transform 0.1s, border-color 0.1s;
        }
        .rte-color-dot:hover { transform: scale(1.25); border-color: var(--border-strong); }
        .rte-picker-item {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 10px; border-radius: 8px; cursor: pointer;
          font-size: 12.5px; color: var(--text-primary);
          transition: background 0.1s; white-space: nowrap;
          background: none; border: none; width: 100%; text-align: left;
        }
        .rte-picker-item:hover { background: var(--bg-hover); }
        .rte-content {
          flex: 1; outline: none; overflow-y: auto; padding: ${zenMode ? "40px 18%" : "20px 32px"} 80px;
          font-size: ${fontSize}px; line-height: 1.8; color: var(--text-primary);
          font-family: inherit; caret-color: var(--accent);
          transition: padding 0.3s ease;
          min-height: 100%;
        }
        .rte-content:focus { outline: none; }
        .rte-content .ProseMirror-focused { outline: none; }
        .rte-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); color: var(--text-faint);
          pointer-events: none; float: left; height: 0;
        }
        /* Headings */
        .rte-content h1 { font-size: 2em; font-weight: 800; line-height: 1.2; margin: 1em 0 0.4em; letter-spacing: -0.5px; }
        .rte-content h2 { font-size: 1.5em; font-weight: 700; line-height: 1.3; margin: 0.9em 0 0.3em; letter-spacing: -0.3px; }
        .rte-content h3 { font-size: 1.25em; font-weight: 600; line-height: 1.4; margin: 0.8em 0 0.3em; }
        .rte-content h4 { font-size: 1.1em; font-weight: 600; margin: 0.7em 0 0.2em; }
        .rte-content h5 { font-size: 1em; font-weight: 600; margin: 0.6em 0 0.2em; }
        .rte-content h6 { font-size: 0.9em; font-weight: 600; color: var(--text-muted); margin: 0.5em 0 0.2em; }
        /* Lists */
        .rte-content ul, .rte-content ol { padding-left: 1.6em; margin: 0.5em 0; }
        .rte-content li { margin: 0.3em 0; }
        .rte-content li > p { margin: 0; }
        /* Task list */
        .rte-content ul[data-type="taskList"] { padding-left: 0.3em; list-style: none; }
        .rte-content ul[data-type="taskList"] li { display: flex; gap: 8px; align-items: flex-start; }
        .rte-content ul[data-type="taskList"] li > label { flex-shrink: 0; margin-top: 3px; cursor: pointer; }
        .rte-content ul[data-type="taskList"] li > label input[type="checkbox"] {
          width: 15px; height: 15px; accent-color: var(--accent); cursor: pointer;
        }
        .rte-content ul[data-type="taskList"] li[data-checked="true"] > div { opacity: 0.5; text-decoration: line-through; }
        /* Code inline */
        .rte-content code {
          background: rgba(99,102,241,0.1); border-radius: 5px;
          padding: 2px 7px; font-size: 0.875em;
          font-family: 'Fira Code', 'SF Mono', 'Consolas', monospace;
          color: var(--accent-text); border: 1px solid rgba(99,102,241,0.18);
        }
        /* Code block */
        .rte-content pre {
          background: #1e1e2e; border-radius: 12px;
          padding: 0; margin: 1em 0; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          position: relative;
        }
        .rte-content pre::before {
          content: attr(data-language);
          position: absolute; top: 10px; right: 14px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
          color: rgba(255,255,255,0.25); text-transform: uppercase;
          font-family: monospace;
        }
        .rte-content pre code {
          display: block; padding: 20px; font-size: 0.88em;
          background: none; color: #cdd6f4; border: none;
          line-height: 1.65; overflow-x: auto; border-radius: 0;
        }
        /* Syntax highlighting — Catppuccin-inspired */
        .rte-content .hljs-keyword, .rte-content .hljs-built_in { color: #cba6f7; }
        .rte-content .hljs-string, .rte-content .hljs-attr { color: #a6e3a1; }
        .rte-content .hljs-number { color: #fab387; }
        .rte-content .hljs-comment { color: #6c7086; font-style: italic; }
        .rte-content .hljs-function, .rte-content .hljs-title { color: #89b4fa; }
        .rte-content .hljs-variable, .rte-content .hljs-name { color: #f38ba8; }
        .rte-content .hljs-operator, .rte-content .hljs-punctuation { color: #94e2d5; }
        .rte-content .hljs-type { color: #f9e2af; }
        .rte-content .hljs-meta { color: #f5c2e7; }
        /* Blockquote */
        .rte-content blockquote {
          border-left: 3px solid var(--accent); padding: 4px 0 4px 16px;
          color: var(--text-muted); font-style: italic; margin: 1em 0;
          background: var(--accent-light); border-radius: 0 8px 8px 0;
          padding-right: 12px;
        }
        .rte-content blockquote p { margin: 0; }
        /* Horizontal rule */
        .rte-content hr {
          border: none; border-top: 2px solid var(--border); margin: 1.5em 0;
        }
        /* Links */
        .rte-content .rte-link {
          color: var(--accent-text); text-decoration: underline;
          text-underline-offset: 3px; cursor: pointer;
        }
        .rte-content .rte-link:hover { opacity: 0.8; }
        /* Table */
        .rte-content table {
          width: 100%; border-collapse: collapse; margin: 1.2em 0;
          font-size: 0.94em; overflow: hidden; border-radius: 10px;
          border: 1px solid var(--border);
        }
        .rte-content td, .rte-content th {
          border: 1px solid var(--border); padding: 9px 14px;
          text-align: left; vertical-align: top; min-width: 80px;
          position: relative;
        }
        .rte-content th {
          background: var(--bg-hover); font-weight: 700;
          color: var(--text-primary); font-size: 0.88em;
          letter-spacing: 0.3px;
        }
        .rte-content tr:nth-child(even) td { background: rgba(99,102,241,0.02); }
        .rte-content .selectedCell { background: rgba(99,102,241,0.1) !important; }
        .rte-content td p, .rte-content th p { margin: 0; }
        /* Marks */
        .rte-content strong { font-weight: 700; }
        .rte-content em { font-style: italic; }
        .rte-content s { text-decoration: line-through; }
        .rte-content u { text-decoration: underline; text-underline-offset: 3px; }
        .rte-content sub { font-size: 0.75em; vertical-align: sub; }
        .rte-content sup { font-size: 0.75em; vertical-align: super; }
        /* Selection */
        .rte-content ::selection { background: rgba(99,102,241,0.2); }
        /* Bubble menu */
        .rte-bubble {
          background: var(--bg-sidebar); border: 1px solid var(--border-strong);
          border-radius: 10px; padding: 3px 5px; display: flex; gap: 1px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          animation: popUp 0.14s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        /* Link input */
        .rte-link-input {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: var(--bg-editor); border: 1px solid var(--border-strong);
          border-radius: 10px; padding: 8px; z-index: 100;
          box-shadow: 0 12px 30px rgba(0,0,0,0.25); display: flex; gap: 6px;
          min-width: 280px; animation: scaleIn 0.12s ease;
        }
        .rte-link-input input {
          flex: 1; border: 1px solid var(--border); background: var(--bg-hover);
          border-radius: 7px; padding: 6px 10px; font-size: 13px;
          color: var(--text-primary); outline: none;
        }
        .rte-link-input input:focus { border-color: var(--accent); }
        .rte-link-input button {
          padding: 6px 12px; border-radius: 7px; border: none;
          background: var(--accent); color: white; font-size: 12px;
          font-weight: 700; cursor: pointer;
        }
        .rte-statusbar {
          padding: 5px 32px; border-top: 1px solid var(--border);
          display: flex; gap: 16px; flex-shrink: 0; font-size: 11px;
          color: var(--text-muted); align-items: center;
        }
        .rte-statusbar strong { color: var(--text-primary); opacity: 0.7; font-weight: 600; }
        .rte-code-lang-bar {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; background: rgba(30,30,46,0.9);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .rte-code-lang-select {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 6px; padding: 3px 8px; color: #cdd6f4; font-size: 11px;
          font-family: monospace; cursor: pointer; outline: none;
        }
      `}</style>

      <div className="rte-wrap">
        {/* ════ TOOLBAR ════ */}
        <div className="rte-toolbar" onClick={() => { setShowColorPicker(false); setShowHighlightPicker(false); setShowFontPicker(false); setShowHeadingPicker(false); setShowTableMenu(false); setShowLinkInput(false); }}>

          {/* ── ROW 1: Text Formatting ── */}
          <div className="rte-trow">

            {/* Group: History */}
            <div className="rte-grp">
              <span className="rte-grp-lbl">History</span>
              <div className="rte-grp-btns">
                <button className="rte-btn" onClick={e => { e.stopPropagation(); editor.chain().focus().undo().run(); }} disabled={!editor.can().undo()} title="Undo (⌘Z)"><RotateCcw size={12} /></button>
                <button className="rte-btn" onClick={e => { e.stopPropagation(); editor.chain().focus().redo().run(); }} disabled={!editor.can().redo()} title="Redo (⌘⇧Z)"><RotateCw size={12} /></button>
              </div>
            </div>

            <div className="rte-sep" />

            {/* Group: Type */}
            <div className="rte-grp">
              <span className="rte-grp-lbl">Type</span>
              <div className="rte-grp-btns">
                {/* Heading picker */}
                <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                  <button className={`rte-btn ${currentHeading !== "Text" ? "active" : ""}`}
                    onClick={() => { setShowHeadingPicker(p => !p); setShowColorPicker(false); setShowHighlightPicker(false); setShowFontPicker(false); setShowTableMenu(false); }}
                    title="Paragraph / Heading style">
                    <Pilcrow size={12} />
                    <span style={{ fontSize: 11, minWidth: 20 }}>{currentHeading}</span>
                    <ChevronDown size={9} />
                  </button>
                  {showHeadingPicker && (
                    <div className="rte-picker" style={{ minWidth: 180 }}>
                      {[
                        { label: "Normal text", cmd: () => editor.chain().focus().setParagraph().run(), style: { fontSize: 13 } },
                        { label: "Heading 1", cmd: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), style: { fontSize: 20, fontWeight: 800 } },
                        { label: "Heading 2", cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), style: { fontSize: 17, fontWeight: 700 } },
                        { label: "Heading 3", cmd: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), style: { fontSize: 15, fontWeight: 600 } },
                        { label: "Heading 4", cmd: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), style: { fontSize: 14, fontWeight: 600 } },
                        { label: "Heading 5", cmd: () => editor.chain().focus().toggleHeading({ level: 5 }).run(), style: { fontSize: 13, fontWeight: 600 } },
                        { label: "Heading 6", cmd: () => editor.chain().focus().toggleHeading({ level: 6 }).run(), style: { fontSize: 12, fontWeight: 600, color: "var(--text-muted)" } },
                      ].map(({ label, cmd, style }) => (
                        <button key={label} className="rte-picker-item" style={style} onClick={() => { cmd(); setShowHeadingPicker(false); }}>{label}</button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Font family */}
                <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                  <button className="rte-btn"
                    onClick={() => { setShowFontPicker(p => !p); setShowColorPicker(false); setShowHighlightPicker(false); setShowHeadingPicker(false); setShowTableMenu(false); }}
                    title="Font family">
                    <Type size={12} /><ChevronDown size={9} />
                  </button>
                  {showFontPicker && (
                    <div className="rte-picker" style={{ minWidth: 160 }}>
                      {FONT_FAMILIES.map(f => (
                        <button key={f.label} className="rte-picker-item" style={{ fontFamily: f.value || "inherit" }}
                          onClick={() => { f.value ? editor.chain().focus().setFontFamily(f.value).run() : editor.chain().focus().unsetFontFamily().run(); setShowFontPicker(false); }}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rte-sep" />

            {/* Group: Format */}
            <div className="rte-grp">
              <span className="rte-grp-lbl">Format</span>
              <div className="rte-grp-btns">
                <button className={`rte-btn ${editor.isActive("bold") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (⌘B)"><Bold size={13} /></button>
                <button className={`rte-btn ${editor.isActive("italic") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (⌘I)"><Italic size={13} /></button>
                <button className={`rte-btn ${editor.isActive("underline") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline (⌘U)"><UnderlineIcon size={13} /></button>
                <button className={`rte-btn ${editor.isActive("strike") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><Strikethrough size={13} /></button>
                <button className={`rte-btn ${editor.isActive("subscript") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleSubscript().run()} title="Subscript"><SubIcon size={13} /></button>
                <button className={`rte-btn ${editor.isActive("superscript") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleSuperscript().run()} title="Superscript"><SupIcon size={13} /></button>
              </div>
            </div>

            <div className="rte-sep" />

            {/* Group: Color */}
            <div className="rte-grp">
              <span className="rte-grp-lbl">Color</span>
              <div className="rte-grp-btns">
                {/* Text color */}
                <div ref={colorPickerRef} style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                  <button className="rte-btn"
                    onClick={() => { setShowColorPicker(p => !p); setShowHighlightPicker(false); setShowHeadingPicker(false); setShowFontPicker(false); setShowTableMenu(false); }}
                    title="Text color">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <Palette size={12} />
                      <div style={{ width: 14, height: 3, borderRadius: 2, background: editor.getAttributes("textStyle").color || "var(--text-primary)" }} />
                    </div>
                  </button>
                  {showColorPicker && (
                    <div className="rte-picker">
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Text Color</div>
                      <div className="rte-picker-grid" style={{ marginBottom: 8 }}>
                        {TEXT_COLORS.map(c => (
                          <div key={c.color} className="rte-color-dot" title={c.label}
                            style={{ background: c.color || "var(--text-primary)", border: c.color === "" ? "2px solid var(--border-strong)" : "2px solid transparent" }}
                            onClick={() => { c.color ? editor.chain().focus().setColor(c.color).run() : editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }} />
                        ))}
                      </div>
                      <input type="color" style={{ width: "100%", height: 28, borderRadius: 6, border: "1px solid var(--border)", cursor: "pointer", background: "none" }}
                        onChange={e => editor.chain().focus().setColor(e.target.value).run()} />
                    </div>
                  )}
                </div>
                {/* Highlight */}
                <div ref={highlightPickerRef} style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                  <button className="rte-btn"
                    onClick={() => { setShowHighlightPicker(p => !p); setShowColorPicker(false); setShowHeadingPicker(false); setShowFontPicker(false); setShowTableMenu(false); }}
                    title="Highlight color">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <Highlighter size={12} />
                      <div style={{ width: 14, height: 3, borderRadius: 2, background: editor.getAttributes("highlight").color || "#fef08a" }} />
                    </div>
                  </button>
                  {showHighlightPicker && (
                    <div className="rte-picker">
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Highlight</div>
                      <div className="rte-picker-grid">
                        <div className="rte-color-dot" title="Remove highlight"
                          style={{ background: "var(--bg-hover)", border: "2px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}
                          onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightPicker(false); }}>×</div>
                        {HIGHLIGHT_COLORS.map(c => (
                          <div key={c.color} className="rte-color-dot" title={c.label}
                            style={{ background: c.color }}
                            onClick={() => { editor.chain().focus().toggleHighlight({ color: c.color }).run(); setShowHighlightPicker(false); }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rte-sep" />

            {/* Group: Align */}
            <div className="rte-grp">
              <span className="rte-grp-lbl">Align</span>
              <div className="rte-grp-btns">
                <button className={`rte-btn ${editor.isActive({ textAlign: "left" }) || (!editor.isActive({ textAlign: "center" }) && !editor.isActive({ textAlign: "right" }) && !editor.isActive({ textAlign: "justify" })) ? "active" : ""}`}
                  onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left"><AlignLeft size={12} /></button>
                <button className={`rte-btn ${editor.isActive({ textAlign: "center" }) ? "active" : ""}`}
                  onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Center"><AlignCenter size={12} /></button>
                <button className={`rte-btn ${editor.isActive({ textAlign: "right" }) ? "active" : ""}`}
                  onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right"><AlignRight size={12} /></button>
                <button className={`rte-btn ${editor.isActive({ textAlign: "justify" }) ? "active" : ""}`}
                  onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify"><AlignJustify size={12} /></button>
              </div>
            </div>

          </div>{/* /ROW 1 */}

          {/* ── ROW 2: Structure & Insert ── */}
          <div className="rte-trow">

            {/* Group: Lists */}
            <div className="rte-grp">
              <span className="rte-grp-lbl">Lists</span>
              <div className="rte-grp-btns">
                <button className={`rte-btn ${editor.isActive("bulletList") ? "active" : ""}`}
                  onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
                  <List size={13} /><span style={{ fontSize: 10, marginLeft: 2 }}>Bullet</span>
                </button>
                <button className={`rte-btn ${editor.isActive("orderedList") ? "active" : ""}`}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
                  <ListOrdered size={13} /><span style={{ fontSize: 10, marginLeft: 2 }}>Numbers</span>
                </button>
                <button className={`rte-btn ${editor.isActive("taskList") ? "active" : ""}`}
                  onClick={() => editor.chain().focus().toggleTaskList().run()} title="Task list / Checklist">
                  <CheckSquare size={13} /><span style={{ fontSize: 10, marginLeft: 2 }}>Tasks</span>
                </button>
              </div>
            </div>

            <div className="rte-sep" />

            {/* Group: Blocks */}
            <div className="rte-grp">
              <span className="rte-grp-lbl">Block</span>
              <div className="rte-grp-btns">
                <button className={`rte-btn ${editor.isActive("blockquote") ? "active" : ""}`}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
                  <Quote size={13} /><span style={{ fontSize: 10, marginLeft: 2 }}>Quote</span>
                </button>
                <button className="rte-btn"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal divider">
                  <Minus size={13} /><span style={{ fontSize: 10, marginLeft: 2 }}>Divider</span>
                </button>
                <button className={`rte-btn ${editor.isActive("code") ? "active" : ""}`}
                  onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code">
                  <Code size={13} /><span style={{ fontSize: 10, marginLeft: 2 }}>Code</span>
                </button>
                <button className={`rte-btn ${editor.isActive("codeBlock") ? "active" : ""}`}
                  onClick={() => editor.chain().focus().toggleCodeBlock({ language: codeLanguage }).run()} title="Code block">
                  <Code2 size={13} /><span style={{ fontSize: 10, marginLeft: 2 }}>Block</span>
                </button>
              </div>
            </div>

            <div className="rte-sep" />

            {/* Group: Insert */}
            <div className="rte-grp">
              <span className="rte-grp-lbl">Insert</span>
              <div className="rte-grp-btns">
                {/* Link */}
                <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                  <button className={`rte-btn ${editor.isActive("link") ? "active" : ""}`}
                    onClick={() => {
                      if (editor.isActive("link")) { editor.chain().focus().unsetLink().run(); }
                      else { setShowLinkInput(p => !p); setShowColorPicker(false); setShowHighlightPicker(false); setShowHeadingPicker(false); setShowTableMenu(false); setLinkUrl(editor.getAttributes("link").href || ""); }
                    }} title="Insert / Edit link">
                    <LinkIcon size={13} /><span style={{ fontSize: 10, marginLeft: 2 }}>Link</span>
                  </button>
                  {showLinkInput && (
                    <div className="rte-link-input" style={{ bottom: "calc(100% + 6px)", top: "auto" }}>
                      <input autoFocus type="text" value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        onKeyDown={e => { if (e.key === "Enter") setLink(); if (e.key === "Escape") setShowLinkInput(false); }} />
                      <button onClick={setLink}>Apply</button>
                    </div>
                  )}
                </div>
                {/* Table */}
                <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                  <button className={`rte-btn ${editor.isActive("table") ? "active" : ""}`}
                    onClick={() => { setShowTableMenu(p => !p); setShowColorPicker(false); setShowHighlightPicker(false); setShowHeadingPicker(false); setShowFontPicker(false); }}
                    title="Insert / Edit table">
                    <TableIcon size={13} /><span style={{ fontSize: 10, marginLeft: 2 }}>Table</span><ChevronDown size={9} />
                  </button>
                  {showTableMenu && (
                    <div className="rte-picker" style={{ minWidth: 200, bottom: "calc(100% + 6px)", top: "auto" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, padding: "0 2px" }}>Insert Table</div>
                      <button className="rte-picker-item" onClick={insertTable}><Plus size={13} /> New 3×3 Table</button>
                      <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Edit Table</div>
                      <button className="rte-picker-item" onClick={() => { editor.chain().focus().addRowAfter().run(); setShowTableMenu(false); }}><Rows3 size={13} /> Add Row Below</button>
                      <button className="rte-picker-item" onClick={() => { editor.chain().focus().addColumnAfter().run(); setShowTableMenu(false); }}><Columns3 size={13} /> Add Column After</button>
                      <button className="rte-picker-item" onClick={() => { editor.chain().focus().deleteRow().run(); setShowTableMenu(false); }}><Trash2 size={13} color="#f87171" /> <span style={{ color: "#f87171" }}>Delete Row</span></button>
                      <button className="rte-picker-item" onClick={() => { editor.chain().focus().deleteColumn().run(); setShowTableMenu(false); }}><Trash2 size={13} color="#f87171" /> <span style={{ color: "#f87171" }}>Delete Column</span></button>
                      <button className="rte-picker-item" onClick={() => { editor.chain().focus().deleteTable().run(); setShowTableMenu(false); }}><Trash2 size={13} color="#f87171" /> <span style={{ color: "#f87171" }}>Delete Table</span></button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Code language selector — only when in code block */}
            {editor.isActive("codeBlock") && (
              <>
                <div className="rte-sep" />
                <div className="rte-grp">
                  <span className="rte-grp-lbl">Lang</span>
                  <div className="rte-grp-btns">
                    <select value={codeLanguage} onChange={e => { setCodeLanguage(e.target.value); editor.chain().focus().updateAttributes("codeBlock", { language: e.target.value }).run(); }}
                      style={{ background: "var(--bg-hover)", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "var(--text-muted)", cursor: "pointer", fontFamily: "monospace", height: 28, outline: "none" }}>
                      {CODE_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

          </div>{/* /ROW 2 */}

        </div>{/* /TOOLBAR */}

        {/* ════ EDITOR CONTENT ════ */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <EditorContent editor={editor} style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }} />
        </div>

        {/* ════ STATUS BAR ════ */}
        <div className="rte-statusbar">
          <span><strong>{wordCount.toLocaleString()}</strong> words</span>
          <span><strong>{charCount.toLocaleString()}</strong> chars</span>
          <span><strong>{Math.max(1, Math.ceil(wordCount / 200))}</strong> min read</span>
          {editor.isActive("codeBlock") && <span style={{ color: "var(--accent)", fontWeight: 600 }}>📝 Code block</span>}
          {editor.isActive("table") && <span style={{ color: "var(--accent)", fontWeight: 600 }}>📊 Table</span>}
        </div>
      </div>
    </>
  );
}

function contentToHtml(content: string): string {
  if (!content) return "";
  if (content.trim().startsWith("<")) return content;
  return markdownToHtml(content);
}

function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let inCodeBlock = false;
  let codeLang = "";
  let codeLines: string[] = [];
  let inList = false;
  let listType = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        html += `<pre><code class="language-${codeLang}">${codeLines.join("\n")}</code></pre>`;
        codeLines = []; inCodeBlock = false; codeLang = "";
      } else {
        inCodeBlock = true; codeLang = line.slice(3).trim() || "text";
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(escapeHtml(line)); continue; }

    let formatted = line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/~~(.+?)~~/g, "<s>$1</s>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    if (/^#{1,6} /.test(line)) {
      const level = line.match(/^(#+)/)?.[1].length ?? 1;
      if (inList) { html += listType === "ul" ? "</ul>" : "</ol>"; inList = false; }
      html += `<h${level}>${formatted.replace(/^#+\s/, "")}</h${level}>`;
    } else if (/^[-*] /.test(line)) {
      if (!inList || listType !== "ul") {
        if (inList) html += "</ol>";
        html += "<ul>"; inList = true; listType = "ul";
      }
      html += `<li>${formatted.replace(/^[-*] /, "")}</li>`;
    } else if (/^\d+\. /.test(line)) {
      if (!inList || listType !== "ol") {
        if (inList) html += "</ul>";
        html += "<ol>"; inList = true; listType = "ol";
      }
      html += `<li>${formatted.replace(/^\d+\. /, "")}</li>`;
    } else if (/^> /.test(line)) {
      if (inList) { html += listType === "ul" ? "</ul>" : "</ol>"; inList = false; }
      html += `<blockquote><p>${formatted.replace(/^> /, "")}</p></blockquote>`;
    } else if (/^---+$/.test(line)) {
      if (inList) { html += listType === "ul" ? "</ul>" : "</ol>"; inList = false; }
      html += "<hr />";
    } else if (line.trim() === "") {
      if (inList) { html += listType === "ul" ? "</ul>" : "</ol>"; inList = false; }
      html += "";
    } else {
      if (inList) { html += listType === "ul" ? "</ul>" : "</ol>"; inList = false; }
      html += `<p>${formatted}</p>`;
    }
  }
  if (inList) html += listType === "ul" ? "</ul>" : "</ol>";
  if (inCodeBlock) html += `<pre><code class="language-${codeLang}">${codeLines.join("\n")}</code></pre>`;
  return html || "<p></p>";
}

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
