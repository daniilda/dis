import { HandleableError } from "./handleable-error";

export class ApiError extends HandleableError {
  constructor(message?: string, description?: string) {
    super(message ?? "General API error", description);
  }
}

export class UnexpectedResponseError extends ApiError {
  constructor(
    public readonly url: string,
    public readonly expected: unknown,
    public readonly garbage: unknown,
  ) {
    console.warn("Unexpected response came from server", {
      url,
      expected,
      garbage,
    });
    super("Unexpected response came from server");
  }
}

export class AbortError extends ApiError {
  constructor() {
    super("AbortError", "The operation was aborted");
    this.handle();
  }
}
