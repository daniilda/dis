export const createAsyncQueue = <T>(factory: () => Promise<T>) => {
  const deferreds: {
    resolve: (v: T) => void;
    factory: () => Promise<T>;
  }[] = [];

  let resolving = false;

  return () => {
    return new Promise<T>(async (res) => {
      deferreds.push({
        resolve: res,
        factory,
      });

      if (!resolving) {
        resolving = true;
        for (let i = 0; i < deferreds.length; i++) {
          const res = await deferreds[i].factory();
          deferreds[i].resolve(res);
        }
        resolving = false;
      }
    });
  };
};
