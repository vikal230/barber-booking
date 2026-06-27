// import jwt from "jsonwebtoken";

// interface TokenPayload {
//   userId: string;
//   salonId?: string;
//   role: "super_admin" | "salon_owner" | "barber" | "customer";
// }

// export const generateAccessToken = (payload: TokenPayload): string => {
//   return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
// };

// export const generateRefreshToken = (payload: TokenPayload): string => {
//   return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
// };

// export const verifyRefreshToken = (token: string): TokenPayload => {
//   return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
// };


import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  salonId?: string;
  role: "super_admin" | "salon_owner" | "barber" | "customer";
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;
  return {
    userId: decoded.userId,
    salonId: decoded.salonId,
    role: decoded.role,
  };
};