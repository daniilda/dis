import { AuthService } from "@/stores/auth.service";
import { makeAutoObservable, when } from "mobx";

export class CacheViewModel<T> {
  items: T[] = [];

  constructor(private accessor: () => Promise<T[]>) {}

  async load() {
    if (this.items.length > 0) return this.items;

    const items = await this.accessor();
    this.items = items;
    return items;
  }
}

export class KeyedCacheViewModel<T> {
  private _loaded = false;
  private _items: Record<string, T> = {};

  constructor(
    private accessor: () => Promise<T[]>,
    private keyAccessor: (item: T) => string,
  ) {
    makeAutoObservable(this);
    this.reload();
  }

  get isLoading() {
    return !this._loaded;
  }

  waitInit() {
    return when(() => this._loaded);
  }

  /**
   * Loads the items from the accessor and caches them.
   * @param force - If true, the items will be loaded from the accessor even if they are already cached.
   * @returns The cache view model itself.
   */
  async reload() {
    await when(() => AuthService.auth.state === "authenticated");
    const items = await this.accessor();
    this._items = items.reduce(
      (acc, item) => {
        acc[this.keyAccessor(item)] = item;
        return acc;
      },
      {} as Record<string, T>,
    );
    this._loaded = true;
  }

  get(key: number | string): T | null {
    return this._items[key.toString()] ?? null;
  }

  get items() {
    return Object.values(this._items);
  }
}
