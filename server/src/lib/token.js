import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "flipkart-clone-secret";

export const signToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name
    },
    secret,
    { expiresIn: "7d" }
  );

export const verifyToken = (token) => jwt.verify(token, secret);
