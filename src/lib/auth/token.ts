import jwt from "jsonwebtoken";
import { UserPlan } from "@/enums/users/user-plan.enum";

interface SignupTokenPayload {
  email: string;
  plan: UserPlan;
  cartId: string;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const generateSignupToken = (
  payload: Omit<SignupTokenPayload, "exp">
): string => {
  const tokenPayload: SignupTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  return jwt.sign(tokenPayload, JWT_SECRET);
};

export const verifySignupToken = (token: string): SignupTokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SignupTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw error;
  }
};
