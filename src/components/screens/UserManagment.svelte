<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUsers, deleteUser, createUser } from '../../scripts/user-management';
	import { userStore, type User } from '../../stores/users';
	import { UserPlus } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { v4 as uuidv4 } from 'uuid';
	import { fetchRoles, type SelectTypes } from '../../scripts/utils';
	import Select from 'svelte-select';
	import { fade, fly } from 'svelte/transition';
	import { validateField } from '../../scripts/validation';

	let users: User[] = [];

	let errorUsername = writable('');
	let errorFullname = writable('');
	let errorRole = writable('');
	let errorPassword = writable('');

	let roles = writable<SelectTypes[]>([]); // Store for role options

	userStore.subscribe((value: User[]) => {
		users = value;
	});

	let showConfirmDelete = writable(false);
	let deleteTimesheetId = writable('');

	function confirmDelete(id: string) {
		deleteTimesheetId.set(id);
		showConfirmDelete.set(true);
	}

	function proceedDelete() {
		deleteUser($deleteTimesheetId);
		showConfirmDelete.set(false);
	}

	function cancelDelete() {
		showConfirmDelete.set(false);
	}

	async function loadUsers() {
		await fetchUsers();
	}

	async function loadRoles() {
		const fetchedRoles = await fetchRoles();
		roles.set(fetchedRoles);
	}

	onMount(() => {
		loadUsers();
		loadRoles();
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

	function validateForm() {
		let isValid = true;
		// Validate each field and set the respective error store if necessary
		validateField($newUser.fullname, 'Full Name', errorFullname, true);
		validateField($newUser.username, 'User Name', errorUsername, true);
		validateField($newUser.role, 'Role', errorRole, true);
		validateField($newUser.password, 'Password', errorPassword, true);

		// Check if any error exists, return false to prevent submission
		if ($errorFullname || $errorUsername || $errorRole || $errorPassword) {
			isValid = false;
		}

		return isValid;
	}

	function saveUser() {
		// Validate before saving
		if (validateForm()) {
			const userData = $newUser;
			createUser(userData);
			showNewUser.set(false);
		}
	}

	function cancelSaveUser() {
		showNewUser.set(false);
		errorFullname.set('');
		errorPassword.set('');
		errorRole.set('');
		errorUsername.set('');
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

{#if $showConfirmDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<!-- Modal Content -->
		<div
			class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg md:max-w-lg lg:max-w-xl dark:bg-gray-900"
		>
			<h3 class="text-lg font-bold">Are you sure you want to delete this ?</h3>
			<div class="mt-4 flex justify-end space-x-4">
				<button
					on:click={proceedDelete}
					class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">Delete</button
				>
				<button
					on:click={cancelDelete}
					class="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">Cancel</button
				>
			</div>
		</div>
	</div>
{/if}

{#if $showNewUser}
	<!-- Modal Overlay -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<!-- Modal Content -->
		<div
			class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg md:max-w-lg lg:max-w-xl dark:bg-gray-900"
		>
			<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Add New User</h2>

			<div class="space-y-4">
				<!-- Fullname -->
				<div>
					<label for="fullname" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Full Name
					</label>
					<input
						id="fullname"
						type="text"
						bind:value={$newUser.fullname}
						class="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Enter Fullname"
					/>
					{#if $errorFullname}
						<div class="mt-2 text-sm text-red-500">{$errorFullname}</div>
					{/if}
				</div>

				<!-- Username -->
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Username
					</label>
					<input
						id="username"
						type="text"
						bind:value={$newUser.username}
						class="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Enter Username"
					/>
					{#if $errorUsername}
						<div class="mt-2 text-sm text-red-500">{$errorUsername}</div>
					{/if}
				</div>

				<!-- Role Selection -->
				<div>
					<div>
						<label
							for="user-role"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Role
						</label>
						<div class="relative">
							<Select
								id="user-role"
								items={$roles}
								placeholder="Select Role"
								class="mt-1 w-full max-w-full"
								on:select={(event) => ($newUser.role = event.detail.value)}
							/>
						</div>
						{#if $errorRole}
							<div class="mt-2 text-sm text-red-500">{$errorRole}</div>
						{/if}
					</div>
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={$newUser.password}
						class="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Enter Password"
					/>
					{#if $errorPassword}
						<div class="mt-2 text-sm text-red-500">{$errorPassword}</div>
					{/if}
				</div>

				<!-- Buttons -->
				<div class="flex justify-between space-x-3">
					<button
						on:click={saveUser}
						class="w-full rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-all hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
					>
						Save
					</button>
					<button
						on:click={cancelSaveUser}
						class="w-full rounded-lg bg-gray-500 px-4 py-2 text-white shadow-md transition-all hover:bg-gray-600 focus:ring focus:ring-gray-300 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-800"
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
		{#each users as user (user.id)}
			<tr class="border border-gray-300" in:fade out:fly={{ y: -10, duration: 200 }}>
				<td class="border border-gray-300 p-2">{user.fullname}</td>
				<td class="border border-gray-300 p-2">{user.username}</td>
				<td class="border border-gray-300 p-2">{user.role}</td>
				<td class="border border-gray-300 p-2">
					<button
						on:click={() => confirmDelete(user.id)}
						class="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
					>
						Delete
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
