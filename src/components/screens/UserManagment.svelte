<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUsers, deleteUser, createUser } from '../../scripts/user-management';
	import { userStore, type User } from '../../stores/users';
	import { UserPlus } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { v4 as uuidv4 } from 'uuid';

	let users: User[] = [];
	type Role = {
		id: string;
		value: string;
	};
	let roles = writable<Role[]>([]); // Store for role options

	userStore.subscribe((value: User[]) => {
		users = value;
	});

	async function loadUsers() {
		await fetchUsers();
	}

	async function fetchRoles() {
		try {
			const res = await fetch('http://localhost:5000/roles'); // Replace with your API
			const data = await res.json();
			roles.set(data); // Assuming API returns an array of role strings
		} catch (error) {
			console.error('Failed to fetch roles:', error);
		}
	}

	onMount(() => {
		loadUsers();
		fetchRoles();
	});

	let newUser = writable({
		username: '',
		fullname: '',
		role: '',
		password: '',
		id: uuidv4()
	});
	let showNewUser = writable(false);

	function openCreateUser() {
		newUser.set({
			username: '',
			fullname: '',
			role: '',
			password: '',
			id: uuidv4()
		});
		showNewUser.set(true);
	}

	function saveUser() {
		const userData = $newUser;
		createUser(userData);
		showNewUser.set(false);
	}
</script>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-bold">User Management</h1>
	<div>
		<button
			on:click={openCreateUser}
			class="flex items-center justify-between gap-2 rounded-md bg-blue-500 p-2 font-bold text-white"
		>
			<UserPlus size={20} />
			<span class="hidden sm:block">Add User</span>
		</button>
	</div>
</div>

{#if $showNewUser}
	<!-- Modal for creating a new user -->
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
		<div
			class="m-2 max-h-screen w-full overflow-y-auto rounded-md bg-slate-100 p-6 shadow-lg sm:w-96 lg:w-1/2 xl:w-1/3"
		>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="fullname"
						>Fullname</label
					>
					<input
						id="fullname"
						type="text"
						bind:value={$newUser.fullname}
						class="w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Enter Fullname"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="username"
						>Username</label
					>
					<input
						id="username"
						type="text"
						bind:value={$newUser.username}
						class="w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Enter Username"
					/>
				</div>
				<div>
					<label for="user-role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Role
					</label>
					<select
						id="user-role"
						bind:value={$newUser.role}
						class="w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
					>
						<option value="" disabled selected>Select Role</option>
						{#each $roles as role}
							<option value={role.id}>{role.value}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="password"
						>Password</label
					>
					<input
						id="password"
						type="password"
						bind:value={$newUser.password}
						class="w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Enter Password"
					/>
				</div>

				<div class="flex space-x-3">
					<button
						on:click={saveUser}
						class="w-1/2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
					>
						Save
					</button>
					<button
						on:click={() => showNewUser.set(false)}
						class="w-1/2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<table class="mt-4 w-full border-collapse border border-gray-300">
	<thead>
		<tr class="bg-gray-100 text-left">
			<th class="border border-gray-300 p-2">Full Name</th>
			<th class="border border-gray-300 p-2">User Id</th>
			<th class="border border-gray-300 p-2">User Role</th>
			<th class="border border-gray-300 p-2">Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			<tr class="border border-gray-300">
				<td class="border border-gray-300 p-2">{user.fullname}</td>
				<td class="border border-gray-300 p-2">{user.username}</td>
				<td class="border border-gray-300 p-2">{user.role}</td>
				<td class="border border-gray-300 p-2">
					<button
						on:click={() => deleteUser(user.id)}
						class="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
					>
						Delete
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
