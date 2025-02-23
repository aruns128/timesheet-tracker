import { setUsers, addUser, removeUser, type User } from '../stores/users';

const API_URL = 'http://localhost:5000/users';

export async function fetchUsers(): Promise<User[]> {
	try {
		const res = await fetch(API_URL);
		if (!res.ok) throw new Error('Failed to fetch users');
		const users = await res.json();
		setUsers(users); // Update the user store
		return users;
	} catch (err) {
		console.error('Error fetching users:', err);
		throw err;
	}
}

export async function createUser(user: User): Promise<User> {
	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(user)
		});
		if (!res.ok) throw new Error('Failed to create user');
		const newUser = await res.json();
		addUser(newUser); // Add new user to store
		return newUser;
	} catch (err) {
		console.error('Error creating user:', err);
		throw err;
	}
}

export async function deleteUser(userId: string): Promise<boolean> {
	if (!confirm('Are you sure you want to delete this user?')) return false;

	try {
		const res = await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
		if (!res.ok) throw new Error('Failed to delete user');
		removeUser(userId); // Remove user from store
		return true;
	} catch (err) {
		console.error('Error deleting user:', err);
		return false;
	}
}
