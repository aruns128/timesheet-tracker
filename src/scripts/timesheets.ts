import { writable } from 'svelte/store';

export type Timesheet = {
	id: string;
	project: { label: string; value: string; id: string };
	date: string;
	jiraNo: string;
	taskUpdates: string;
	workType: { label: string; value: string; id: string };
	status: { label: string; value: string; id: string };
	name: string;
	hours: string;
};

export const timesheets = writable<Timesheet[]>([]);

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTimesheets = async () => {
	const res = await fetch(`${API_URL}/timesheets`);
	timesheets.set(await res.json());
};

export const addTimesheet = async (newTimesheet: Timesheet) => {
	// Ensure hours are within the allowed range
	if (+newTimesheet.hours < 0 || +newTimesheet.hours > 8) {
		alert('Hours must be between 0 and 8');
		return;
	}

	// Send the new timesheet to the backend
	await fetch(`${API_URL}/timesheets`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(newTimesheet) // Send newTimesheet, not formData
	});

	// Refresh the timesheets list
	fetchTimesheets();
};

export const deleteTimesheet = async (id: string) => {
	// Send DELETE request to remove the timesheet
	await fetch(`${API_URL}/timesheets/${id}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' }
	});

	// Refresh the timesheets list
	fetchTimesheets();
};

// ✅ New update functionality
export const updateTimesheet = async (id: string, updatedTimesheet: Timesheet) => {
	if (+updatedTimesheet.hours < 0 || +updatedTimesheet.hours > 8) {
		alert('Hours must be between 0 and 8');
		return;
	}

	await fetch(`${API_URL}/timesheets/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updatedTimesheet)
	});

	fetchTimesheets();
};
