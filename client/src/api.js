const apiBase = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

const buildUrl = (path) => `${apiBase}${path}`;

const jsonRequest = async (url, options = {}) => {
  const token = localStorage.getItem("flipkart_token");
  const response = await fetch(buildUrl(url), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
};

export const api = {
  getProducts: (params = {}) => {
    const search = new URLSearchParams(params);
    return jsonRequest(`/api/products?${search.toString()}`);
  },
  getProduct: (id) => jsonRequest(`/api/products/${id}`),
  getCategories: () => jsonRequest("/api/categories"),
  getCart: () => jsonRequest("/api/cart"),
  addToCart: (productId, quantity) =>
    jsonRequest("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity })
    }),
  updateCartItem: (itemId, quantity) =>
    jsonRequest(`/api/cart/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity })
    }),
  removeCartItem: (itemId) =>
    jsonRequest(`/api/cart/${itemId}`, {
      method: "DELETE"
    }),
  getWishlist: () => jsonRequest("/api/wishlist"),
  toggleWishlist: (productId) =>
    jsonRequest(`/api/wishlist/${productId}`, {
      method: "POST"
    }),
  signup: (payload) =>
    jsonRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    jsonRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getMe: () => jsonRequest("/api/me"),
  placeOrder: (shippingAddress) =>
    jsonRequest("/api/orders", {
      method: "POST",
      body: JSON.stringify({ shippingAddress })
    }),
  getOrders: () => jsonRequest("/api/orders")
};
