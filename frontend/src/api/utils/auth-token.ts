const tokenKey = "authToken";

let token: string | null = null;

export const authToken = {
  get: (): string | null => {
    token ??= localStorage[tokenKey];
    return token;
  },
  set: (newToken: string) => {
    localStorage[tokenKey] = newToken;
    token = newToken;
  },
  remove: () => {
    localStorage.removeItem(tokenKey);
    token = null;
  },
};
