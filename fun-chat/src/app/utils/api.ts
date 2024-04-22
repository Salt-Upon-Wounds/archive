import { loadUser } from './storage';

const envhost = import.meta.env.VITE_target;
const envport = import.meta.env.VITE_port;

export type User = {
  login: string;
  isLogined: boolean;
};
export type Message = {
  id?: string;
  from?: string;
  to?: string;
  text?: string;
  datetime?: number;
  status?: {
    isDelivered?: boolean;
    isReaded?: boolean;
    isEdited?: boolean;
    isDeleted?: boolean;
  };
};
export type ServerResponse = {
  id: string;
  type: string;
  payload: {
    user?: User;
    users?: User[];
    message?: Message;
    messages?: Message[];
    error?: string;
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
      const sessionport = loadUser()?.port ?? envport;
      p = sessionport;
    }
    Api.port = p;
    if (!Api.ws || Api.ws.readyState === WebSocket.CLOSED) {
      Api.ws = new WebSocket(`ws://${envhost}:${p}`);
      Api.ws.addEventListener('close', () => {
        window.dispatchEvent(new Event('SOCKET_CLOSE'));
      });
      Api.ws.addEventListener('open', () => {
        Api.connectionResolvers.forEach((r) => r.resolve());
        window.dispatchEvent(new Event('SOCKET_OPEN'));
      });
      Api.ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data) as ServerResponse;
        if (message.type === 'USER_ACTIVE' || message.type === 'USER_INACTIVE') {
          window.dispatchEvent(new CustomEvent<User[]>('USERS_EVENT', { detail: message.payload!.users }));
        } else if (message.type === 'USER_EXTERNAL_LOGIN') {
          window.dispatchEvent(new CustomEvent<User>('USER_EXTERNAL_LOGIN_EVENT', { detail: message.payload!.user }));
        } else if (message.type === 'USER_EXTERNAL_LOGOUT') {
          window.dispatchEvent(new CustomEvent<User>('USER_EXTERNAL_LOGOUT_EVENT', { detail: message.payload!.user }));
        } else if (message.type === 'MSG_SEND') {
          window.dispatchEvent(new CustomEvent<Message>('MSG_SEND_EVENT', { detail: message.payload!.message }));
        } else if (message.type === 'MSG_FROM_USER') {
          window.dispatchEvent(new CustomEvent<ServerResponse>('MSG_FROM_USER_EVENT', { detail: message }));
        } else if (message.type === 'MSG_DELETE') {
          window.dispatchEvent(new CustomEvent<Message>('MSG_DELETE_EVENT', { detail: message.payload!.message }));
        } else if (message.type === 'MSG_EDIT') {
          window.dispatchEvent(new CustomEvent<Message>('MSG_EDIT_EVENT', { detail: message.payload!.message }));
        } else if (message.type === 'MSG_READ') {
          window.dispatchEvent(new CustomEvent<Message>('MSG_READ_EVENT', { detail: message.payload!.message }));
        } else if (message.type === 'MSG_DELIVER') {
          window.dispatchEvent(new CustomEvent<Message>('MSG_DELIVER_EVENT', { detail: message.payload!.message }));
        } else if (message.type === 'ERROR') {
          window.dispatchEvent(new CustomEvent<string>('ERROR_EVENT', { detail: message.payload!.error }));
        } else if (message.type === 'USER_LOGIN') {
          window.dispatchEvent(new CustomEvent<User>('USER_LOGIN_EVENT', { detail: message.payload!.user }));
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

  public async readMessage(id: string) {
    return this.send(
      JSON.stringify({
        id,
        type: 'MSG_READ',
        payload: { message: { id } },
      }),
    );
  }

  public async editMessage(id: string, text: string) {
    return this.send(
      JSON.stringify({
        id,
        type: 'MSG_EDIT',
        payload: { message: { id, text } },
      }),
    );
  }

  public async deleteMessage(id: string) {
    return this.send(
      JSON.stringify({
        id,
        type: 'MSG_DELETE',
        payload: { message: { id } },
      }),
    );
  }

  public async fetchMessageHistory(targetUser: string, id: string) {
    return this.send(
      JSON.stringify({
        id,
        type: 'MSG_FROM_USER',
        payload: { user: { login: targetUser } },
      }),
    );
  }

  public async sendMessageTo(to: string, text: string) {
    return this.send(
      JSON.stringify({
        id: crypto.randomUUID(),
        type: 'MSG_SEND',
        payload: { message: { to, text } },
      }),
    );
  }

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
