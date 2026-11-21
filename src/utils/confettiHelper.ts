import confetti from 'canvas-confetti';

let sharedCanvas: HTMLCanvasElement | null = null;
let sharedConfettiInstance: ReturnType<typeof confetti.create> | null = null;

function getSharedConfetti() {
  if (typeof window === 'undefined') return null;

  if (!sharedCanvas || !document.body.contains(sharedCanvas)) {
    if (sharedCanvas && sharedCanvas.parentNode) {
      try {
        sharedCanvas.parentNode.removeChild(sharedCanvas);
      } catch {}
    }

    sharedCanvas = document.createElement('canvas');
    sharedCanvas.id = 'arrowgo-shared-confetti-canvas';
    sharedCanvas.style.position = 'fixed';
    sharedCanvas.style.top = '0';
    sharedCanvas.style.left = '0';
    sharedCanvas.style.width = '100vw';
    sharedCanvas.style.height = '100vh';
    sharedCanvas.style.pointerEvents = 'none';
    sharedCanvas.style.zIndex = '9999';
    document.body.appendChild(sharedCanvas);

    // useWorker: false prevents Blob worker thread leaks in Android WebView
    sharedConfettiInstance = confetti.create(sharedCanvas, {
      resize: true,
      useWorker: false,
      disableForReducedMotion: true,
    });
  }

  return sharedConfettiInstance;
}

/**
 * High-performance mobile-safe confetti fire
 * Reuses a single persistent canvas and avoids memory/worker thread leaks on mobile WebViews
 */
export function fireConfetti(options: confetti.Options) {
  try {
    const fire = getSharedConfetti();
    if (fire) {
      fire({
        disableForReducedMotion: true,
        ...options,
      });
    }
  } catch (err) {
    console.warn('Confetti fire error:', err);
  }
}

/**
 * Resets and immediately clears the shared celebration canvas
 */
export function resetConfetti() {
  try {
    if (sharedConfettiInstance && (sharedConfettiInstance as any).reset) {
      (sharedConfettiInstance as any).reset();
    }
    if (sharedCanvas) {
      const ctx = sharedCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
      }
    }
  } catch {}
}
