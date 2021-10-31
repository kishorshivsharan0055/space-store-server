declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    SECRET_KEY: string;
    PORT: string;
    RAZORPAY_KEY_ID: string;
    RAZORPAY_SECRET_KEY: string;
  }
}
