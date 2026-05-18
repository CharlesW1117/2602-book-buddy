const BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const headers = options.headers || {};

  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err = new Error((data && data.message) || res.statusText || "API error");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  register: (payload) => request("/users/register", { method: "POST", body: payload }),
  login: (payload) => request("/users/login", { method: "POST", body: payload }),
  getProfile: (token) => request("/users/me", { method: "GET", token }),

  listBooks: () => request("/books", { method: "GET" }),
  getBook: (id) => request(`/books/${id}`, { method: "GET" }),

  getMyReservations: (token) => request("/reservations", { method: "GET", token }),
  reserveBook: (bookId, token) => request("/reservations", { method: "POST", token, body: { bookId } }),
  returnReservation: (reservationId, token) => request(`/reservations/${reservationId}`, { method: "DELETE", token }),
};
