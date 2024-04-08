export default function go(path: string) {
  window.history.pushState(
    { path: `${path}` },
    '',
    `${window.location.origin}${import.meta.env.VITE_urlprefix}${path}`,
  );
}
