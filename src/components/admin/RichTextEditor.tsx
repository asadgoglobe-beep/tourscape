import { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Eraser,
  Quote,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

/**
 * A lightweight, dependency-free rich text editor. It edits HTML visually
 * (bold, italic, headings, lists, links, quotes) and reports the HTML string
 * via onChange. Works fully client-side, so it is safe in the ssr:false admin.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
  minHeight = 220,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  // Push the incoming value into the DOM only when it differs and the editor
  // is not being actively edited — this preserves the caret while typing and
  // updates the content when a different record is opened.
  useEffect(() => {
    const el = ref.current;
    if (el && el !== document.activeElement && value !== el.innerHTML) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const sync = useCallback(() => {
    if (ref.current) onChange(ref.current.innerHTML);
  }, [onChange]);

  const exec = useCallback(
    (command: string, arg?: string) => {
      ref.current?.focus();
      document.execCommand(command, false, arg);
      sync();
    },
    [sync],
  );

  const addLink = useCallback(() => {
    const url = window.prompt("Link URL (https://…)");
    if (url) exec("createLink", url.startsWith("http") ? url : `https://${url}`);
  }, [exec]);

  return (
    <div
      className={`rounded-xl border bg-white overflow-hidden transition ${focused ? "border-gold ring-2 ring-gold/15" : "border-navy/15"}`}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-black/5 px-2 py-1.5 bg-sand/40">
        <TBtn title="Bold" onClick={() => exec("bold")}>
          <Bold size={15} />
        </TBtn>
        <TBtn title="Italic" onClick={() => exec("italic")}>
          <Italic size={15} />
        </TBtn>
        <Sep />
        <TBtn title="Heading" onClick={() => exec("formatBlock", "<h2>")}>
          <Heading2 size={15} />
        </TBtn>
        <TBtn title="Subheading" onClick={() => exec("formatBlock", "<h3>")}>
          <Heading3 size={15} />
        </TBtn>
        <TBtn title="Paragraph" onClick={() => exec("formatBlock", "<p>")}>
          <span className="text-[12.5px] font-bold px-0.5">P</span>
        </TBtn>
        <Sep />
        <TBtn title="Bullet list" onClick={() => exec("insertUnorderedList")}>
          <List size={15} />
        </TBtn>
        <TBtn title="Numbered list" onClick={() => exec("insertOrderedList")}>
          <ListOrdered size={15} />
        </TBtn>
        <TBtn title="Quote" onClick={() => exec("formatBlock", "<blockquote>")}>
          <Quote size={15} />
        </TBtn>
        <Sep />
        <TBtn title="Add link" onClick={addLink}>
          <Link2 size={15} />
        </TBtn>
        <TBtn title="Clear formatting" onClick={() => exec("removeFormat")}>
          <Eraser size={15} />
        </TBtn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={() => {
          setFocused(false);
          sync();
        }}
        onFocus={() => setFocused(true)}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="prose prose-sm max-w-none px-4 py-3 focus:outline-none rte-content text-charcoal/90"
      />
    </div>
  );
}

function TBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      // Prevent the editor from losing its selection when a toolbar button is pressed.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="h-8 min-w-[2rem] px-1.5 grid place-items-center rounded-md text-navy hover:bg-navy hover:text-white transition"
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-black/10 mx-1" />;
}
