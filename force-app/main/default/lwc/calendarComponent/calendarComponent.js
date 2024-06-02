// calendarComponent.js
// import { CurrentPageReference } from 'lightning/navigation';
// import { LightningElement, track,wire  } from 'lwc';
// import bulkCreateDates from '@salesforce/apex/PopulateCalendarBatch.executeFunction';
// import updateOrCreateDates from '@salesforce/apex/CalendarController.updateOrCreateDates';


// export default class CalendarComponent extends LightningElement
// {
//         @wire(CurrentPageReference) pageRef;
//   @track selectedDay;
//     @track selectedMonth;
//     @track selectedYear;
//     @track createdDates = [];
//     @track isPublicHoliday = false;

//     // Options for day, month, and year picklists
//     dayOptions = [];
//     monthOptions = [];
//     yearOptions = [];

//     // Initialize options for day, month, and year picklists
//     connectedCallback() {
//         this.initializeOptions();
//     }

//     initializeOptions() {
//         // Initialize day options
//         for (let i = 1; i <= 31; i++) {
//             this.dayOptions.push({ label: String(i), value: String(i) });
//         }

//         // Initialize month options
//         for (let i = 1; i <= 12; i++) {
//             this.monthOptions.push({ label: String(i), value: String(i) });
//         }

//         // Initialize year options
//         for (let i = 2024; i <= 2060; i++) {
//             this.yearOptions.push({ label: String(i), value: String(i) });
//         }
//     }

//     // Methods to handle picklist change events
//     handleDayChange(event) {
//         this.selectedDay = event.target.value;
//     }

//     handleMonthChange(event) {
//         this.selectedMonth = event.target.value;
//     }

//     handleYearChange(event) {
//         this.selectedYear = event.target.value;
//     }
//       handleBulkCreate() {
//         bulkCreateDates()
//             .then(result => {
//                 // Handle success
//                 console.log('Batch process initiated successfully');
//                 // Optionally, perform any additional actions here
//             })
//             .catch(error => {
//                 // Handle error
//                 console.error('Error occurred while initiating batch process:', error);
//             });
//     }


//     // Button handler to create a date
// handleCreate() {
//     // Get selected day, month, and year from input fields
//     const selectedDay = parseInt(this.selectedDay, 10);
//     const selectedMonth = parseInt(this.selectedMonth, 10);
//     const selectedYear = parseInt(this.selectedYear, 10);

//     // Add created date with holiday status based on checkbox and description
//     this.createdDates.push({
//         id: this.createdDates.length + 1,
//         day: selectedDay,
//         month: selectedMonth,
//         year: selectedYear,
//         isPublicHoliday: this.isPublicHoliday, // Use the current state of isPublicHoliday
//         description: this.description, // Include the description
//         isSelected: false
//     });

//     // Log the content of the table to the console
//     console.log('Content of the table:', JSON.stringify(this.createdDates, null, 2));

//     // Clear the description field after adding the date
//     this.description = '';
// }
//     // Method to handle row selection
//     handleRowSelection(event) {
//         const selectedId = parseInt(event.target.dataset.id, 10);
//         const updatedDates = this.createdDates.map(date => {
//             if (date.id === selectedId) {
//                 date.isSelected = event.target.checked;
//             }
//             return date;
//         });
//         this.createdDates = [...updatedDates];
//     }

//     // Method to handle delete button click
//     handleDelete() {
//         this.createdDates = this.createdDates.filter( date => !date.isSelected );
     
//     }


//     // Placeholder methods for save and cancel buttons (you'll need to implement logic specific to your use case)
//     handleSave ()
//     {
//         // Convert the created dates to JSON string
//         const datesJson = JSON.stringify( this.createdDates.map( date => ( {
//             day: date.day,
//             month: date.month,
//             year: date.year,
//             isPublicHoliday: date.isPublicHoliday,
//             description: date.description
//         } ) ) );

//         // Call the Apex method to update or create records
//         updateOrCreateDates( { datesJson } )
//             .then( result =>
//             {
//                 // Handle success
//                 console.log( 'Dates saved successfully:', result );
//                    this.createdDates = [];
//                 // Optionally, perform any additional actions here
//             } )
            
//             .catch( error =>
//             {
//                 // Handle error
//                 console.error( 'Error occurred while saving dates:', error );
//             } );

//     }
//     handleCancel() {
//         // Add logic for canceling the creation process (e.g., reset component state)
//     }

//     // Getter to compute dynamic class name for each row
//     get rowClass() {
//     return this.createdDates.map(date => date.isSelected ? 'selected-row' : '').join(' ');
// }

//     // Computed property to display holiday status in template
//     get computedDates() {
//         return this.createdDates.map(date => {
//             return {
//                 ...date,
//                 holidayStatus: date.isPublicHoliday ? 'Yes' : 'No'
//             };
//         });
//     }

//     // Method to handle public holiday checkbox change
//     handlePublicHolidayChange(event) {
//         this.isPublicHoliday = event.target.checked;
//     }
//           handleDescriptionChange(event) {
//         this.description = event.target.value;
//     }
// }
import { LightningElement, track } from 'lwc';
import updateOrCreateDates from '@salesforce/apex/CalendarController.updateOrCreateDates';

export default class CalendarComponent extends LightningElement {
    @track selectedDay = '1';
    @track selectedMonth = '1'; // Default to January
    @track selectedYear = '2024';
    @track isPublicHoliday = false;
    @track description = '';

    // Options for day, month, and year picklists
    dayOptions = [];
    monthOptions = [];
    yearOptions = [];

    // Initialize options for day, month, and year picklists
    connectedCallback() {
        this.initializeOptions();
    }

    initializeOptions() {
        // Initialize day options
        for (let i = 1; i <= 31; i++) {
            this.dayOptions.push({ label: String(i), value: String(i) });
        }

        // Initialize month options
        const months = [
            { label: 'January', value: '1' },
            { label: 'February', value: '2' },
            { label: 'March', value: '3' },
            { label: 'April', value: '4' },
            { label: 'May', value: '5' },
            { label: 'June', value: '6' },
            { label: 'July', value: '7' },
            { label: 'August', value: '8' },
            { label: 'September', value: '9' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' }
        ];
        this.monthOptions = months;

        // Initialize year options
        for (let i = 2024; i <= 2060; i++) {
            this.yearOptions.push({ label: String(i), value: String(i) });
        }
    }

    // Methods to handle picklist change events
    handleDayChange(event) {
        this.selectedDay = event.target.value;
    }

    handleMonthChange(event) {
        this.selectedMonth = event.target.value;
    }

    handleYearChange(event) {
        this.selectedYear = event.target.value;
    }

    // Method to handle public holiday checkbox change
    handlePublicHolidayChange(event) {
        this.isPublicHoliday = event.target.checked;
    }

    // Method to handle description change
    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    // Method to handle save button click
    handleSave() {
        updateOrCreateDates({
            day: parseInt(this.selectedDay),
            month: parseInt(this.selectedMonth),
            year: parseInt(this.selectedYear),
            isPublicHoliday: this.isPublicHoliday,
            description: this.description
        })
        .then(result => {
            // Handle success
            console.log('Dates saved successfullyyyyy:', result);
            // Optionally, perform any additional actions here
            window.location.reload();
        })
        .catch(error => {
            // Handle error
            console.error('Error occurred while saving dates:', error);
        });
    }

    handleCancel() {
        // Navigate back to the previous page
        window.history.back();
    }
}