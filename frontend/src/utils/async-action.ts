/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAutoObservable, runInAction } from "mobx";
import { ScriptError } from "./errors/script-error";

export class AsyncAction<Fn extends (...args: any) => Promise<unknown>> {
  constructor(private fn: Fn) {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  private _promise: ReturnType<Fn> | null = null;

  private _errored = false;

  private _lastError: unknown = null;

  private _lastResult: Awaited<ReturnType<Fn>> | null = null;

  get error(): any {
    return this._lastError;
  }
  get pending(): boolean {
    return !!this._promise;
  }
  get errored(): boolean {
    return this._errored;
  }
  get result(): Awaited<ReturnType<Fn>> | null {
    return this._lastResult;
  }
  get promise(): ReturnType<Fn> | null {
    return this._promise;
  }

  private setPromise = (promise: ReturnType<Fn> | null) => {
    runInAction(() => {
      this._promise = promise;
    });
  };

  private setResult = (
    result: Awaited<ReturnType<Fn>> | null,
    error: unknown,
  ) => {
    runInAction(() => {
      this._lastResult = result;
      this._lastError = error;
      this._errored = !!error;
    });
  };

  tryRun(...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> | null {
    if (this._promise) return null;

    return this.run(...args);
  }

  run(...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> {
    if (this._promise) {
      const error = new ScriptError("Action is already running");
      error.handle(); // dont show toasts
      throw error;
    }

    return this._run(...args);
  }

  private async _run(
    ...args: Parameters<Fn>
  ): Promise<Awaited<ReturnType<Fn>>> {
    try {
      this._errored = false;
      this.setPromise(this.fn(...[...args]) as Awaited<ReturnType<Fn>>);

      const result = await this._promise!;
      this.setResult(result, null);

      return result;
    } catch (e) {
      this.setResult(null, e);
      throw e;
    } finally {
      this.setPromise(null);
    }
  }
}
