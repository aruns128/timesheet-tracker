import { writable, type Writable } from 'svelte/store';

export function validateField(value: string, fieldName: string, errorStore: Writable<string>, isSubmitted: boolean) {
    if (isSubmitted && !value.trim()) {
        errorStore.set(`${fieldName} is required`);
    } else {
        errorStore.set('');
    }
}
