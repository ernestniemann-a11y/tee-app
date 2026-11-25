/** Copies text, falling back for browsers or school policies that block the clipboard API. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const box = document.createElement("textarea");
    const focused = document.activeElement;
    box.value = text;
    box.style.position = "fixed";
    box.style.opacity = "0";
    document.body.append(box);
    box.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      box.remove();
      if (focused instanceof HTMLElement) focused.focus();
    }
  }
}
