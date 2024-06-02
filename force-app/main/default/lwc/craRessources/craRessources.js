import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import getInfo from '@salesforce/apex/fetchInformation.getInfo';
import fetchHolidays from '@salesforce/apex/fetchInformation.fetchHolidays';
import submitTimesheet from'@salesforce/apex/fetchInformation.submitTimesheet'
import fetchEmployeeData from '@salesforce/apex/fetchInformation.fetchEmployeeData';
import { refreshApex } from '@salesforce/apex';
export default class CraRessources extends LightningElement
{
    @wire( CurrentPageReference ) pageRef;
    @track fullInformation = '';
    @track employeeName;
    @track projectName;
    @track lotName;
    @track startDate;
    @track endDate;
    @track selectedType;
    projectName2; 
    projectColumnName = 'Project Name';
    timesheetData = [];
    projectId;
    otherPicklistValue
    resourceId;
    timesheetDates = [];
    timesheetHeaders = [];
    isDatePickerSelected = false;
    showTable = true; // Flag to control table visibility

    // Define options for the picklist
   typeOptions = [
        { label: 'None', value: 'None' }, // Add "None" option
        { label: 'Formation', value: 'Formation' },
        { label: 'Intercontract', value: 'Intercontract' },
        { label: 'Pre-sales', value: 'Pre-sales' }
    ];


    connectedCallback ()
    {
        this.fetchTimesheetData(); // Call fetchTimesheetData first
    }

    @wire( fetchHolidays )
    holidays;

   
       fetchTimesheetData() {
        getInfo()
            .then( result => {
                if ( result ) {
                    // Extract project ID and resource ID
                    this.projectId = result.projectId;
                    this.resourceId = result.resourceId;

                    if ( result.projectName ) {
                        // User has a project, set project-related fields
                        this.employeeName = result.resourceName;
                        this.projectName = result.projectName;

                        this.lotName = result.lotName;
                        this.startDate = result.startDate;
                        this.endDate = result.endDate;
                        this.projectName2 = result.projectName;
                        this.timesheetData = result.timesheetData;


                        this.fullInformation = `${ this.employeeName } - ${ this.projectName }`;
                        this.hasProject = true;
                        this.showTable = true; // Show table if the resource has a project
                        // Set selectedType to "None" by default when the user has a project
                        this.selectedType = 'None';
                    } else {
                        // User doesn't have a project, fetch employee name
                        this.fetchEmployeeName();
                        this.projectColumnName = 'Other';
                        this.hasProject = false;
                    }
                } else {
                    this.showToast( 'Error', 'Failed to fetch timesheet data', 'error' );
                }
            } )
            .catch( error => {
                console.error( 'Error fetching timesheet data', error );
                this.showToast( 'Error', 'An error occurred while fetching timesheet data', 'error' );
            } );
    }
    fetchEmployeeName ()
    {
        fetchEmployeeData()
            .then( result =>
            {
                if ( result )
                {
                    // Set employee name and any other necessary fields
                    this.employeeName = result.resourceName;
                    this.fullInformation = `${ this.employeeName }`;
                    // You may need to set other fields accordingly
                    console.log( this.employeeName ); // Log employee name
                } else
                {
                    this.showToast( 'Error', 'Failed to fetch employee data', 'error' );
                }
            } )
            .catch( error =>
            {
                console.error( 'Error fetching employee data', error );
                this.showToast( 'Error', 'An error occurred while fetching employee data', 'error' );
            } );
    }

