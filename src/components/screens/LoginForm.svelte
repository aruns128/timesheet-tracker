<script lang="ts">
	import { login } from '../../scripts/login';
	import { writable } from 'svelte/store';
	import { Eye, EyeOff, ArrowRight } from 'lucide-svelte';

	let username = writable('');
	let password = writable('');
	let error = writable('');
	let showPassword = writable(false);

	function togglePassword() {
		showPassword.update((v) => !v);
	}

	async function handleLogin() {
		error.set('');
		try {
			await login($username, $password);
		} catch (err: any) {
			error.set(err.message);
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
	<div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
		<h2 class="mb-4 text-center text-3xl font-bold text-gray-700">Welcome Back</h2>
		{#if $error}
			<p class="mb-3 text-center text-sm font-medium text-red-500">{$error}</p>
		{/if}

		<div class="relative mt-3">
			<input
				type="text"
				bind:value={$username}
				placeholder="Username"
				class="w-full rounded-lg bg-gray-100 p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm"
			/>
		</div>

		<div class="relative mt-3">
			<input
				type={$showPassword ? 'text' : 'password'}
				bind:value={$password}
				placeholder="Password"
				class="w-full rounded-lg bg-gray-100 p-3 text-gray-800 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm"
			/>
			<button
				type="button"
				on:click={togglePassword}
				class="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-all"
			>
				{#if $showPassword}
					<EyeOff size={20} />
				{:else}
					<Eye size={20} />
				{/if}
			</button>
		</div>

		<button
			on:click={handleLogin}
			class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-400 py-3 text-lg font-medium text-white shadow-md transition-all duration-200 hover:bg-blue-500 hover:shadow-lg"
		>
			Login <ArrowRight size={20} />
		</button>
	</div>
</div>
