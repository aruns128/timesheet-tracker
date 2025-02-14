<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '../../stores/auth';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

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
		let auth = get(authStore);
		console.log(auth);
		goto('/login'); // Redirect to login after logout
	}
</script>

<h1>Timesheets</h1>
