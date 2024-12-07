import { z } from "zod";
import { buildQueryString, Search } from "./build-search";
import { authToken } from "./auth-token";
import { handleError } from "./api-error-handler";
import { UnexpectedResponseError } from "@/utils/errors/api-error";

const baseUrl = "https://dev.main.firsty.ai/api";

type Schema = z.ZodType<any, any, any>;

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestTemplateData<R> {
  readonly method: RequestMethod;
  readonly url: string;
  readonly search: string | null;
  readonly body: BodyInit | null;
  readonly headers: HeadersInit;
  readonly schema: Schema | null;

  readonly responseReader: (r: Response) => Promise<R>;
}

export class RequestTemplate<R> {
  constructor(private readonly data: RequestTemplateData<R>) {}

  async run(signal?: AbortSignal): Promise<R> {
    try {
      const res = await fetch(
        baseUrl + this.data.url + (this.data.search ?? ""),
        {
          method: this.data.method,
          headers: this.data.headers,
          body: this.data.body,
          signal,
        },
      );

      if (!res.ok) throw res;

      return this.data.responseReader(res);
    } catch (e) {
      const error = await handleError(e);
      throw error;
    }
  }

  transform<R2>(fn: (response: R) => R2 | Promise<R2>) {
    return new RequestTemplate({
      ...this.data,
      responseReader: async (r) => {
        const res = await this.data.responseReader(r);
        return await fn(res);
      },
    });
  }
}

export class RequestTemplateBuilder {
  private search: string | null = null;
  private headers: Headers = new Headers([
    ["Authorization", `Bearer ${authToken.get()}`],
    ["Access-Control-Allow-Origin", "*"],
    ["Content-Type", "application/json"],
  ]);

  constructor(
    private url: string,
    private method: RequestMethod,
  ) {}

  protected body(): BodyInit | null {
    return null;
  }

  withSearch(search?: Search) {
    if (search) {
      this.search = buildQueryString(search);
    }

    return this;
  }

  withHeader(name: string, value: string) {
    this.headers.set(name, value);

    return this;
  }

  expectSchema<R extends Schema>(schema: R): RequestTemplate<z.infer<R>> {
    return new RequestTemplate({
      body: this.body(),
      headers: this.headers,
      method: this.method,
      search: this.search,
      url: this.url,
      schema,
      responseReader: (r) =>
        r.json().then((v) => {
          const parsed = schema.safeParse(v);
          if (parsed.success) return parsed.data;

          throw new UnexpectedResponseError(r.url, parsed.error.issues, v);
        }),
    });
  }

  expect<R>(responseReader: (r: Response) => Promise<R>): RequestTemplate<R> {
    return new RequestTemplate({
      body: null,
      headers: this.headers,
      method: this.method,
      search: this.search,
      url: this.url,
      schema: null,
      responseReader,
    });
  }
}

export class RequestWithBodyTemplateBuilder extends RequestTemplateBuilder {
  private _body: BodyInit | null = null;

  withBody(body: BodyInit | object, contentType?: string) {
    this._body = typeof body === "object" ? JSON.stringify(body) : body;

    if (contentType) {
      this.withHeader("Content-Type", contentType);
    }

    return this;
  }

  protected override body(): BodyInit | null {
    return this._body;
  }
}

interface RequestTemplateBuilders {
  get get(): RequestTemplateBuilder;
  get post(): RequestWithBodyTemplateBuilder;
  get put(): RequestWithBodyTemplateBuilder;
  get patch(): RequestWithBodyTemplateBuilder;
  get delete(): RequestWithBodyTemplateBuilder;
}

export const api = (url: `/${string}`): RequestTemplateBuilders => ({
  get get() {
    return new RequestTemplateBuilder(url, "GET");
  },
  get post() {
    return new RequestWithBodyTemplateBuilder(url, "POST");
  },
  get put() {
    return new RequestWithBodyTemplateBuilder(url, "PUT");
  },
  get patch() {
    return new RequestWithBodyTemplateBuilder(url, "PATCH");
  },
  get delete() {
    return new RequestWithBodyTemplateBuilder(url, "DELETE");
  },
});
