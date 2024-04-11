type User = {
  name: string;
  password: string;
  port: number | string;
};

export function saveUser(name: string, password: string, port: string | number) {
  sessionStorage.setItem('user', JSON.stringify({ name, password, port }));
}

export function loadUser(): User | undefined {
  const item = sessionStorage.getItem('user');
  if (item) return JSON.parse(item);
  return undefined;
}
