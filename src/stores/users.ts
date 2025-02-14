import { writable } from 'svelte/store';

export type User = {
	id: number;
	username: string;
	password: string;
	role: 'admin' | 'user';
	fullname: string;
};

export const userStore = writable<User[]>([]);

export function setUsers(users: User[]) {
	userStore.set(users);
}

export function addUser(user: User) {
	userStore.update((users) => [...users, user]);
}

export function removeUser(userId: number) {
	userStore.update((users) => users.filter((user) => user.id !== userId));
}
