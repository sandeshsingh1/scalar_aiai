export const categories = [
  "Electronics",
  "Fashion",
  "Home",
  "Appliances",
  "Beauty"
];

export const sampleProducts = [
  {
    id: "prd_phone_1",
    category: "Electronics",
    name: "PixelView Edge 5G Smartphone",
    brand: "PixelView",
    shortDescription: "120Hz AMOLED display, 256GB storage and 50MP AI camera.",
    description:
      "A premium mid-range phone built for all-day productivity, crisp photography and smooth gaming with a large battery and fast charging.",
    specifications: {
      Display: "6.7 inch AMOLED, 120Hz",
      Processor: "Octa-core 3.1 GHz",
      Battery: "5000 mAh, 67W fast charging",
      Storage: "256GB",
      Camera: "50MP + 12MP + 8MP rear, 32MP front"
    },
    price: 32999,
    originalPrice: 38999,
    stock: 18,
    rating: 4.6,
    reviewsCount: 2411,
    delivery: "Free delivery by tomorrow",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510557880182-3f8cbf500b88?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prd_laptop_1",
    category: "Electronics",
    name: "ZenPro Slim 14 Laptop",
    brand: "ZenPro",
    shortDescription: "Intel Ultra processor, 16GB RAM and 1TB SSD in a metal body.",
    description:
      "A thin-and-light productivity laptop designed for coding, editing and office workloads with excellent battery life and a sharp display.",
    specifications: {
      Display: "14 inch 2.8K OLED",
      Processor: "Intel Core Ultra 7",
      Memory: "16GB LPDDR5X",
      Storage: "1TB NVMe SSD",
      Weight: "1.32 kg"
    },
    price: 74990,
    originalPrice: 89990,
    stock: 9,
    rating: 4.5,
    reviewsCount: 896,
    delivery: "Free delivery in 2 days",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prd_headphones_1",
    category: "Electronics",
    name: "SoundBeat ANC Headphones",
    brand: "SoundBeat",
    shortDescription: "Wireless over-ear headphones with active noise cancellation.",
    description:
      "Deep bass, soft ear cushions and 40 hours of playback make these headphones ideal for work, travel and entertainment.",
    specifications: {
      Connectivity: "Bluetooth 5.3",
      Playback: "Up to 40 hours",
      Charging: "USB-C fast charging",
      Features: "ANC, Transparency mode, Multipoint pairing",
      Weight: "245 g"
    },
    price: 4999,
    originalPrice: 7999,
    stock: 30,
    rating: 4.3,
    reviewsCount: 3320,
    delivery: "Free delivery by tomorrow",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prd_shoes_1",
    category: "Fashion",
    name: "StrideMax Running Shoes",
    brand: "StrideMax",
    shortDescription: "Breathable knit runners with cushioned sole and arch support.",
    description:
      "Comfort-driven sports shoes designed for daily runs, commute use and light training with durable grip and responsive cushioning.",
    specifications: {
      Material: "Engineered knit upper",
      Sole: "High rebound EVA",
      Closure: "Lace-up",
      Use: "Running and walking",
      Warranty: "6 months"
    },
    price: 2499,
    originalPrice: 4499,
    stock: 42,
    rating: 4.2,
    reviewsCount: 5211,
    delivery: "Free delivery in 3 days",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prd_sofa_1",
    category: "Home",
    name: "CasaLoom 3-Seater Fabric Sofa",
    brand: "CasaLoom",
    shortDescription: "Modern living-room sofa with dense foam support and wooden legs.",
    description:
      "A clean-lined sofa with durable upholstery and supportive seating, built to fit apartments and family living rooms alike.",
    specifications: {
      Seating: "3 Seater",
      Fabric: "Polyester blend",
      Frame: "Seasoned wood",
      Color: "Teal blue",
      Assembly: "DIY with toolkit"
    },
    price: 18999,
    originalPrice: 27999,
    stock: 6,
    rating: 4.1,
    reviewsCount: 718,
    delivery: "Delivery in 5-7 days",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prd_mixer_1",
    category: "Appliances",
    name: "ChefMate Mixer Grinder 750W",
    brand: "ChefMate",
    shortDescription: "3-jar mixer grinder with copper motor and overload protection.",
    description:
      "Handles chutneys, smoothies and dry grinding with strong blades, sturdy jars and easy kitchen cleanup.",
    specifications: {
      Power: "750W",
      Jars: "3 stainless steel jars",
      Motor: "Copper winding",
      Safety: "Overload protection",
      Warranty: "2 years"
    },
    price: 3499,
    originalPrice: 5299,
    stock: 21,
    rating: 4.0,
    reviewsCount: 1854,
    delivery: "Free delivery by tomorrow",
    images: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prd_skincare_1",
    category: "Beauty",
    name: "GlowNest Vitamin C Skin Kit",
    brand: "GlowNest",
    shortDescription: "Cleanser, serum and day cream combo for brightening care.",
    description:
      "A beginner-friendly skincare combo enriched with vitamin C and niacinamide for everyday glow and hydration.",
    specifications: {
      Type: "Skin care combo",
      SkinType: "Normal to oily skin",
      Includes: "Cleanser, serum, day cream",
      KeyIngredients: "Vitamin C, niacinamide",
      ShelfLife: "18 months"
    },
    price: 1299,
    originalPrice: 1999,
    stock: 55,
    rating: 4.4,
    reviewsCount: 963,
    delivery: "Free delivery in 2 days",
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prd_watch_1",
    category: "Fashion",
    name: "AeroFit Smartwatch X2",
    brand: "AeroFit",
    shortDescription: "AMOLED smartwatch with calling, health tracking and GPS.",
    description:
      "A stylish smart wearable with Bluetooth calling, workout modes and long battery life for everyday fitness tracking.",
    specifications: {
      Display: "1.78 inch AMOLED",
      Battery: "10 days typical use",
      Connectivity: "Bluetooth calling",
      Sensors: "Heart rate, SpO2, sleep",
      WaterResistance: "IP68"
    },
    price: 3999,
    originalPrice: 7999,
    stock: 25,
    rating: 4.3,
    reviewsCount: 2781,
    delivery: "Free delivery by tomorrow",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"
    ]
  }
];

export const demoUser = {
  id: "usr_demo_1",
  name: "Demo Shopper",
  email: "demo@flipkartclone.dev",
  passwordHash: "$2b$10$4vG.60n8kNsRWWEDuJeCq.4Ta9JY3zhge36QTtf8l0oob8cMY3A2K"
};
