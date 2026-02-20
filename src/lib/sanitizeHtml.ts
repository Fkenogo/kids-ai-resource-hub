const BLOCKED_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
  'base',
  'form',
  'button',
  'textarea',
  'select',
  'option',
]);

const SAFE_URL_PATTERN = /^(https?:|mailto:|tel:|\/|#)/i;

export const sanitizeHtml = (html: string): string => {
  if (!html || typeof window === 'undefined') {
    return html || '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  for (const tagName of BLOCKED_TAGS) {
    doc.querySelectorAll(tagName).forEach((el) => el.remove());
  }

  doc.querySelectorAll('*').forEach((element) => {
    if (element.tagName.toLowerCase() === 'input') {
      const type = (element.getAttribute('type') || '').toLowerCase();
      const isTaskCheckbox = type === 'checkbox';

      if (!isTaskCheckbox) {
        element.remove();
        return;
      }

      element.setAttribute('disabled', 'disabled');
      element.removeAttribute('name');
      element.removeAttribute('value');
      element.removeAttribute('form');
      element.removeAttribute('autocomplete');
    }

    [...element.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();

      if (name.startsWith('on')) {
        element.removeAttribute(attr.name);
        return;
      }

      if ((name === 'href' || name === 'src' || name === 'xlink:href') && !SAFE_URL_PATTERN.test(value)) {
        element.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};
