import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface Options {
  headers?: HttpHeaders | Record<string, string | string[]>;
  observe?: 'body';
  context?: HttpContext;
  params?:
    | HttpParams
    | Record<
        string,
        string | number | boolean | ReadonlyArray<string | number | boolean>
      >;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  keepalive?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
}