    handleStartDateChange ( event )
    {
        const selectedDate = new Date( event.detail.value );
        selectedDate.setHours( 0, 0, 0, 0 ); // Set time components to 0

        const startDateObj = new Date( this.startDate );
        startDateObj.setHours( 0, 0, 0, 0 ); // Set time components to 0

        const endDateObj = new Date( this.endDate );
        endDateObj.setHours( 0, 0, 0, 0 ); // Set time components to 0

        this.isDatePickerSelected = true;

       
        if ( this.holidays && this.holidays.data )
        {
            // Check if selected date is a holiday
            const isHoliday = this.holidays.data.some( holiday =>
            {
                const holidayDay = parseInt( holiday.Day__c, 10 );
                const holidayMonth = parseInt( holiday.Months__c, 10 ); // Adjust month index
                const holidayYear = parseInt( holiday.Year__c, 10 );

                const holidayDate = new Date( holidayYear, holidayMonth - 1, holidayDay );
                holidayDate.setHours( 0, 0, 0, 0 ); // Set time components to 0

                return holidayDate.getTime() === selectedDate.getTime();
            } );

            if ( isHoliday )
            {
                this.showToast( 'Holiday', 'This is a holiday.', 'info' );
                this.showTable = false; // Hide table if it's a holiday
            } else
            {
                // Proceed with existing logic...
                const dayOfWeek = selectedDate.getDay(); // 0 for Sunday, 6 for Saturday
                if ( dayOfWeek === 0 || dayOfWeek === 6 )
                {
                    // Disable input fields for Saturday and Sunday
                    this.showToast( 'Weekend', 'Weekend days are disabled.', 'info' );
                    this.showTable = false; // Hide table if it's a weekend
                } else
                {
                    // Proceed with existing logic
                    this.selectedDate = event.detail.value;
                    this.calculateTimesheetDates( this.selectedDate ); // Pass the selected date
                    this.calculateTimesheetHeaders( this.selectedDate ); // Update timesheetHeaders array
                    this.showTable = true; // Show table for other days
                }
            }
        } else
        {
            // Holidays data not available yet, you can add a loading indicator or handle it accordingly
            console.log( 'Holidays data not available yet' );
        }

        // Additional validation for start date
        if ( selectedDate < startDateObj )
        {
            this.showToast( 'Error', 'Please select a date greater than or equal to the start date', 'error' );
            this.showTable = false; // Hide table if start date is invalid
        } else if ( selectedDate > endDateObj )
        {
            this.showToast( 'Error', 'Please select a date less than or equal to the end date', 'error' );
            this.showTable = false; // Hide table if end date is invalid
        }
    }

    isWeekendOrHoliday ( dayName, formattedDate )
    {
        // Check if it's Saturday or Sunday (weekend)
        if ( dayName === 'Saturday' || dayName === 'Sunday' )
        {
            return true;
        }

        // Check if it's a holiday
        if ( this.holidays && this.holidays.data )
        {
            return this.holidays.data.some( holiday =>
            {
                // Compare the holiday date with the current day's date
                return holiday.Day__c === formattedDate;
            } );
        }

        return false;
    }

    calculateTimesheetDates ( selectedDate )
    {
        console.log( 'Calculating Timesheet Dates' ); // Check if this method is being called
        this.timesheetDates = [];
        const start = new Date( selectedDate ); // Use the selectedDate parameter
        for ( let i = 0; i < 7; i++ )
        {
            const date = new Date( start );
            date.setDate( start.getDate() + i );
            this.timesheetDates.push( date );
        }
    }

    // calculateTimesheetHeaders ()
    // {
    //     console.log( 'Calculating Timesheet Headers', this.timesheetDates ); // Check if this method is being called and the timesheetDates array
    //     const daysOfWeek = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    //     const startDayIndex = this.timesheetDates[ 0 ].getDay();
    //     this.timesheetHeaders = this.timesheetDates.map( ( date, index ) =>
    //     {
    //         const dayIndex = ( startDayIndex + index ) % 7; // Get the correct index based on the start date
    //         const dayName = daysOfWeek[ dayIndex ];
    //         const formattedDate = date.toLocaleDateString();
    //         const isWeekendOrHoliday = this.isWeekendOrHoliday( dayName, formattedDate );
    //         const cellClass = isWeekendOrHoliday ? 'grey-column' : false;

    //         return {
    //             dayName: daysOfWeek[ dayIndex ],
    //             formattedDate: date.toLocaleDateString(),
    //             isWeekendOrHoliday: isWeekendOrHoliday,
    //             cellClass: cellClass
    //         };
    //     } );
    //     console.log( 'Timesheet Headers:', this.timesheetHeaders ); // Log the timesheetHeaders array
    // }
//     calculateTimesheetHeaders() {
//     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const start = new Date(this.startDate);
//     const end = new Date(this.endDate);
//     const duration = (end - start) / (1000 * 60 * 60 * 24); // Duration in days

//     // Clear previous headers
//     this.timesheetHeaders = [];

//     for (let i = 0; i <= duration; i++) {
//         const currentDate = new Date(start);
//         currentDate.setDate(start.getDate() + i);
//         const dayIndex = currentDate.getDay(); // Get the day index (0 for Sunday, 1 for Monday, ...)
//         const dayName = daysOfWeek[dayIndex];
//         const formattedDate = currentDate.toLocaleDateString();
//         const isWeekendOrHoliday = this.isWeekendOrHoliday(dayName, formattedDate);
//         const cellClass = isWeekendOrHoliday ? 'grey-column' : '';

//         this.timesheetHeaders.push({
//             dayName: dayName,
//             formattedDate: formattedDate,
//             isWeekendOrHoliday: isWeekendOrHoliday,
//             cellClass: cellClass
//         });
//     }

//     console.log('Timesheet Headers:', this.timesheetHeaders);
    // }
    
