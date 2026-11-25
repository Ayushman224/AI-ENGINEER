/**
 * Copy text that also works in iframe previews, plain-http LAN URLs (phone testing) and iOS Safari.
 * 1) Synchronous execCommand copy first: it runs inside the click gesture, so nothing can expire it.
 * 2) Async Clipboard API if that failed and the context is secure.
 * 3) Returns false: the caller shows a select-all fallback so the user can copy by hand.
 */
export async function copyText(text: string): Promise<boolean> {
  if (legacyCopy(text)) return true;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* permission denied / not focused */
    }
  }
  return false;
}

function legacyCopy(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.contentEditable = 'true';
  Object.assign(ta.style, { position: 'fixed', top: '0', left: '0', width: '1px', height: '1px', opacity: '0', fontSize: '16px' });
  document.body.appendChild(ta);
  const prevFocus = document.activeElement as HTMLElement | null;
  try {
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length); // iOS
    const range = document.createRange();
    range.selectNodeContents(ta);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    ta.setSelectionRange(0, text.length);
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    ta.remove();
    window.getSelection()?.removeAllRanges();
    prevFocus?.focus?.({ preventScroll: true });
  }
}
