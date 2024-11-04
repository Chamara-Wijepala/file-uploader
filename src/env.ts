declare global {
	namespace NodeJS {
		export interface ProcessEnv {
			SESSION_SECRET: string;
			CLOUDINARY_NAME: string;
			CLOUDINARY_API_KEY: string;
			CLOUDINARY_API_SECRET: string;
		}
	}
}

export {}; // Hack to get typescript to consider this file a module
