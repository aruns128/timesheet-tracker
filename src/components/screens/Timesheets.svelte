<script lang="ts">
  import {addTimesheet, timesheets, fetchTimesheets, deleteTimesheet } from '../../scripts/timesheets';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { CircleX, Trash, EditIcon, SaveIcon } from 'lucide-svelte';

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
  });

  // Preload existing timesheets
  onMount(fetchTimesheets);

  function addNewRow() {
    showNewRow.set(true);
  }

  // Pass the updated timesheet when saving
  function saveTimesheet() {
    // Unwrap the writable store to get the current value
    const timesheetData = $newTimesheet;
    addTimesheet(timesheetData);  // Pass the current timesheet data
    showNewRow.set(false);  // Hide the input row after saving
  }

  function cancelNewRow() {
    showNewRow.set(false);  // Cancel adding a new row
  }

  function confirmDelete(id: string) {
    deleteTimesheetId.set(id); // Store the id of the timesheet to delete
    showConfirmDelete.set(true); // Show the confirmation dialog
  }

  function cancelDelete() {
    showConfirmDelete.set(false); // Close the confirmation dialog without deleting
  }

  function proceedDelete() {
    const id = $deleteTimesheetId;
    deleteTimesheet(id); // Proceed with deletion
    showConfirmDelete.set(false); // Close the confirmation dialog after delete
  }

</script>

{#if $showConfirmDelete}
  <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h3 class="text-lg font-bold">Are you sure you want to delete this timesheet?</h3>
      <div class="mt-4 flex justify-end space-x-4">
        <button on:click={proceedDelete} class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
        <button on:click={cancelDelete} class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  </div>
{/if}

<div class="flex items-center justify-between mt-4">
  <h2 class="text-xl font-bold mb-4">Timesheet Tracker</h2>
  <button 
    on:click={addNewRow} 
    class="px-4 py-2 rounded shadow-md  text-white" 
    class:bg-green-500={!$showNewRow} 
    class:bg-gray-400={$showNewRow}
    disabled={$showNewRow}
  >
    Add Timesheet
  </button>
</div>



<div class="p-6 bg-white shadow rounded-lg relative overflow-hidden">
  <div class="mt-6">
    <h3 class="text-lg font-bold mb-4">Existing Timesheets</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse table-auto">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-3 text-left text-sm font-medium text-gray-700">Project</th>
            <th class="border p-3 text-left text-sm font-medium text-gray-700">Date</th>
            <th class="border p-3 text-left text-sm font-medium text-gray-700">Jira No</th>
            <th class="border p-3 text-left text-sm font-medium text-gray-700">Task Updates</th>
            <th class="border p-3 text-left text-sm font-medium text-gray-700">Work Type</th>
            <th class="border p-3 text-left text-sm font-medium text-gray-700">Status</th>
            <th class="border p-3 text-left text-sm font-medium text-gray-700">Name</th>
            <th class="border p-3 text-left text-sm font-medium text-gray-700">Hours</th>
            <th class="border p-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each $timesheets as timesheet}
            <tr class="border-b hover:bg-gray-50">
              <td class="border p-3 text-sm">{timesheet.project}</td>
              <td class="border p-3 text-sm">{timesheet.date}</td>
              <td class="border p-3 text-sm">{timesheet.jiraNo}</td>
              <td class="border p-3 text-sm">{timesheet.taskUpdates}</td>
              <td class="border p-3 text-sm">{timesheet.workType}</td>
              <td class="border p-3 text-sm">{timesheet.status}</td>
              <td class="border p-3 text-sm">{timesheet.name}</td>
              <td class="border p-3 text-sm">{timesheet.hours}</td>
              <td class="border p-3 text-sm">
                <button class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 focus:outline-none"><EditIcon size={20}/></button>
                <button 
                  on:click={() => confirmDelete(timesheet.id)} 
                  class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 focus:outline-none">
                  <Trash size={20} />
                </button>
              </td>
            </tr>
          {/each}

          {#if $showNewRow}
            <tr class="border-b hover:bg-gray-50">
              <td class="border p-3">
                <select bind:value={$newTimesheet.project} class="w-full p-2 border rounded">
                  <option value="">Select Project</option>
                  <option value="Website Redesign">Website Redesign</option>
                  <option value="Mobile App Update">Mobile App Update</option>
                </select>
              </td>
              <td class="border p-3">
                <input type="date" bind:value={$newTimesheet.date} class="w-full p-2 border rounded" />
              </td>
              <td class="border p-3">
                <input type="text" bind:value={$newTimesheet.jiraNo} class="w-full p-2 border rounded" placeholder="Jira No" />
              </td>
              <td class="border p-3">
                <textarea bind:value={$newTimesheet.taskUpdates} class="w-full p-2 border rounded" placeholder="Task Updates"></textarea>
              </td>
              <td class="border p-3">
                <select bind:value={$newTimesheet.workType} class="w-full p-2 border rounded">
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                </select>
              </td>
              <td class="border p-3">
                <select bind:value={$newTimesheet.status} class="w-full p-2 border rounded">
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </td>
              <td class="border p-3">
                <input type="text" bind:value={$newTimesheet.name} class="w-full p-2 border rounded" placeholder="Name" />
              </td>
              <td class="border p-3">
                <input type="text" bind:value={$newTimesheet.hours} min="0" max="8" class="w-full p-2 border rounded" placeholder="Hours" />
              </td>
              <td class="border p-3">
                <button on:click={saveTimesheet} class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"><SaveIcon size={20}/></button>
                <button on:click={cancelNewRow} class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"><CircleX size={20}/></button>
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  /* Optional: Styling for table and scrollable area */
  .overflow-x-auto {
    max-height: 500px;  /* Set a fixed height for scrolling */
    overflow-y: auto;
  }

  .table-auto {
    width: 100%;
    border-spacing: 0;
    table-layout: fixed;
  }

  .border {
    border: 1px solid #ddd;
  }

  .p-3 {
    padding: 0.75rem;
  }

  .rounded {
    border-radius: 8px;
  }

  .text-left {
    text-align: left;
  }

  .hover\:bg-gray-50:hover {
    background-color: #f3f4f6;
  }

  .focus\:outline-none:focus {
    outline: none;
  }
</style>
