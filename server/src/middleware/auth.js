import { verifyToken } from "../lib/token.js";

export const attachUser = async (req, _res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name
      };
      return next();
    } catch {
      return next();
    }
  }

  req.user = {
    id: process.env.DEMO_USER_ID || "usr_demo_1",
    email: "demo@flipkartclone.dev",
    name: "Demo Shopper"
  };
  next();
};
