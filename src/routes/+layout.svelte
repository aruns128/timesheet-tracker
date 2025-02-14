<script lang="ts">
	import '../app.css';
	import { authStore } from '../stores/auth';
	import {
		LogOut,
		User,
		Home,
		ClipboardList,
		ArrowRightCircle,
		ArrowLeftCircle,
		UserRoundCog
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { routePermissions } from '../scripts/routes';

	let isSidebarOpen = $state(true);
	let auth: { isAuthenticated: boolean; user: any } = $state({
		isAuthenticated: false,
		user: null
	});
	let loading = $state(true);
	let currentPath = $state('');
	let pageTitle = $state('');
	let showDropdown = $state(false);

	onMount(() => {
		authStore.subscribe((value:any) => {
			auth = value;
			loading = false; // Set loading to false once auth data is available

			// Restrict access when authentication is ready
			if (!routePermissions[page.url.pathname as keyof typeof routePermissions]?.includes(auth?.user?.role)) {
				goto('/dashboard');
			}
			
		});
	});

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	function logout() {
		authStore.set({ user: null, isAuthenticated: false });
		localStorage.removeItem('user');
		goto('/login');
	}

	const routeTitles: Record<string, string> = {
		'/dashboard': 'Dashboard',
		'/timesheets': 'Timesheets',
		'/user-management': 'User Management'
	};

	$effect(() => {
		currentPath = page.url.pathname;
		pageTitle = routeTitles[`${currentPath}`] || 'Dashboard';


	});

	function getLinkClasses(path: string) {
		return `flex gap-3 px-4 py-2 rounded-md transition-all duration-300 w-full ${
			!isSidebarOpen ? 'items-center justify-center' : ''
		} ${
			currentPath === path
				? 'text-white font-semibold bg-blue-600'
				: 'text-gray-300 hover:text-white hover:bg-blue-500'
		}`;
	}
</script>

{#if loading}
	<div class="flex h-screen items-center justify-center">
		<p class="text-gray-500">Loading...</p>
	</div>
{:else if auth?.isAuthenticated}
	<div class="flex h-screen w-full font-bold">
		<!-- Sidebar with smooth animation -->
		<div
			class="absolute flex h-full transform flex-col justify-between bg-gray-700 text-white transition-all
				duration-500 ease-in-out sm:relative sm:translate-x-0"
			class:w-64={isSidebarOpen}
			class:w-16={!isSidebarOpen}
			class:-translate-x-full={!isSidebarOpen}
		>
			<!-- Logo & Toggle Button -->
			<div class="flex justify-end p-2">
				<!-- Sidebar Toggle Button -->
				<button onclick={toggleSidebar} class="text-gray-300 hover:text-white">
					{#if isSidebarOpen}
						<ArrowLeftCircle size={24} />{:else}
						<ArrowRightCircle size={24} />
					{/if}
				</button>
			</div>

			<!-- Navigation Links -->
			<nav class="mt-5 flex flex-1 flex-col items-center justify-center gap-2">
				{#if routePermissions['/dashboard'].includes(auth?.user?.role)}
					<a href="/dashboard" class={getLinkClasses('/dashboard')}>
						<Home size={20} />
						<span class:hidden={!isSidebarOpen}>Dashboard</span>
					</a>
				{/if}
			
				{#if routePermissions['/timesheets'].includes(auth?.user?.role)}
					<a href="/timesheets" class={getLinkClasses('/timesheets')}>
						<ClipboardList size={20} />
						<span class:hidden={!isSidebarOpen}>Timesheets</span>
					</a>
				{/if}
			
				{#if routePermissions['/user-management'].includes(auth?.user?.role)}
					<a href="/user-management" class={getLinkClasses('/user-management')}>
						<UserRoundCog size={20} />
						<span class:hidden={!isSidebarOpen}>User Management</span>
					</a>
				{/if}
			</nav>
		</div>

		<!-- Main Content -->
		<div class="flex min-h-screen flex-1 flex-col">
			<!-- Top Bar -->
			<div class="flex w-full items-center justify-between bg-white p-4 shadow-md">
				<button
					class="block items-center justify-center text-gray-700 sm:hidden"
					onclick={toggleSidebar}
				>
					{#if isSidebarOpen}
						<ArrowLeftCircle size={24} />{:else}
						<ArrowRightCircle size={24} />
					{/if}
				</button>
				<h2 class="text-xl font-semibold">{pageTitle}</h2>
				<div class="relative">
					<button
						class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700 uppercase hover:bg-gray-300"
						onclick={() => (showDropdown = !showDropdown)}
					>
						{auth?.user?.fullname?.[0] || 'U'}
					</button>
					{#if showDropdown}
						<div class="absolute right-0 mt-2 w-40 rounded-md bg-white py-2 shadow-md">
							<button class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
								<User size={20} class="mr-2 inline" />
								{auth?.user?.fullname}
							</button>
							<button
								onclick={logout}
								class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
							>
								<LogOut size={20} class="mr-2 inline" /> Logout
							</button>
						</div>
					{/if}
				</div>
			</div>

			<!-- Page Content -->
			<!-- svelte-ignore slot_element_deprecated -->
			<div class="flex-1 overflow-auto p-4">
				<slot />
			</div>
		</div>
	</div>
{:else}
	<!-- svelte-ignore slot_element_deprecated -->
	<slot />
{/if}
