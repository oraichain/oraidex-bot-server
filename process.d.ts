declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    ENCRYPTED_MNEMONIC: string;
    CANCEL_PERCENTAGE: string;
    BUY_PERCENTAGE: string;
    ORDER_INTERVAL_RANGE: string;
    SPREAD_RANGE: string;
    VOLUME_RANGE: string;
    ORAI_THRESHOLD: string;
    USDT_THRESHOLD: string;
    ORDERBOOK_CONTRACT: string;
    USDT_CONTRACT: string;

    // GITHUB_ID: string;
    // GITHUB_SECRET: string;
    // FACEBOOK_ID: string;
    // FACEBOOK_SECRET: string;
    // TWITTER_ID: string;
    // TWITTER_SECRET: string;
    // GOOGLE_ID: string;
    // GOOGLE_SECRET: string;
    // AUTH0_ID: string;
    // AUTH0_SECRET: string;
  }
}
