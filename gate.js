/**
 * gate.js - a LIGHT password gate for the deck.
 *
 * IMPORTANT: this is a deterrent, not real security. The slides are a
 * static site, so their text is still delivered to the browser; anyone
 * who views source can read it regardless of this gate. It only stops
 * casual visitors. For real protection the deck would need to sit behind
 * proper auth (e.g. Cloudflare Access) on a custom domain.
 *
 * We store a SHA-256 hash of the password rather than the password
 * itself, so the plaintext isn't sitting in the public source. Unlock is
 * remembered for the tab session (sessionStorage), so it only prompts
 * once per visit.
 */
(() => {
  const gate = document.getElementById('deck-gate');
  if (!gate) return;

  // Opened straight off disk: no gate. The gate exists to stop casual web
  // visitors, and a local copy on your own machine isn't one. This also
  // avoids locking the presenter out of their own file: crypto.subtle is
  // unavailable on file:// in some browsers, and the check would otherwise
  // fail closed with no way in.
  if (location.protocol === 'file:') { gate.remove(); return; }

  const KEY = 'deck-gate-ok';
  // Set this with the one-liner in README.md ("Setting the password").
  // Until it holds a real SHA-256 the gate is locked to everyone, which is
  // the safe way for it to fail.
  const HASH = 'SET-THIS-SEE-README';

  const unlock = () => {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
    gate.remove();
  };

  // Already unlocked this session — don't prompt again.
  try { if (sessionStorage.getItem(KEY) === '1') { gate.remove(); return; } } catch (e) { /* ignore */ }

  const form = document.getElementById('deck-gate-form');
  const input = document.getElementById('deck-gate-input');
  const err = document.getElementById('deck-gate-error');

  const sha256 = async (str) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = false;
    try { ok = (await sha256(input.value.trim())) === HASH; } catch (e) { /* crypto unavailable */ }
    if (ok) {
      unlock();
    } else {
      err.hidden = false;
      input.value = '';
      input.focus();
    }
  });

  input.focus();
})();
