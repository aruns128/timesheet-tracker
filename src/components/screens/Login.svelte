<script lang="ts">
	import { login } from '../../scripts/login';
	import { writable } from 'svelte/store';
	import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-svelte';
	import { validateField } from '../../scripts/validation';
	import { goto } from '$app/navigation';

	// Local form state
	let username = '';
	let password = '';
	let error = writable('');
	let showPassword = writable(false);
	let usernameError = writable('');
	let passwordError = writable('');
	let isSubmitted = writable(false);
	let isLoading = writable(false);

	function togglePassword() {
		showPassword.update((v) => !v);
	}

	// Reset errors when user starts typing
	function resetErrors() {
		usernameError.set('');
		passwordError.set('');
	}

	async function handleLogin() {
		// Reset previous error messages and submission state
		resetErrors();
		isSubmitted.set(true);
		isLoading.set(true);

		// Validate fields
		validateField(username, 'Username', usernameError, $isSubmitted);
		validateField(password, 'Password', passwordError, $isSubmitted);

		// If there are validation errors, don't proceed
		if ($usernameError || $passwordError) {
			isLoading.set(false);
			return;
		}

		try {
			// Call login function and handle response
			const loginResponse = await login(username, password);
			if (loginResponse.success) {
				goto('/dashboard'); // Redirect after successful login
			} else {
				// Show error message from API response
				const errorMsg = loginResponse.message || 'Something went wrong, please try again.';
				error.set(errorMsg);
			}
		} catch (err: any) {
			const errorMsg = err.message || 'Something went wrong, please try again.';
			error.set(errorMsg);
		} finally {
			// Reset loading state
			isLoading.set(false);
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
	<form class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" on:submit|preventDefault={handleLogin}>
		<h2 class="mb-4 text-center text-3xl font-bold text-gray-700">Welcome Back</h2>

		<div class="relative mt-3">
			<input
				type="text"
				bind:value={username}
				placeholder="Username"
				class="w-full rounded-lg border-2 bg-gray-100 p-3 text-gray-800 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none {$usernameError ? 'border-red-500' : 'border-gray-100'}"
				on:input={resetErrors} 
			/>
			{#if $usernameError}
				<p class="mt-1 text-sm text-red-500">{$usernameError}</p>
			{/if}
		</div>

		<div class="relative mt-3">
			<input
				type={$showPassword ? 'text' : 'password'}
				bind:value={password}
				placeholder="Password"
				class="w-full rounded-lg border-2 bg-gray-100 p-3 pr-12 text-gray-800 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none {$passwordError ? 'border-red-500' : 'border-gray-100'}"
				on:input={resetErrors} 
			/>
			<button
				type="button"
				on:click={togglePassword}
				class="absolute top-3 right-3 text-gray-500 transition-all hover:text-gray-700"
			>
				{#if $showPassword}
					<EyeOff size={20} />
				{:else}
					<Eye size={20} />
				{/if}
			</button>
			{#if $passwordError}
				<p class="mt-1 text-sm text-red-500">{$passwordError}</p>
			{/if}
		</div>

		<button
			type="submit"
			class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-400 py-3 text-lg font-medium text-white shadow-md transition-all duration-200 hover:bg-blue-500 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
			disabled={$isLoading}
		>
			{#if $isLoading}
				<Loader2 size={20} class="animate-spin" />
				Logging in...
			{:else}
				Login <ArrowRight size={20} />
			{/if}
		</button>
	</form>
</div>
