import { goto } from '$app/navigation';
import { authStore, type User } from '../stores/auth';

export async function login(username: string, password: string) {
  try {
    const res = await fetch('http://localhost:5000/users');
    const users: User[] = await res.json();

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      authStore.set({ user, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(user)); // Persist session
      goto('/dashboard'); // Redirect after login
    } else {
      authStore.set({ user: null, isAuthenticated: false }); // Reset on failure
      throw new Error('Invalid username or password');
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error connecting to the server');
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
