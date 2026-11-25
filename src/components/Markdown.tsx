/** Tiny, safe Markdown renderer for log entries (escapes HTML first; supports headings, lists, code, bold, italics, links). */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(s: string) {
  return s
    .replace(/`([^`]+)`/g, '<code class="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[12px] dark:bg-zinc-800">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a class="text-violet-500 underline" target="_blank" rel="noopener noreferrer" href="$2">$1</a>')
    .replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a class="text-violet-500 underline break-all" target="_blank" rel="noopener noreferrer" href="$2">$2</a>');
}

export function renderMarkdown(src: string): string {
  const lines = esc(src).split('\n');
  const out: string[] = [];
  let inCode = false;
  let list: 'ul' | 'ol' | null = null;
  const closeList = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  for (const raw of lines) {
    if (raw.trim().startsWith('```')) {
      closeList();
      out.push(inCode ? '</code></pre>' : '<pre class="my-2 overflow-x-auto rounded-lg bg-zinc-100 p-3 font-mono text-[12px] dark:bg-zinc-950"><code>');
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      out.push(raw + '\n');
      continue;
    }
    const h = raw.match(/^(#{1,3})\s+(.*)/);
    const ul = raw.match(/^\s*[-*]\s+(.*)/);
    const ol = raw.match(/^\s*\d+\.\s+(.*)/);
    if (h) {
      closeList();
      out.push(`<div class="mt-2 font-semibold ${h[1].length === 1 ? 'text-base' : 'text-sm'}">${inline(h[2])}</div>`);
    } else if (ul || ol) {
      const kind = ul ? 'ul' : 'ol';
      if (list !== kind) {
        closeList();
        out.push(`<${kind} class="${kind === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 my-1">`);
        list = kind;
      }
      out.push(`<li>${inline((ul ?? ol)![1])}</li>`);
    } else if (!raw.trim()) {
      closeList();
      out.push('<div class="h-2"></div>');
    } else {
      closeList();
      out.push(`<p>${inline(raw)}</p>`);
    }
  }
  closeList();
  if (inCode) out.push('</code></pre>');
  return out.join('');
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  return <div className={`text-sm leading-relaxed ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />;
}
