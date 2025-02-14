import { writable } from 'svelte/store';

export type User = {
	id: number;
	username: string;
	password: string;
	role: 'admin' | 'user';
	fullname: string;
};

export type AuthState = {
	user: User | null;
	isAuthenticated: boolean;
};

const authStore = writable<AuthState>({
	user: null,
	isAuthenticated: false
});

// ✅ Only access `localStorage` in the browser
if (typeof window !== 'undefined') {
	const storedUser = localStorage.getItem('user');
	if (storedUser) {
		authStore.set({ user: JSON.parse(storedUser), isAuthenticated: true });
	}

	authStore.subscribe((value) => {
		if (value.isAuthenticated) {
			localStorage.setItem('user', JSON.stringify(value.user));
		} else {
			localStorage.removeItem('user');
		}
	});
}

export { authStore };
