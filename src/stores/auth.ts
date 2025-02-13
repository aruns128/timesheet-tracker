import { writable } from 'svelte/store';

export type User = {
	id: number;
	username: string;
	password: string;
	role: 'admin' | 'user';
};

export type AuthState = {
	user: User | null;
	isAuthenticated: boolean;
};

const authStore = writable<AuthState>({
	user: null,
	isAuthenticated: false
});

// ✅ Explicitly export the store (default export won't work in SvelteKit)
export { authStore };
