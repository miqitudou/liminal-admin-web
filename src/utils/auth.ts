const ACCESS_TOKEN_KEY = "liminal_admin_access_token";
const ADMIN_NAME_KEY = "liminal_admin_name";
const ADMIN_USERNAME_KEY = "liminal_admin_username";

export function getAccessToken(): string {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function setAccessToken(token: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getAdminName(): string {
  return window.localStorage.getItem(ADMIN_NAME_KEY) || "管理员";
}

export function setAdminName(name: string): void {
  window.localStorage.setItem(ADMIN_NAME_KEY, name);
}

export function clearAdminName(): void {
  window.localStorage.removeItem(ADMIN_NAME_KEY);
}

export function setAdminUsername(name: string): void {
  window.localStorage.setItem(ADMIN_USERNAME_KEY, name);
}

export function getAdminUsername(): string {
  return window.localStorage.getItem(ADMIN_USERNAME_KEY) || "";
}

export function clearAdminUsername(): void {
  window.localStorage.removeItem(ADMIN_USERNAME_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function clearAuthState(): void {
  clearAccessToken();
  clearAdminName();
  clearAdminUsername();
}
