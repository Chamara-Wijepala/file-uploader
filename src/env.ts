declare global {
	namespace NodeJS {
		export interface ProcessEnv {
			SESSION_SECRET: string;
		}
	}
}

export {}; // Hack to get typescript to consider this file a module
