const envhost = import.meta.env.VITE_target;
const envport = import.meta.env.VITE_port;

export default class Api {
  private static ws: WebSocket;

  private static port = envport;

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
    }
    return new Api();
  }

  public static getPort() {
    return Api.port;
  }

  // TODO: сделать методы обертки для send для логин логаут и подобного, чтобы вытянуть апи логику сюда

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
