<script lang="ts">
	import {
		addTimesheet,
		timesheets,
		fetchTimesheets,
		deleteTimesheet,
		updateTimesheet,
		type Timesheet
	} from '../../scripts/timesheets';
	import { writable, derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import { Trash, Edit, Plus } from 'lucide-svelte';
	import { v4 as uuidv4 } from 'uuid';
	import Select from 'svelte-select';
	import { fetchProjects, fetchStatus, fetchWorkType, type SelectTypes } from '../../scripts/utils';
	import { fade, fly } from 'svelte/transition';
	import { validateField } from '../../scripts/validation';

	let showNewRow = writable(false);
	let showConfirmDelete = writable(false);
	let deleteTimesheetId = writable('');

	let startDate = writable('');
	let endDate = writable('');
	let searchJiraNo = writable('');

	let editingTimesheetId = writable(null);

	let errorDate = writable('');
	let errorJiraNo = writable('');
	let errorTaskUpdates = writable('');
	let errorName = writable('');
	let errorHours = writable('');

	function validateForm() {
		let isValid = true;
		// Validate each field and set the respective error store if necessary
		validateField($newTimesheet.date, 'Date', errorDate, true);
		validateField($newTimesheet.jiraNo, 'Jira No', errorJiraNo, true);
		validateField($newTimesheet.taskUpdates, 'Task Updates', errorTaskUpdates, true);
		validateField($newTimesheet.name, 'Name', errorName, true);
		validateField($newTimesheet.hours, 'Hours', errorHours, true);

		// Check if any error exists, return false to prevent submission
		if ($errorDate || $errorJiraNo || $errorTaskUpdates || $errorName || $errorHours) {
			isValid = false;
		}

		return isValid;
	}

	function editTimesheet(timesheet: any) {
		newTimesheet.set({ ...timesheet });
		editingTimesheetId.set(timesheet.id); // Store the ID of the timesheet being edited
		showNewRow.set(true);
	}

	let workTypes = writable<SelectTypes[]>([]); // Store for role options

	async function loadWorkTypes() {
		const fetchedWorkTypes = await fetchWorkType();
		workTypes.set(fetchedWorkTypes);
	}

	let status = writable<SelectTypes[]>([]); // Store for role options

	async function loadStatus() {
		const fetchedStatus = await fetchStatus();
		status.set(fetchedStatus);
	}

	let projects = writable<SelectTypes[]>([]); // Store for role options

	async function loadProjects() {
		const fetchedProjects = await fetchProjects();
		projects.set(fetchedProjects);
	}

	let newTimesheet = writable<Timesheet>({
		date: '',
		jiraNo: '',
		taskUpdates: '',
		name: '',
		hours: '',
		id: uuidv4(),
		project: $projects[0],
		workType: $workTypes[0],
		status: $status[0]
	});

	function addNewRow() {
		newTimesheet.set({
			date: '',
			jiraNo: '',
			taskUpdates: '',
			name: '',
			hours: '',
			id: uuidv4(),
			project: $projects[0],
			workType: $workTypes[0],
			status: $status[0]
		});
		showNewRow.set(true);
	}

	function saveTimesheet() {
		const timesheetData = $newTimesheet;

		// Validate before saving
		if (validateForm()) {
			if ($editingTimesheetId) {
				updateTimesheet($editingTimesheetId, timesheetData);
				editingTimesheetId.set(null);
			} else {
				addTimesheet(timesheetData);
			}

			showNewRow.set(false);
		}
	}

	function confirmDelete(id: string) {
		deleteTimesheetId.set(id);
		showConfirmDelete.set(true);
	}

	function proceedDelete() {
		deleteTimesheet($deleteTimesheetId);
		showConfirmDelete.set(false);
	}

	function cancelDelete() {
		showConfirmDelete.set(false);
	}

	const filteredTimesheets = derived(
		[timesheets, startDate, endDate, searchJiraNo],
		([$timesheets, $startDate, $endDate, $searchJiraNo]) => {
			return $timesheets
				.filter((ts) => ts.date >= $startDate && ts.date <= $endDate)
				.filter((ts) => ts.jiraNo.toLowerCase().includes($searchJiraNo.toLowerCase()))
				.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
		}
	);

	function cancelTimesheetForm() {
		showNewRow.set(false);
		editingTimesheetId.set(null); // Reset editing state
		errorDate.set('');
		errorJiraNo.set('');
		errorTaskUpdates.set('');
		errorName.set('');
		errorHours.set('');
	}

	onMount(() => {
		const today = new Date();
		endDate.set(today.toISOString().split('T')[0]);

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(today.getDate() - 7);
		startDate.set(sevenDaysAgo.toISOString().split('T')[0]);

		fetchTimesheets();
		loadWorkTypes();
		loadStatus();
		loadProjects();
	});
</script>

{#if $showConfirmDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<!-- Modal Content -->
		<div
			class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg md:max-w-lg lg:max-w-xl dark:bg-gray-900"
		>
			<h3 class="text-lg font-bold">Are you sure you want to delete this timesheet?</h3>
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

{#if $showNewRow}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<!-- Modal Content -->
		<div
			class="max-h-screen w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-lg md:max-w-lg lg:max-w-xl dark:bg-gray-900"
		>
			<div class="space-y-4">
				<div>
					<label for="project" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Project
					</label>
					<div class="relative">
						<Select
							bind:value={$newTimesheet.project}
							id="project"
							items={$projects}
							placeholder="Select Project"
							class="mt-1 w-full max-w-full"
							on:select={(event) => ($newTimesheet.project = event.detail.value)}
						/>
					</div>
				</div>
				<!-- Date Field -->
				<div>
					<label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Date</label
					>
					<input
						type="date"
						bind:value={$newTimesheet.date}
						class="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
					/>
					{#if $errorDate}
						<div class="mt-2 text-sm text-red-500">{$errorDate}</div>
					{/if}
				</div>
				<!-- Jira No Field -->
				<div>
					<label for="jiraNo" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Jira No</label
					>
					<input
						type="text"
						bind:value={$newTimesheet.jiraNo}
						class="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Jira No"
					/>
					{#if $errorJiraNo}
						<div class="mt-2 text-sm text-red-500">{$errorJiraNo}</div>
					{/if}
				</div>
				<!-- Task Updates Field -->
				<div>
					<label
						for="taskUpdates"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Updates</label
					>
					<textarea
						bind:value={$newTimesheet.taskUpdates}
						id="taskUpdates"
						class="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Enter task updates"
						rows="2"
					></textarea>
					{#if $errorTaskUpdates}
						<div class="mt-2 text-sm text-red-500">{$errorTaskUpdates}</div>
					{/if}
				</div>
				<div>
					<label for="workType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Work Type
					</label>
					<div class="relative">
						<Select
							bind:value={$newTimesheet.workType}
							id="workType"
							items={$workTypes}
							placeholder="Select Work Type"
							class="mt-1 w-full max-w-full"
							on:select={(event) => ($newTimesheet.workType = event.detail.value)}
						/>
					</div>
				</div>
				<div>
					<label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Status
					</label>
					<div class="relative">
						<Select
							bind:value={$newTimesheet.status}
							id="status"
							items={$status}
							placeholder="Select Status"
							class="mt-1 w-full max-w-full"
							on:select={(event) => ($newTimesheet.status = event.detail.value)}
						/>
					</div>
				</div>

				<!-- Name Field -->
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Your Name</label
					>
					<input
						type="text"
						bind:value={$newTimesheet.name}
						class="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Your name"
					/>
					{#if $errorName}
						<div class="mt-2 text-sm text-red-500">{$errorName}</div>
					{/if}
				</div>

				<!-- Hours Field -->
				<div>
					<label for="hours" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Hours</label
					>
					<input
						type="text"
						bind:value={$newTimesheet.hours}
						class="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						placeholder="Hours"
					/>
					{#if $errorHours}
						<div class="mt-2 text-sm text-red-500">{$errorHours}</div>
					{/if}
				</div>
				<div class="flex space-x-3">
					<button
						on:click={cancelTimesheetForm}
						class="w-full rounded-lg bg-gray-500 px-4 py-2 text-white shadow-md transition-all hover:bg-gray-600 focus:ring focus:ring-gray-300 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-800"
					>
						Cancel
					</button>
					<button
						on:click={saveTimesheet}
						class="w-full rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-all hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
						>{#if $editingTimesheetId}
							Update
						{:else}
							Save{/if}</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="mb-6 flex w-full items-center justify-between gap-4">
	<h2 class="w-full text-2xl font-semibold text-gray-800 sm:w-auto dark:text-gray-100">
		Timesheet Tracker
	</h2>
	<button
		on:click={addNewRow}
		class="flex items-center justify-between gap-2 rounded-md bg-blue-500 p-2 font-bold text-white"
	>
		<Plus size={20} />
		<span class="hidden sm:block">Add Timesheet</span>
	</button>
</div>

<div class="mb-6 flex w-full flex-wrap items-center justify-between gap-4">
	<div class="w-full sm:w-1/2 md:w-1/3">
		<label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>Start Date</label
		>
		<input
			id="startDate"
			type="date"
			bind:value={$startDate}
			class="focus:ring-0.5 w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
		/>
	</div>
	<div class="w-full sm:w-1/2 md:w-1/3">
		<label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>End Date</label
		>
		<input
			id="endDate"
			type="date"
			bind:value={$endDate}
			class="focus:ring-0.5 w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
		/>
	</div>
	<div class="w-full sm:w-1/2 md:w-1/3">
		<label for="searchJiraNo" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>Search Jira No</label
		>
		<input
			id="searchJiraNo"
			type="text"
			bind:value={$searchJiraNo}
			class="focus:ring-0.5 w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
			placeholder="Enter Jira No"
		/>
	</div>
</div>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
	{#each $filteredTimesheets as timesheet}
		<div
			class="flex flex-col space-y-4 rounded-lg bg-gray-50 p-4 shadow-md sm:h-auto sm:text-sm dark:bg-gray-800"
			in:fade
			out:fly={{ y: -10, duration: 200 }}
		>
			<div class="flex items-center justify-between text-lg font-semibold">
				{timesheet.project.label}
				<div class="flex gap-2">
					<button
						on:click={() => editTimesheet(timesheet)}
						class="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none"
					>
						<Edit size={16} />
					</button>
					<button
						on:click={() => confirmDelete(timesheet.id)}
						class="rounded-full bg-red-500 p-2 text-white hover:bg-red-600 focus:outline-none"
					>
						<Trash size={16} />
					</button>
				</div>
			</div>
			<div>Date: {timesheet.date}</div>
			<div>Jira No: {timesheet.jiraNo}</div>
			<div>Status: {timesheet.status.label}</div>
			<div>Task Updates: {timesheet.taskUpdates}</div>
			<div>Work Type: {timesheet.workType.label}</div>
			<div>Hours: {timesheet.hours}</div>
		</div>
	{/each}
</div>
