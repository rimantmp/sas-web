"use client";

// Rich text editor untuk body berita, berbasis Tiptap (open source, MIT).
// Toolbar minimal: format yang berguna untuk pengumuman resmi. Nilai
// disimpan sebagai HTML bersih; sanitasi ulang terjadi saat render publik.

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const btnClass =
  "min-h-9 rounded-md px-2.5 text-sm font-semibold text-ink transition-colors hover:bg-line/70";

function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={btnClass + (active ? " bg-ink text-white hover:bg-ink" : "")}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-48 rounded-md border border-input bg-white px-3.5 py-2.5 text-base text-ink focus:outline-none [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-sas-red [&_a]:underline [&_a]:underline-offset-4",
        "aria-label": "Isi berita",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    // Sinkronkan bila nilai awal berubah (mis. buka berita lain).
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    if (prev) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const url = window.prompt("Alamat tautan (https://...):");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div>
      <div
        role="toolbar"
        aria-label="Format teks"
        className="flex flex-wrap items-center gap-0.5 rounded-t-md border border-input bg-paper px-1.5 py-1.5"
      >
        <ToolbarButton
          label="Tebal"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label="Miring"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label="Judul bagian"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="font-heading font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          label="Sub judul"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <span className="font-heading font-bold">H3</span>
        </ToolbarButton>
        <ToolbarButton
          label="Daftar butir"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •〰
        </ToolbarButton>
        <ToolbarButton
          label="Daftar bernomor"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton label="Tautan" active={editor.isActive("link")} onClick={setLink}>
          Tautan
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="[&_.ProseMirror]:rounded-b-md [&_.ProseMirror]:border [&_.ProseMirror]:border-t-0" />
    </div>
  );
}
