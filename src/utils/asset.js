const baseUrl = import.meta.env.BASE_URL;

export function assetPath(path) {
  if (!path) return path;
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(path) || /^(?:data|blob):/i.test(path)) return path;

  const normalized = path.replace(/^\/+/, '');
  return `${baseUrl}${normalized}`;
}
