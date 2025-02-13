<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '../../stores/auth';
	import { goto } from '$app/navigation';

	let isAuthenticated = false;

	authStore.subscribe((store) => {
		isAuthenticated = store.isAuthenticated;
	});

	onMount(() => {
		if (!isAuthenticated) {
			goto('/login'); // Redirect to login if not authenticated
		}
	});

	function logout() {
		authStore.set({ user: null, isAuthenticated: false });
		localStorage.removeItem('user');
		goto('/login'); // Redirect to login after logout
	}
</script>

<h1>Dashboard</h1>
<button on:click={logout}>Logout</button>
