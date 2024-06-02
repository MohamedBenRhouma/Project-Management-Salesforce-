import { LightningElement, track, wire } from 'lwc';
import getCalendarData from '@salesforce/apex/CalendarController.getCalendarData';
import deleteCalendarData from '@salesforce/apex/CalendarController.deleteCalendarData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class MassDeleteComponent extends LightningElement {
    @track monthOptions = [];
    @track yearOptions = [];
    @track calendarData = [];
    @track columns = [
        { label: 'Day', fieldName: 'Day__c', type: 'text'},
        { label: 'Month', fieldName: 'Months__c', type: 'text' },
        { label: 'Year', fieldName: 'Year__c', type: 'text' },
        { label: 'Holiday', fieldName: 'Holiday', type: 'text' },
        { label: 'Description', fieldName: 'Description__c', type: 'text' }
    ];
    @track selectedRows = [];
    wiredCalendarDataResult;

    selectedMonth;
    selectedYear;

    connectedCallback() {
        this.initializeOptions();
    }

    initializeOptions() {
        this.monthOptions = [
            { label: 'Jan', value: '1' },
            { label: 'Feb', value: '2' },
            { label: 'Mar', value: '3' },
            { label: 'Apr', value: '4' },
            { label: 'May', value: '5' },
            { label: 'Jun', value: '6' },
            { label: 'Jul', value: '7' },
            { label: 'Aug', value: '8' },
            { label: 'Sep', value: '9' },
            { label: 'Oct', value: '10' },
            { label: 'Nov', value: '11' },
            { label: 'Dec', value: '12' }
        ];
        this.selectedMonth = String(new Date().getMonth() + 1);

        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            this.yearOptions.push({ label: String(i), value: String(i) });
        }
        this.selectedYear = String(currentYear);
    }

@wire(getCalendarData, { month: '$selectedMonth', year: '$selectedYear' })
wiredGetCalendarData(result) {
    this.wiredCalendarDataResult = result;
    if (result.data) {
        console.log('Calendar Data:', result.data);
        this.calendarData = result.data.map(item => {
            console.log('Public Holiday Value:', item.public_holiday__c);
            return {
                ...item,
                Holiday: item.public_holiday__c ? 'Yes' : 'No' // Adjusted mapping
            };
        });
    } else if (result.error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error fetching calendar data',
                message: result.error.body.message,
                variant: 'error'
            })
        );
    }
}


    handleMonthChange(event) {
        this.selectedMonth = event.detail.value;
    }

    handleYearChange(event) {
        this.selectedYear = event.detail.value;
    }

    handleRowSelection(event) {
        this.selectedRows = event.detail.selectedRows.map(row => row.Id);
    }

    handleDelete() {
        if (this.selectedRows.length === 0) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select at least one row to delete.',
                    variant: 'error'
                })
            );
            return;
        }

        deleteCalendarData({ recordIds: this.selectedRows })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Selected records have been deleted.',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredCalendarDataResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting records',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    handleCancel() {
    // Navigate back to the previous page
    window.history.back();
}
}