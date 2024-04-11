export function go(path: string) {
  window.history.pushState(
    { path: `${path}` },
    '',
    `${window.location.origin}${import.meta.env.VITE_urlprefix}${path}`,
  );
}

export function redirect(path: string) {
  window.history.replaceState(
    { path: `${path}` },
    '',
    `${window.location.origin}${import.meta.env.VITE_urlprefix}${path}`,
  );
}
