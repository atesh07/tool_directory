// A browser tab that runs out of memory simply disappears and reloads. We cannot catch that,
// but we can notice it afterwards: a flag is set while a file is being processed and cleared when the work ends
// or the page is left on purpose. If the flag is still there on the next load, the page was killed.

const KEY = "toolstree-working";
let listening = false;

export function beginWork() {
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
    if (!listening) {
      listening = true;
      // Leaving the page normally is not a crash
      window.addEventListener("pagehide", endWork);
    }
  } catch {
    /* private mode or storage blocked: the notice is just not shown */
  }
}

export function endWork() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** True once if the previous page load ended while a file was being processed */
export function wasInterrupted(): boolean {
  try {
    const flag = sessionStorage.getItem(KEY);
    if (flag) {
      sessionStorage.removeItem(KEY);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
