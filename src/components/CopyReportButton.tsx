import { Check, ClipboardCopy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { copyText } from '../lib/clipboard';
import { Modal } from './Modal';
import { Btn } from './ui';

/** Copies text; if the browser blocks every clipboard path, opens a pre-selected textarea to copy by hand. */
export function CopyReportButton({ getText, label = 'Copy Mentor Report', size, variant = 'primary' }: { getText: () => string; label?: string; size?: 'sm' | 'md'; variant?: 'primary' | 'secondary' }) {
  const [state, setState] = useState<'idle' | 'copied'>('idle');
  const [manual, setManual] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (manual !== null) setTimeout(() => taRef.current?.select(), 50);
  }, [manual]);

  const onClick = async () => {
    const text = getText();
    if (await copyText(text)) {
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    } else setManual(text);
  };

  return (
    <>
      <Btn variant={variant} size={size} onClick={onClick} aria-live="polite">
        {state === 'copied' ? <Check size={15} /> : <ClipboardCopy size={15} />}
        {state === 'copied' ? 'Copied to clipboard!' : label}
      </Btn>
      <Modal open={manual !== null} onClose={() => setManual(null)} title="Copy your mentor report" wide>
        <p className="mb-2 text-xs text-zinc-500">This browser blocked automatic copying. The text is selected — press Ctrl/⌘+C, or long-press → Copy on mobile.</p>
        <textarea ref={taRef} readOnly value={manual ?? ''} className="field h-80 font-mono text-[12px]" onFocus={(e) => e.currentTarget.select()} />
      </Modal>
    </>
  );
}
