<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUsers, deleteUser } from '../../scripts/user-management';
	import { userStore, type User } from '../../stores/users';

	let users: User[] = [];

	// Subscribe to store
	userStore.subscribe((value: User[]) => {
		users = value;
	});

	async function loadUsers() {
		await fetchUsers(); // This updates the store, which updates the UI
	}

	onMount(loadUsers);
</script>

<h1 class="text-2xl font-bold">User Management</h1>

<table class="w-full border-collapse border border-gray-300 mt-4">
	<thead>
		<tr class="bg-gray-100">
			<th class="border border-gray-300 p-2">ID</th>
			<th class="border border-gray-300 p-2">Full Name</th>
			<th class="border border-gray-300 p-2">User id</th>
			<th class="border border-gray-300 p-2">Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			<tr class="border border-gray-300">
				<td class="border border-gray-300 p-2">{user.id}</td>
				<td class="border border-gray-300 p-2">{user.fullname}</td>
				<td class="border border-gray-300 p-2">{user.username}</td>
				<td class="border border-gray-300 p-2">
					<button
						on:click={() => deleteUser(user.id)}
						class="bg-red-500 text-white px-3 py-1 rounded"
					>
						Delete
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<!-- <script>
	async function deleteUser(userId) {
		if (!confirm('Are you sure you want to delete this user?')) return;

		try {
			const res = await fetch(`http://localhost:5000/users/${userId}`, {
				method: 'DELETE'
			});
			if (res.ok) {
				users = users.filter(user => user.id !== userId);
			} else {
				console.error('Failed to delete user');
			}
		} catch (err) {
			console.error('Error deleting user:', err);
		}
	}
</script> -->
