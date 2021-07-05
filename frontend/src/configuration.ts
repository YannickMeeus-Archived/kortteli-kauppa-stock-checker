export const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://kksc-api.sillygoose.io"
    : "http://localhost:8000";
