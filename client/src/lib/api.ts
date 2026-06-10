const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = {
  get: (path: string) =>
    fetch(`${BASE_URL}${path}`, { credentials: "include" }).then((r) => r.json()),

  post: (path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  put: (path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  delete: (path: string) =>
    fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      credentials: "include",
    }).then((r) => r.json()),
};
