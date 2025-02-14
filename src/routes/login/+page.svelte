<script lang="ts">
	import Login from '../../components/screens/Login.svelte';
	import { checkAuth } from '../../scripts/login';
	import { onMount } from 'svelte';

	onMount(() => {
		checkAuth(); // Auto-login if session exists
	});
</script>

<Login />
