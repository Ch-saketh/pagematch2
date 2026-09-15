// Clean developer-first SVG placeholder generator for real book records
export const getEditorialCover = (title = 'RECORD', author = 'CS22/ENGINE') => {
  const safeTitle = (title || 'RECORD')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 32);
  const safeAuthor = (author || 'CS22/ENGINE')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 24);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#232320" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="300" height="450" fill="#141413"/>
    <rect width="300" height="450" fill="url(#grid)"/>
    <rect x="20" y="20" width="260" height="410" fill="none" stroke="#2d2d2a" stroke-width="1"/>
    
    <text x="36" y="60" fill="#9be28b" font-family="monospace" font-size="10" letter-spacing="2">// CS22 MODEL RECORD</text>
    <line x1="36" y1="75" x2="264" y2="75" stroke="#2d2d2a" stroke-width="1"/>
    
    <text x="36" y="160" fill="#f4f4f0" font-family="sans-serif" font-weight="700" font-size="18">${safeTitle}</text>
    <text x="36" y="190" fill="#888882" font-family="monospace" font-size="12">${safeAuthor}</text>
    
    <rect x="36" y="380" width="100" height="22" fill="#1e1e1c" stroke="#333330" rx="3"/>
    <text x="46" y="395" fill="#9be28b" font-family="monospace" font-size="9" letter-spacing="1">INDEXED</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
