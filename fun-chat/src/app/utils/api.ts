const envhost = import.meta.env.VITE_target;
const envport = import.meta.env.VITE_port;

export type User = {
  login: string;
  isLogined: boolean;
};
export type ServerResponse = {
  id: string;
  type: string;
  payload: {
    user?: User;
    users?: User[];
  } | null;
};
export default class Api {
  private static ws: WebSocket;

  private static port = envport;

  private static isLoggedFlag: boolean = false;

  private static connectionResolvers: { resolve: (value?: unknown) => void; reject: () => void }[] = [];

  private constructor(private retries = 4) {}

  public static getInstance(port?: string) {
    let p: string | number;
    if (port && parseInt(port, 10) > -1) {
      p = port;
    } else {
      p = envport;
    }
    Api.port = p;
    if (!Api.ws || Api.ws.readyState === WebSocket.CLOSED) {
      Api.ws = new WebSocket(`ws://${envhost}:${p}`);
      Api.ws.addEventListener('open', () => {
        Api.connectionResolvers.forEach((r) => r.resolve());
      });
      Api.ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data) as ServerResponse;
        if (message.type === 'USER_ACTIVE' || message.type === 'USER_INACTIVE') {
          window.dispatchEvent(new CustomEvent<User[]>('USERS_EVENT', { detail: message.payload!.users }));
        }
        if (message.type === 'USER_EXTERNAL_LOGIN') {
          window.dispatchEvent(new CustomEvent<User>('USER_EXTERNAL_LOGIN_EVENT', { detail: message.payload!.user }));
        }
        if (message.type === 'USER_EXTERNAL_LOGOUT') {
          window.dispatchEvent(new CustomEvent<User>('USER_EXTERNAL_LOGOUT_EVENT', { detail: message.payload!.user }));
        }
      });
    }
    return new Api();
  }

  public static getPort() {
    return Api.port;
  }

  public static isLogged() {
    return Api.isLoggedFlag;
  }

  // TODO: сделать методы обертки для send для логин логаут и подобного, чтобы вытянуть апи логику сюда
  public async allNonAuthUsers() {
    return this.send(
      JSON.stringify({
        id: crypto.randomUUID(),
        type: 'USER_INACTIVE',
        payload: null,
      }),
    );
  }

  public async allAuthUsers() {
    return this.send(
      JSON.stringify({
        id: crypto.randomUUID(),
        type: 'USER_ACTIVE',
        payload: null,
      }),
    );
  }

  public async login(login: string, password: string) {
    if (Api.isLoggedFlag) return Promise.resolve(Api.ws);
    Api.isLoggedFlag = true;
    return this.send(
      JSON.stringify({
        id: crypto.randomUUID(),
        type: 'USER_LOGIN',
        payload: { user: { login, password } },
      }),
    );
  }

  public async logout(login: string, password: string) {
    if (!Api.isLoggedFlag) return Promise.resolve(Api.ws);
    Api.isLoggedFlag = false;
    return this.send(
      JSON.stringify({
        id: crypto.randomUUID(),
        type: 'USER_LOGOUT',
        payload: { user: { login, password } },
      }),
    );
  }

  public async send(data: string | ArrayBufferLike | Blob | ArrayBufferView, retries = 0): Promise<WebSocket> {
    try {
      Api.ws.send(data);
      return await Promise.resolve(Api.ws);
    } catch (error) {
      // TODO: спиннер для ожидания
      if (retries < this.retries && (error as Error).name === 'InvalidStateError') {
        await Api.waitForConnection();
        return this.send(data, retries + 1);
      }
      throw error;
    }
  }

  private static waitForConnection() {
    return new Promise((resolve, reject) => {
      Api.connectionResolvers.push({ resolve, reject });
    });
  }
}
