import { writable } from 'svelte/store';

export type User = {
	id: string;
	username: string;
	password: string;
	role: string;
	fullname: string;
};

export const userStore = writable<User[]>([]);

export function setUsers(users: User[]) {
	userStore.set(users);
}

export function addUser(user: User) {
	userStore.update((users) => [...users, user]);
}

export function removeUser(userId: string) {
	userStore.update((users) => users.filter((user) => user.id !== userId));
}
