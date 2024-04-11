type User = {
  login: string;
  password: string;
  port: number | string;
};

export function saveUser(login: string, password: string, port: string | number) {
  sessionStorage.setItem('user', JSON.stringify({ login, password, port }));
}

export function loadUser(): User | undefined {
  const item = sessionStorage.getItem('user');
  if (item) return JSON.parse(item);
  return undefined;
}
