
/**
 * Generates a simple SVG image as a data URL with the given title and a background color.
 */
export function generatePlaceholderSvg(title: string, width = 400, height = 320): string {
  // Pick a color based on title hash
  const colors = ["#6366f1", "#f43f5e", "#14b8a6", "#f59e42", "#60a5fa", "#e879f9"];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];
  const textColor = "#fff";
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'><rect fill='${color}' width='100%' height='100%'/><text x='50%' y='50%' font-family='sans-serif' dominant-baseline='middle' text-anchor='middle' font-size='30' font-weight='bold' fill='${textColor}'>${encodeURIComponent(safeTitle)}</text></svg>`;
}
