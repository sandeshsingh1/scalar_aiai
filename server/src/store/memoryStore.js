import bcrypt from "bcryptjs";
import { demoUser, sampleProducts, categories } from "../data/sampleData.js";

const clone = (value) => JSON.parse(JSON.stringify(value));

const state = {
  users: [clone(demoUser)],
  cartItems: [],
  wishlistItems: [],
  orders: []
};

const withComputedPricing = (product) => ({
  ...product,
  discountPercentage: Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )
});

export const memoryStore = {
  async bootstrap() {
    return true;
  },

  async getCategories() {
    return categories;
  },

  async listProducts({ search = "", category = "" } = {}) {
    const searchText = search.trim().toLowerCase();
    return sampleProducts
      .filter((product) => {
        const matchesSearch =
          !searchText ||
          product.name.toLowerCase().includes(searchText) ||
          product.brand.toLowerCase().includes(searchText);
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
      })
      .map(withComputedPricing);
  },

  async getProductById(productId) {
    const product = sampleProducts.find((item) => item.id === productId);
    return product ? withComputedPricing(product) : null;
  },

  async getUserById(userId) {
    return state.users.find((user) => user.id === userId) ?? null;
  },

  async getUserByEmail(email) {
    return state.users.find((user) => user.email === email) ?? null;
  },

  async signup({ name, email, password }) {
    const existing = await this.getUserByEmail(email);
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: `usr_${Date.now()}`,
      name,
      email,
      passwordHash
    };
    state.users.push(user);
    return { id: user.id, name: user.name, email: user.email };
  },

  async login({ email, password }) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new Error("Invalid credentials.");
    }

    return { id: user.id, name: user.name, email: user.email };
  },

  async getCart(userId) {
    const items = await Promise.all(
      state.cartItems
        .filter((item) => item.userId === userId)
        .map(async (item) => {
          const product = await this.getProductById(item.productId);
          return {
            id: item.id,
            quantity: item.quantity,
            product,
            total: item.quantity * product.price
          };
        })
    );
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    return {
      items,
      subtotal,
      deliveryFee: subtotal > 0 ? 0 : 0,
      total: subtotal
    };
  },

  async addToCart(userId, productId, quantity = 1) {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new Error("Product not found.");
    }
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1.");
    }
    const existing = state.cartItems.find(
      (item) => item.userId === userId && item.productId === productId
    );
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      state.cartItems.push({
        id: `cart_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
        userId,
        productId,
        quantity: Math.min(quantity, product.stock)
      });
    }
    return this.getCart(userId);
  },

  async updateCartItem(userId, itemId, quantity) {
    const item = state.cartItems.find(
      (entry) => entry.id === itemId && entry.userId === userId
    );
    if (!item) {
      throw new Error("Cart item not found.");
    }
    if (quantity < 1) {
      state.cartItems = state.cartItems.filter((entry) => entry.id !== itemId);
      return this.getCart(userId);
    }
    item.quantity = quantity;
    return this.getCart(userId);
  },

  async removeCartItem(userId, itemId) {
    state.cartItems = state.cartItems.filter(
      (entry) => !(entry.id === itemId && entry.userId === userId)
    );
    return this.getCart(userId);
  },

  async getWishlist(userId) {
    return Promise.all(
      state.wishlistItems
        .filter((item) => item.userId === userId)
        .map(async (item) => this.getProductById(item.productId))
    );
  },

  async toggleWishlist(userId, productId) {
    const existing = state.wishlistItems.find(
      (item) => item.userId === userId && item.productId === productId
    );
    if (existing) {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => !(item.userId === userId && item.productId === productId)
      );
      return { added: false };
    }
    state.wishlistItems.push({
      id: `wish_${Date.now()}`,
      userId,
      productId
    });
    return { added: true };
  },

  async placeOrder(userId, shippingAddress) {
    const cart = await this.getCart(userId);
    if (!cart.items.length) {
      throw new Error("Your cart is empty.");
    }
    const order = {
      id: `OD${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      shippingAddress,
      summary: {
        subtotal: cart.subtotal,
        deliveryFee: cart.deliveryFee,
        total: cart.total
      },
      items: cart.items
    };
    state.orders.unshift(order);
    state.cartItems = state.cartItems.filter((item) => item.userId !== userId);
    return order;
  },

  async getOrders(userId) {
    return state.orders.filter((order) => order.userId === userId);
  }
};
