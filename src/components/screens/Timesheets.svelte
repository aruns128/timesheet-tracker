<script lang="ts">
	import {
		addTimesheet,
		timesheets,
		fetchTimesheets,
		deleteTimesheet,

		updateTimesheet

	} from '../../scripts/timesheets';
	import { writable, derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import { Trash, Edit, Plus, XCircle } from 'lucide-svelte';
  import { v4 as uuidv4 } from 'uuid';

	let showNewRow = writable(false);
	let showConfirmDelete = writable(false);
	let deleteTimesheetId = writable('');
	let newTimesheet = writable({
		project: '',
		date: '',
		jiraNo: '',
		taskUpdates: '',
		workType: 'Development',
		status: 'Completed',
		name: '',
		hours: '',
    	id:uuidv4()
	});

	let startDate = writable('');
	let endDate = writable('');
	let searchJiraNo = writable('');

	onMount(() => {
		const today = new Date();
		endDate.set(today.toISOString().split('T')[0]);

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(today.getDate() - 7);
		startDate.set(sevenDaysAgo.toISOString().split('T')[0]);

		fetchTimesheets();
	});

	let editingTimesheetId = writable(null);

	function editTimesheet(timesheet: any) {
		newTimesheet.set({ ...timesheet });
		editingTimesheetId.set(timesheet.id); // Store the ID of the timesheet being edited
		showNewRow.set(true);
	}

	function addNewRow() {
		newTimesheet.set({
			project: '',
			date: '',
			jiraNo: '',
			taskUpdates: '',
			workType: 'Development',
			status: 'Completed',
			name: '',
			hours: '',
			id: uuidv4()
		});
		showNewRow.set(true);
	}

	function saveTimesheet() {
		const timesheetData = $newTimesheet;

		if ($editingTimesheetId) {
			updateTimesheet($editingTimesheetId, timesheetData); 
			editingTimesheetId.set(null); 
		} else {
			addTimesheet(timesheetData);
		}

		showNewRow.set(false);
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
</script>

{#if $showConfirmDelete}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
		<div class="w-96 rounded bg-white p-6 shadow-lg sm:w-80">
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
	<!-- Modal for creating a new timesheet -->
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
		<div
			class="max-h-screen w-full overflow-y-auto rounded bg-slate-100 m-2 p-6 shadow-lg sm:w-96 lg:w-1/2 xl:w-1/3"
		>
			<div class="space-y-4">
				<div>
					<label for="project" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Project</label
					>
					<input
						type="text"
						bind:value={$newTimesheet.project}
						class="focus:ring-0.5 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
						placeholder="Enter project"
					/>
				</div>
				<div>
					<label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Date</label
					>
					<input
						type="date"
						bind:value={$newTimesheet.date}
						class="focus:ring-0.5 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
					/>
				</div>
				<div>
					<label for="jiraNo" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Jira No</label
					>
					<input
						type="text"
						bind:value={$newTimesheet.jiraNo}
						class="focus:ring-0.5 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
						placeholder="Jira No"
					/>
				</div>
				<div>
					<label
						for="taskUpdates"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Updates</label
					>
					<input
						type="text"
						bind:value={$newTimesheet.taskUpdates}
						class="focus:ring-0.5 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
						placeholder="Task updates"
					/>
				</div>
				<div>
					<label for="workType" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Work Type</label
					>
					<select
						bind:value={$newTimesheet.workType}
						class="focus:ring-0.5 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
					>
						<option value="Development">Development</option>
						<option value="Testing">Testing</option>
					</select>
				</div>
				<div>
					<label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Status</label
					>
					<select
						bind:value={$newTimesheet.status}
						class="focus:ring-0.5 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
					>
						<option value="Completed">Completed</option>
						<option value="In Progress">In Progress</option>
					</select>
				</div>
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Your Name</label
					>
					<input
						type="text"
						bind:value={$newTimesheet.name}
						class="focus:ring-0.5 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
						placeholder="Your name"
					/>
				</div>
				<div>
					<label for="hours" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Hours</label
					>
					<input
						type="text"
						bind:value={$newTimesheet.hours}
						class="focus:ring-0.5 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500"
						placeholder="Hours"
					/>
				</div>
				<div class="flex space-x-3">
					<button
						on:click={saveTimesheet}
						class="w-1/2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
						>{#if $editingTimesheetId} Update {:else} Save{/if}</button
					>
					<button
              on:click={() => {
                showNewRow.set(false);
                editingTimesheetId.set(null); // Reset editing state when canceling
            }}
						class="w-1/2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
						>Cancel</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="mb-6 flex items-center justify-between">
	<h2 class="w-full text-2xl font-semibold text-gray-800 sm:w-auto dark:text-gray-100">
		Timesheet Tracker
	</h2>
	<button
		on:click={addNewRow}
		class="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-5 py-2 text-white shadow-md hover:shadow-lg"
		class:bg-green-500={!$showNewRow}
		class:bg-gray-400={$showNewRow}
		disabled={$showNewRow}
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
		>
			<div class="flex items-center justify-between text-lg font-semibold">
				{timesheet.project}
				<div class="flex justify-end space-x-2">
					<button  on:click={() => editTimesheet(timesheet)} class="text-blue-500 hover:text-blue-700">
						<Edit size={20} />
					</button>
					<button
						on:click={() => confirmDelete(timesheet.id)}
						class="text-red-500 hover:text-red-700"
					>
						<Trash size={20} />
					</button>
				</div>
			</div>
			<div>Date: {timesheet.date}</div>
			<div>Jira No: {timesheet.jiraNo}</div>
			<div>Status: {timesheet.status}</div>
			<div>Task Updates: {timesheet.taskUpdates}</div>
			<div>Work Type: {timesheet.workType}</div>
			<div>Hours: {timesheet.hours}</div>
		</div>
	{/each}
</div>
