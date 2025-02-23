const API_URL = import.meta.env.VITE_API_URL;

export type SelectTypes = {
	id: string;
	label: string;
	value: string;
};

export async function fetchRoles() {
	try {
		const res = await fetch(`${API_URL}/roles`); // Replace with your API
		const data = await res.json();
		return data; // Assuming API returns an array of role strings
	} catch (error) {
		console.error('Failed to fetch roles:', error);
	}
}

export async function fetchWorkType() {
	try {
		const res = await fetch(`${API_URL}/workTypes`); // Replace with your API
		const data = await res.json();
		return data; // Assuming API returns an array of role strings
	} catch (error) {
		console.error('Failed to fetch roles:', error);
	}
}

export async function fetchStatus() {
	try {
		const res = await fetch(`${API_URL}/status`); // Replace with your API
		const data = await res.json();
		return data; // Assuming API returns an array of role strings
	} catch (error) {
		console.error('Failed to fetch roles:', error);
	}
}

export async function fetchProjects() {
	try {
		const res = await fetch(`${API_URL}/projects`); // Replace with your API
		const data = await res.json();
		return data; // Assuming API returns an array of role strings
	} catch (error) {
		console.error('Failed to fetch roles:', error);
	}
}
