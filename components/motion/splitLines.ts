/**
 * Free SplitText substitute: wrap text into line spans based on layout measurement.
 * Mutates the element; returns line inner elements for GSAP.
 */
export function splitElementIntoLines(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  if (!text.trim()) return [];

  const words = text.trim().split(/\s+/);
  el.textContent = "";

  const wordSpans: HTMLSpanElement[] = [];
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.style.display = "inline-block";
    span.dataset.word = "1";
    el.appendChild(span);
    wordSpans.push(span);
    if (i < words.length - 1) {
      el.appendChild(document.createTextNode(" "));
    }
  });

  if (wordSpans.length === 0) return [];

  const lines: HTMLElement[][] = [];
  let currentLine: HTMLElement[] = [];
  let lastTop = wordSpans[0]!.offsetTop;

  for (const word of wordSpans) {
    if (word.offsetTop > lastTop + 2 && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [];
      lastTop = word.offsetTop;
    }
    currentLine.push(word);
  }
  if (currentLine.length) lines.push(currentLine);

  el.textContent = "";
  const inners: HTMLElement[] = [];

  for (const lineWords of lines) {
    const mask = document.createElement("span");
    mask.style.display = "block";
    mask.style.overflow = "hidden";

    const inner = document.createElement("span");
    inner.style.display = "block";
    inner.dataset.lineInner = "1";

    lineWords.forEach((w, i) => {
      inner.appendChild(document.createTextNode(w.textContent ?? ""));
      if (i < lineWords.length - 1) {
        inner.appendChild(document.createTextNode(" "));
      }
    });

    mask.appendChild(inner);
    el.appendChild(mask);
    inners.push(inner);
  }

  return inners;
}
