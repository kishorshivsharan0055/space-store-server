declare namespace NodeJS {
	interface ProcessEnv {
		DATABASE_URL: string;
		SECRET_KEY: string;
		GOOGLE_APPLICATION_CREDENTIALS: string;
		PORT: string;
	}
}
