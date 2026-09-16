export const CUSTOMER_SESSION_COOKIE = "customer_session";
export const CUSTOMER_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type CustomerSessionData = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  /** Epoch milliseconds. */
  expiresAt: number;
};

export const customerSessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: CUSTOMER_SESSION_MAX_AGE,
};
