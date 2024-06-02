import { LightningElement, track } from 'lwc';

export default class globalCalendarRessource extends LightningElement {
    @track calendarData = {}; // Store timesheet data for each day

    // Method to receive submitted timesheet data
    handleTimesheetSubmission(event) {
        const timesheetData = event.detail;
        // Update calendarData with the submitted timesheet data
    }
}