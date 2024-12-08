import { makeAutoObservable } from "mobx";

/**
 * @description ViewModel for caching a route with IDs. It also allows to update route data, unlike tanstack solution.
 */
export class RouteCacheViewModel<TData, TKey = number> {
  private _data: Map<TKey, TData> = new Map();
  lastKey: TKey | null = null;

  constructor(private loaderFn: (key: TKey) => Promise<TData>) {
    makeAutoObservable(this);
  }

  async load(key: TKey) {
    this.lastKey = key;
    const data = this._data.get(key);
    if (data) return data;

    const newData = await this.loaderFn(key);
    this._data.set(key, newData);

    return newData;
  }

  async forceUpdate(key?: TKey) {
    const data = await this.loaderFn(key ?? this.lastKey!);
    this._data.set(key ?? this.lastKey!, data);
  }

  get data(): TData {
    return this._data.get(this.lastKey!)!;
  }

  update(data: TData) {
    this._data.set(this.lastKey!, data);
  }
}
