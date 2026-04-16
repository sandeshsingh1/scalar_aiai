import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "./api.js";
import { formatCurrency, percentageOff } from "./utils.js";

const navItems = [
  { to: "/", label: "Products" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/cart", label: "Cart" },
  { to: "/orders", label: "Orders" },
  { to: "/auth", label: "Login / Signup" }
];

function App() {
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api.getCategories().then(setCategories);
    api.getCart().then(setCart);
    api.getWishlist().then(setWishlist);
    api.getMe().then(setUser).catch(() => setUser(null));
  }, []);

  const syncCart = async () => setCart(await api.getCart());
  const syncWishlist = async () => setWishlist(await api.getWishlist());

  const addToCart = async (productId, quantity = 1) => {
    const nextCart = await api.addToCart(productId, quantity);
    setCart(nextCart);
    setNotice("Item added to cart.");
    window.setTimeout(() => setNotice(""), 2000);
  };

  const toggleWishlist = async (productId) => {
    await api.toggleWishlist(productId);
    await syncWishlist();
  };

  const onAuthSuccess = ({ user: nextUser, token }) => {
    localStorage.setItem("flipkart_token", token);
    setUser(nextUser);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand">
            <span className="brand__flip">Flipkart</span>
            <span className="brand__explore">Explore Plus Clone</span>
          </Link>
          <div className="searchbar">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for products, brands and more"
            />
          </div>
          <nav className="nav">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="page">
        {notice ? <div className="notice">{notice}</div> : null}
        <Routes>
          <Route
            path="/"
            element={
              <CatalogPage
                categories={categories}
                search={search}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            }
          />
          <Route
            path="/product/:id"
            element={<ProductPage addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
          />
          <Route
            path="/cart"
            element={<CartPage cart={cart} setCart={setCart} />}
          />
          <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/auth" element={<AuthPage onAuthSuccess={onAuthSuccess} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function CatalogPage({ categories, search, addToCart, wishlist, toggleWishlist }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    api.getProducts({ search, category }).then(setProducts);
  }, [search, category]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h3>Filters</h3>
        <button className={!category ? "filter active" : "filter"} onClick={() => setCategory("")}>
          All Categories
        </button>
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "filter active" : "filter"}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </aside>

      <section className="content">
        <div className="hero">
          <div>
            <p className="hero__eyebrow">Top offers on trending picks</p>
            <h1>Flipkart-style shopping flow with cart, wishlist, orders and checkout.</h1>
          </div>
          <div className="hero__meta">
            <span>{products.length} products</span>
            <span>Free delivery on selected items</span>
          </div>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="card">
              <button
                type="button"
                className={wishlist.some((item) => item.id === product.id) ? "wishlist active" : "wishlist"}
                onClick={() => toggleWishlist(product.id)}
              >
                ❤
              </button>
              <Link to={`/product/${product.id}`} className="card__imageWrap">
                <img src={product.images[0]} alt={product.name} className="card__image" />
              </Link>
              <div className="card__body">
                <Link to={`/product/${product.id}`} className="card__title">
                  {product.name}
                </Link>
                <p className="card__desc">{product.shortDescription}</p>
                <div className="rating-row">
                  <span className="rating-pill">{product.rating} ★</span>
                  <span>{product.reviewsCount.toLocaleString()} ratings</span>
                </div>
                <div className="price-row">
                  <strong>{formatCurrency(product.price)}</strong>
                  <s>{formatCurrency(product.originalPrice)}</s>
                  <span className="green">{percentageOff(product)}% off</span>
                </div>
                <p className="delivery">{product.delivery}</p>
                <button className="primary-btn" onClick={() => addToCart(product.id, 1)}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductPage({ addToCart, wishlist, toggleWishlist }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.getProduct(id).then((data) => {
      setProduct(data);
      setImageIndex(0);
    });
  }, [id]);

  if (!product) {
    return <p className="empty-state">Loading product details...</p>;
  }

  return (
    <div className="detail-page">
      <section className="gallery">
        <img src={product.images[imageIndex]} alt={product.name} className="gallery__main" />
        <div className="thumbs">
          {product.images.map((image, index) => (
            <button key={image} className={index === imageIndex ? "thumb active" : "thumb"} onClick={() => setImageIndex(index)}>
              <img src={image} alt={`${product.name} ${index + 1}`} />
            </button>
          ))}
        </div>
        <div className="detail-actions">
          <button className="primary-btn large" onClick={() => addToCart(product.id, 1)}>
            Add to Cart
          </button>
          <button
            className="accent-btn large"
            onClick={async () => {
              await addToCart(product.id, 1);
              navigate("/checkout");
            }}
          >
            Buy Now
          </button>
        </div>
      </section>

      <section className="detail-panel">
        <div className="detail-panel__top">
          <p className="muted">{product.brand}</p>
          <h1>{product.name}</h1>
          <div className="rating-row">
            <span className="rating-pill">{product.rating} ★</span>
            <span>{product.reviewsCount.toLocaleString()} ratings</span>
          </div>
          <div className="price-row large">
            <strong>{formatCurrency(product.price)}</strong>
            <s>{formatCurrency(product.originalPrice)}</s>
            <span className="green">{percentageOff(product)}% off</span>
          </div>
          <p className={product.stock > 0 ? "green strong" : "danger strong"}>
            {product.stock > 0 ? `In stock (${product.stock} left)` : "Out of stock"}
          </p>
          <p>{product.description}</p>
          <button
            className={wishlist.some((item) => item.id === product.id) ? "secondary-btn active" : "secondary-btn"}
            onClick={() => toggleWishlist(product.id)}
          >
            {wishlist.some((item) => item.id === product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        <div className="spec-box">
          <h3>Specifications</h3>
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="spec-row">
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  if (!cart.items.length) {
    return <div className="empty-state">Your cart is empty. Add something amazing from the catalog.</div>;
  }

  return (
    <div className="cart-layout">
      <section className="cart-items">
        {cart.items.map((item) => (
          <article key={item.id} className="cart-card">
            <img src={item.product.images[0]} alt={item.product.name} />
            <div className="cart-card__body">
              <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
              <p>{item.product.shortDescription}</p>
              <strong>{formatCurrency(item.product.price)}</strong>
              <div className="qty-row">
                <button onClick={async () => setCart(await api.updateCartItem(item.id, item.quantity - 1))}>-</button>
                <span>{item.quantity}</span>
                <button onClick={async () => setCart(await api.updateCartItem(item.id, item.quantity + 1))}>+</button>
                <button className="text-btn" onClick={async () => setCart(await api.removeCartItem(item.id))}>
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="summary">
        <h3>Price Details</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>{formatCurrency(cart.subtotal)}</strong>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <strong className="green">Free</strong>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <strong>{formatCurrency(cart.total)}</strong>
        </div>
        <button className="accent-btn large" onClick={() => navigate("/checkout")}>
          Place Order
        </button>
      </aside>
    </div>
  );
}

function CheckoutPage({ cart, setCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "Demo Shopper",
    phone: "9876543210",
    addressLine: "221B Commerce Street",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001"
  });
  const [loading, setLoading] = useState(false);

  if (!cart.items.length) {
    return <Navigate to="/cart" replace />;
  }

  const placeOrder = async () => {
    setLoading(true);
    try {
      const order = await api.placeOrder(form);
      setCart(await api.getCart());
      navigate(`/order-success/${order.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-layout">
      <section className="form-card">
        <h2>Shipping Address</h2>
        <div className="form-grid">
          {Object.entries(form).map(([key, value]) => (
            <label key={key}>
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
              <input value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            </label>
          ))}
        </div>
      </section>
      <aside className="summary">
        <h3>Order Summary</h3>
        {cart.items.map((item) => (
          <div key={item.id} className="summary-row">
            <span>
              {item.product.name} x {item.quantity}
            </span>
            <strong>{formatCurrency(item.total)}</strong>
          </div>
        ))}
        <div className="summary-row total">
          <span>Total Payable</span>
          <strong>{formatCurrency(cart.total)}</strong>
        </div>
        <button className="accent-btn large" onClick={placeOrder} disabled={loading}>
          {loading ? "Placing order..." : "Confirm & Place Order"}
        </button>
      </aside>
    </div>
  );
}

function OrderSuccessPage() {
  const { id } = useParams();

  return (
    <div className="success-card">
      <p className="hero__eyebrow">Order placed successfully</p>
      <h1>Your order ID is {id}</h1>
      <p>A confirmation email has been generated for the signed-in or demo user.</p>
      <div className="success-actions">
        <Link className="primary-btn" to="/orders">
          View Orders
        </Link>
        <Link className="secondary-btn" to="/">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function WishlistPage({ wishlist, addToCart, toggleWishlist }) {
  if (!wishlist.length) {
    return <div className="empty-state">Your wishlist is empty. Tap the heart icon on any product to save it.</div>;
  }

  return (
    <div className="product-grid">
      {wishlist.map((product) => (
        <article key={product.id} className="card">
          <button type="button" className="wishlist active" onClick={() => toggleWishlist(product.id)}>
            ❤
          </button>
          <img src={product.images[0]} alt={product.name} className="card__image" />
          <div className="card__body">
            <h3 className="card__title">{product.name}</h3>
            <div className="price-row">
              <strong>{formatCurrency(product.price)}</strong>
              <span className="green">{percentageOff(product)}% off</span>
            </div>
            <button className="primary-btn" onClick={() => addToCart(product.id, 1)}>
              Move to Cart
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  if (!orders.length) {
    return <div className="empty-state">No past orders yet. Place your first order to see order history here.</div>;
  }

  return (
    <div className="orders">
      {orders.map((order) => (
        <article key={order.id} className="order-card">
          <div className="order-card__header">
            <div>
              <p className="muted">Order ID</p>
              <h3>{order.id}</h3>
            </div>
            <strong>{formatCurrency(order.summary.total)}</strong>
          </div>
          <p className="muted">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          {order.items.map((item) => (
            <div key={item.id} className="summary-row">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <strong>{formatCurrency(item.total)}</strong>
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "demo@flipkartclone.dev", password: "password123" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    setMessage("");
    setError("");
    if (mode === "login") {
      setForm({ name: "", email: "demo@flipkartclone.dev", password: "password123" });
      return;
    }
    setForm({ name: "", email: "", password: "" });
  }, [mode]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const action = mode === "login" ? api.login : api.signup;
      const result = await action(form);
      onAuthSuccess(result);
      setMessage(
        mode === "login"
          ? `You are signed in as ${result.user.name}.`
          : `Account created successfully for ${result.user.name}.`
      );
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card__visual">
        <h2>{mode === "login" ? "Login" : "Signup"}</h2>
        <p>
          {mode === "login"
            ? "Get access to your cart, wishlist and order history."
            : "Create a new account to save your cart, wishlist and order history."}
        </p>
      </div>
      <form className="auth-card__form" onSubmit={submit}>
        <div className="tab-row">
          <button type="button" className={mode === "login" ? "tab active" : "tab"} onClick={() => setMode("login")}>
            Login
          </button>
          <button type="button" className={mode === "signup" ? "tab active" : "tab"} onClick={() => setMode("signup")}>
            Signup
          </button>
        </div>
        {mode === "signup" ? (
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
        ) : null}
        <label>
          <span>Email</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        {error ? <p className="danger">{error}</p> : null}
        {message ? <p className="green">{message}</p> : null}
        <button className="primary-btn" type="submit">
          {mode === "login" ? "Login" : "Create Account"}
        </button>
        <p className="muted small">Demo login: demo@flipkartclone.dev / password123</p>
      </form>
    </div>
  );
}

export default App;