    calculateTimesheetHeaders() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const selectedDate = new Date(this.selectedDate); // Assuming this is the selected date from the date picker
    const duration = 7; // We always want to display headers for 7 days

    // Clear previous headers
    this.timesheetHeaders = [];

    for (let i = 0; i < duration; i++) {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(selectedDate.getDate() + i);
        const dayIndex = currentDate.getDay(); // Get the day index (0 for Sunday, 1 for Monday, ...)
        const dayName = daysOfWeek[dayIndex];
        const formattedDate = currentDate.toLocaleDateString();
        const isWeekendOrHoliday = this.isWeekendOrHoliday(dayName, formattedDate);
        let cellClass = '';

        // Check if the current date exceeds the end date
        if (currentDate > end) {
            cellClass = 'grey-column'; // Mark the cell as grey
        } else {
            cellClass = isWeekendOrHoliday ? 'grey-column' : ''; // Check if it's a weekend or holiday
        }

        this.timesheetHeaders.push({
            dayName: dayName,
            formattedDate: formattedDate,
            isWeekendOrHoliday: isWeekendOrHoliday,
            cellClass: cellClass
        });
    }

    console.log('Timesheet Headers:', this.timesheetHeaders);
}


handleTypeChange(event) {
    this.selectedType = event.detail.value;
    if (this.selectedType !== 'None') {
        this.projectName = this.selectedType;
    } else {
        // Store the original project name before modifying it
     
        // Set the project name to the original project name
        this.projectName = this.projectName2;
    }
}

    showToast ( title, message, variant )
    {
        const event = new ShowToastEvent( { title, message, variant } );
        this.dispatchEvent( event );
    }


handleSubmit() {
    this.timesheetHeaders.forEach(header => {
        let dayName = header.dayName;
        let formattedDate = header.formattedDate;
        let columnElements = this.template.querySelectorAll(`td[data-label="${dayName}"] lightning-input`);
        let fullName = `${this.employeeName} on ${dayName} ${formattedDate} in ${this.projectName}  `;

        if (columnElements && columnElements.length > 0) {
            columnElements.forEach(columnElement => {
                let columnValue = columnElement.value;

                if (this.selectedType === 'None') {
                    // Call Apex method to submit timesheet record with projectName
                    submitTimesheet({
                        resourceId: this.resourceId,
                        projectId: this.projectId,
                        workedDay: columnValue,
                        fullDate: formattedDate + ' ' + dayName,
                        Name: fullName,
                        Other: 'None'
                    })
                    .then(result => {
                        // Handle success response if needed
                        console.log('Timesheet submitted successfully:', result);
                        // Optionally, you can show a success toast
                        this.showToast('Success', 'Timesheet submitted successfully', 'success');
                    })
                    .catch(error => {
                        // Handle error response
                        console.error('Error occurred while submitting timesheet:', error);
                        // Optionally, you can show an error toast
                        this.showToast('Error', 'An error occurred while submitting timesheet', 'error');
                    });
                } else {
                    // Call Apex method to submit timesheet record with selectedType and Other__c value
                    submitTimesheet({
                        resourceId: this.resourceId,
                        projectId: this.projectId,
                        workedDay: columnValue,
                        fullDate: formattedDate + ' ' + dayName,
                        Name: fullName,
                        Other: this.selectedType
                    })
                    .then(result => {
                        // Handle success response if needed
                        console.log('Timesheet submitted successfully:', result);
                        // Optionally, you can show a success toast
                        this.showToast( 'Success', 'Timesheet submitted successfully', 'success' );
                         window.history.back();
                    })
                    .catch(error => {
                        // Handle error response
                        console.error('Error occurred while submitting timesheet:', error);
                        // Optionally, you can show an error toast
                        this.showToast('Error', 'An error occurred while submitting timesheet', 'error');
                    });
                }
            });
        } else {
            console.error('Column elements not found for', dayName);
        }
    });
}

            
    // Refresh the component data using the Lightning Data Service
          
            
    handleCancel() {
        // Navigate back to the previous page
        window.history.back();
    }

}