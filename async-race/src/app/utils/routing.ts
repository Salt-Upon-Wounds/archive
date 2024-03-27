export default function go(path: string) {
  window.history.pushState(
    { path: `${path}` },
    '',
    `${window.location.origin}/salt-upon-wounds-JSFE2023Q4/async-race/${path}`,
  );
}
