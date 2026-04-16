import "dotenv/config";
import express from "express";
import cors from "cors";
import { attachUser } from "./middleware/auth.js";
import { memoryStore as store } from "./store/memoryStore.js";
import { signToken } from "./lib/token.js";
import { sendOrderConfirmation } from "./lib/mailer.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());
app.use(attachUser);

app.get("/api/health", async (_req, res) => {
  await store.bootstrap();
  res.json({ ok: true, storage: process.env.DATABASE_URL ? "postgres-ready" : "memory" });
});

app.get("/api/categories", async (_req, res) => {
  res.json(await store.getCategories());
});

app.get("/api/products", async (req, res) => {
  const products = await store.listProducts({
    search: req.query.search ?? "",
    category: req.query.category ?? ""
  });
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const product = await store.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }
  res.json(product);
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const user = await store.signup(req.body);
    res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const user = await store.login(req.body);
    res.json({ user, token: signToken(user) });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.get("/api/me", async (req, res) => {
  const user = await store.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.get("/api/cart", async (req, res) => {
  res.json(await store.getCart(req.user.id));
});

app.post("/api/cart", async (req, res) => {
  try {
    res.status(201).json(
      await store.addToCart(req.user.id, req.body.productId, Number(req.body.quantity || 1))
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/api/cart/:itemId", async (req, res) => {
  try {
    res.json(
      await store.updateCartItem(req.user.id, req.params.itemId, Number(req.body.quantity))
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/cart/:itemId", async (req, res) => {
  res.json(await store.removeCartItem(req.user.id, req.params.itemId));
});

app.get("/api/wishlist", async (req, res) => {
  res.json(await store.getWishlist(req.user.id));
});

app.post("/api/wishlist/:productId", async (req, res) => {
  res.json(await store.toggleWishlist(req.user.id, req.params.productId));
});

app.post("/api/orders", async (req, res) => {
  try {
    const order = await store.placeOrder(req.user.id, req.body.shippingAddress);
    const user = await store.getUserById(req.user.id);
    if (user) {
      const mailInfo = await sendOrderConfirmation({ user, order });
      order.emailNotification = mailInfo.messageId || "generated-preview";
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  res.json(await store.getOrders(req.user.id));
});

app.listen(port, async () => {
  await store.bootstrap();
  console.log(`Server running on http://localhost:${port}`);
});
