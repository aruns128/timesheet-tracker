<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '../stores/auth';
	import { goto } from '$app/navigation';

	let isAuthenticated = false;

	authStore.subscribe((store) => {
		isAuthenticated = store.isAuthenticated;
	});

	onMount(() => {
		if (!isAuthenticated) {
			goto('/login'); // Redirect to login if not authenticated
		} else {
			goto('/dashboard'); // Redirect to dashboard if logged in
		}
	});
</script>

<h1>Redirecting...</h1>
