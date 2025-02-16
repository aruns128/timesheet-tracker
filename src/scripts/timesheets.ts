import { writable, type Writable } from 'svelte/store';

interface Timesheet {
    id:string
    project: string;
    date: string;
    jiraNo: string;
    taskUpdates: string;
    workType: string;
    status: string;
    name: string;
    hours: string;
  }
  
  export const timesheets = writable<Timesheet[]>([]);


export const fetchTimesheets = async () => {
  const res = await fetch('http://localhost:5000/timesheets');
  timesheets.set(await res.json());
};

export const addTimesheet = async (newTimesheet: any) => {
    // Ensure hours are within the allowed range
    if (+newTimesheet.hours < 0 || +newTimesheet.hours > 8) {
      alert('Hours must be between 0 and 8');
      return;
    }
  
    // Send the new timesheet to the backend
    await fetch('http://localhost:5000/timesheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTimesheet), // Send newTimesheet, not formData
    });
  
    // Refresh the timesheets list
    fetchTimesheets();
  };
  

  export const deleteTimesheet = async (id: string) => {
    // Send DELETE request to remove the timesheet
    await fetch(`http://localhost:5000/timesheets/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  
    // Refresh the timesheets list
    fetchTimesheets();
  };
  