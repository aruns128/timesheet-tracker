import { goto } from '$app/navigation';
import { authStore, type User } from '../stores/auth';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(username: string, password: string) {
	try {
	  const res = await fetch(`${API_URL}/users`);
	  const users: User[] = await res.json();
  
	  const user = users.find((u) => u.username === username && u.password === password);
  
	  if (user) {
		authStore.set({ user, isAuthenticated: true });
		localStorage.setItem('user', JSON.stringify(user)); // Persist session
		return { success: true }; // Return success object
	  } else {
		authStore.set({ user: null, isAuthenticated: false }); // Reset on failure
		return { success: false, message: 'Invalid username or password' }; // Return failure with message
	  }
	} catch (err) {
	  console.error(err);
	  return { success: false, message: 'Error connecting to the server' }; // Return error message
	}
  }

// Function to auto-login from localStorage
export function checkAuth() {
	const savedUser = localStorage.getItem('user');
	if (savedUser) {
		authStore.set({ user: JSON.parse(savedUser), isAuthenticated: true });
		goto('/dashboard');
	}
}
