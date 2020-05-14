import { WebAPIUrl } from './AppSettings';

export interface HttpRequest<REQB> {
  path: string;
}

export interface HttpResponse<RESB> extends Response {
  parsedBody?: RESB;
}

export const http = <REQB, RESB>(
  config: HttpRequest<REQB>
): Promise<HttpResponse<RESB>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const request = new Request(`${WebAPIUrl}${config.path}`);
      const res: HttpResponse<RESB> = await fetch(request);
      const body = await res.json();
      if (res.ok) {
        res.parsedBody = body;
        resolve(res);
      } else {
        reject(res);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  })
};