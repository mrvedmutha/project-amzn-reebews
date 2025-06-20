declare namespace NodeJS {
  interface ProcessEnv {
    RESEND_API_KEY: string;
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_APP_URL: string;
  }
}
