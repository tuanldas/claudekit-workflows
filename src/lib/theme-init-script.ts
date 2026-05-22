export function getThemeInitScript(): string {
  return `(function () {
  try {
    var t = localStorage.getItem('claudekit-theme') || 'system';
    var sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = t === 'dark' || (t === 'system' && sysDark);
    var cl = document.documentElement.classList;
    if (dark) cl.add('dark'); else cl.remove('dark');
  } catch (e) {}
})();`;
}
