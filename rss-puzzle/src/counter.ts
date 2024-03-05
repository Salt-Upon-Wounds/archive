export default function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const el = element;
  const setCounter = (count: number) => {
    counter = count;
    el.innerHTML = `count is ${counter}`;
  };
  el.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
