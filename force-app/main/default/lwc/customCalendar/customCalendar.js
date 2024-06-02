import { LightningElement, wire, track } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import { deleteRecord } from 'lightning/uiRecordApi';
import FullCalendarCustom from '@salesforce/resourceUrl/FullCalendarCustom';
import FullCalendarJS from '@salesforce/resourceUrl/Fullcalendar';
// import getAllActivitiesData from '@salesforce/apex/CustomCalendarController.getAllActivitiesData';
import LightningConfirm from 'lightning/confirm';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CustomCalendar extends NavigationMixin(LightningElement) {
    @track selectedMonth;
    @track selectedYear;
    holidaysData = [];
    calendar;
    calendarTitle = '';
    objectLabel = '';
    // objectApiName = 'Activities__c';
    eventsList = [];
    @track monthOptions = [];
    @track yearOptions = [];
    dataToRefresh;

    viewOptions = [
        { label: 'Day', viewName: 'timeGridDay', checked: false },
        { label: 'Week', viewName: 'timeGridWeek', checked: false },
        { label: 'Month', viewName: 'dayGridMonth', checked: true }
        // { label: 'Table', viewName: 'listView', checked: false }
    ];
 

    initializeMonthYearPicklists() {
        const months = [
            { label: 'January', value: '01' },
            { label: 'February', value: '02' },
            { label: 'March', value: '03' },
            { label: 'April', value: '04' },
            { label: 'May', value: '05' },
            { label: 'June', value: '06' },
            { label: 'July', value: '07' },
            { label: 'August', value: '08' },
            { label: 'September', value: '09' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' }
        ];
        this.monthOptions = months;

        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            years.push({ label: i.toString(), value: i.toString() });
        }
        this.yearOptions = years;

        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        this.selectedMonth = currentMonth;
        this.selectedYear = currentYear.toString();
    }
          connectedCallback() {
    Promise.all([
        loadStyle(this, FullCalendarJS + '/lib/main.css'),
        loadScript(this, FullCalendarJS + '/lib/main.js'),
        loadStyle(this, FullCalendarCustom)
    ])
    .then(() => {
        this.initializeCalendar();
        this.initializeMonthYearPicklists();
    })
    .catch(error => {
        console.error(error);
    });
}

     async initializeCalendar(year = new Date().getFullYear()) {
    const calendarEl = this.template.querySelector('div.fullcalendar');

    try {
        this.holidaysData = await this.fetchHolidays('TN', year);
        const holidayEvents = this.getHolidayEvents();
        this.eventsList = [...this.eventsList, ...holidayEvents];

        console.log('Events List:', this.eventsList); // Log events list

        this.calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: false,
            initialDate: new Date(),
            timeZone: 'UTC',
            showNonCurrentDates: false,
            fixedWeekCount: false,
            allDaySlot: false,
            navLinks: false,
            dayCellDidMount: this.customizeDayCell.bind(this),
            events: this.eventsList,
            eventDisplay: 'block',
            eventColor: '#6DF3DF',
            eventTimeFormat: {
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: true,
                meridiem: 'short'
            },
            dayMaxEventRows: true,
            eventTextColor: 'rgb(3, 45, 96)',
            dateClick: info => this.handleDateClick(info)
        });

        this.calendar.render();
        this.calendar.setOption('contentHeight', 550);
        this.calendarTitle = this.calendar.view.title;
    } catch (error) {
        console.error(error);
    }
}
// @wire(getAllActivitiesData)
// wiredMeetings(result) {
//     if (result.data) {
//         console.log('Fetched Activities:', result.data); // Log the fetched activities
//         this.eventsList = result.data.map(meeting => ({
//             id: meeting.Id,
//             editable: true,
//             allDay: false,
//             start: meeting.Start_Date__c,
//             end: meeting.End_Date__c,
//             title: meeting.Purpose__c
//         }));
//         this.dataToRefresh = result;
//         this.updateCalendarEvents(); // Ensure calendar is updated
//     } else if (result.error) {
//         console.error(result.error);
//     }
// }
updateCalendarEvents() {
    if (this.calendar) {
        const existingEventIds = this.calendar.getEvents().map(event => event.id);
        this.eventsList.forEach(event => {
            if (existingEventIds.includes(event.id)) {
                const existingEvent = this.calendar.getEventById(event.id);
                existingEvent.setExtendedProp('start', event.start);
                existingEvent.setExtendedProp('end', event.end);
                existingEvent.setProp('title', event.title);
            } else {
                this.calendar.addEvent(event);
            }
        });
        this.calendarTitle = this.calendar.view.title;
    }
}

    handleMonthChange(event) {
        this.selectedMonth = event.detail.value;
        this.updateCalendar();
    }

    handleYearChange(event) {
        this.selectedYear = event.detail.value;
        this.updateCalendar();
    }

    async updateCalendar() {
        const newDate = new Date(`${this.selectedYear}-${this.selectedMonth}-01`);
        await this.fetchAndRenderHolidays(this.selectedYear);
        this.calendar.gotoDate(newDate);
        this.calendarTitle = this.calendar.view.title;
    }

   async fetchAndRenderHolidays(year) {
    try {
        console.log('Fetching holidays for year:', year);
        this.holidaysData = await this.fetchHolidays('TN', year);
        console.log('Fetched holidays data:', this.holidaysData);
        // this.removeHolidayEvents();
        const holidayEvents = this.getHolidayEvents();
        this.eventsList = [...this.eventsList.filter(event => !event.holidayName), ...holidayEvents];
        this.calendar.getEvents().forEach(event => event.remove());
        this.calendar.addEventSource(this.eventsList);
    } catch (error) {
        console.error('Error fetching or rendering holidays:', error);
    }
}
    // removeHolidayEvents() {
    //     const holidayEventIds = this.holidaysData.map(holiday => holiday.iso + '_' + holiday.date);
    //     this.calendar.getEvents().forEach(event => {
    //         if (holidayEventIds.includes(event.id)) {
    //             event.remove();
    //         }
    //     });
    // }

    getHolidayEvents() {
        return this.holidaysData.map(holiday => ({
            id: holiday.iso + '_' + holiday.date,
            title: holiday.name,
            start: holiday.date,
            allDay: true,
            holidayName: holiday.name
        }));
    }

  

    // handleDateClick(info) {
    //     const clickedDate = info.date;
    //     const day = clickedDate.getDay();
    //     const clickedDateString = clickedDate.toISOString().split('T')[0];
    //     const holidays = this.holidaysData.map(holiday => holiday.date);

    //     if (holidays.includes(clickedDateString) || day === 0 || day === 6) {
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Cannot Add Anything',
    //                 message: 'You cannot create on holidays, Saturdays, or Sundays.',
    //                 variant: 'error'
    //             })
    //         );
    //     } else {
    //         const defaultValues = encodeDefaultFieldValues({
    //             Start_Date__c: info.dateStr
    //         });
    //         this.navigateToNewRecordPage(this.objectApiName, defaultValues);
    //     }
    // }

   calendarActionsHandler(event) {
    const actionName = event.target.value;
    if (actionName === 'previous') {
        this.calendar.prev();
    } else if (actionName === 'next') {
        this.calendar.next();
    } else if (actionName === 'today') {
        this.calendar.today();
    }
    this.calendarTitle = this.calendar.view.title;
    this.updateCalendarEvents();
}

    changeViewHandler(event) {
        const viewName = event.detail.value;
        if (viewName !== 'listView') {
            this.calendar.changeView(viewName);
            this.viewOptions = this.viewOptions.map(viewOption => ({
                ...viewOption,
                checked: viewOption.viewName === viewName
            }));
            this.calendarTitle = this.calendar.view.title;
        } else {
            // this.handleListViewNavigation(this.objectApiName);
        }
    }

    // handleListViewNavigation(objectName) {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__objectPage',
    //         attributes: {
    //             objectApiName: objectName,
    //             actionName: 'list'
    //         },
    //         state: {
    //             filterName: 'Recent'
    //         }
    //     });
    // }

    get buttonLabel() {
        return 'New ' + this.objectLabel;
    }






    showConfirmWindow(event) {
        LightningConfirm.open({
            message: 'Are you sure you want to delete this Meeting?',
            variant: 'header',
            label: 'Delete Meeting',
            theme: 'brand'
        })
        .then(result => {
            if (result) {
                const eventToDelete = this.calendar.getEventById(event.id);
                if (eventToDelete) {
                    eventToDelete.remove();

                    deleteRecord(event.id)
                        .then(() => {
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Deleted!',
                                    message: 'Record deleted successfully',
                                    variant: 'success'
                                })
                            );
                        })
                        .catch(error => {
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Error occurred!',
                                    message: error.body.message,
                                    variant: 'error'
                                })
                            );
                        });
                } else {
                    console.error('Event not found');
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
    }

    fetchHolidays(country, year) {
        const url = `https://api.api-ninjas.com/v1/holidays?country=${country}&year=${year}`;
        return fetch(url, {
            headers: { 'X-Api-Key': 'hRvsoCeA9aRY7oFU2Ve1Og==qfR1ncNbmcEMeSHp' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch holidays');
            }
            return response.json();
        });
    }

    customizeDayCell(dayCell) {
        const date = dayCell.date;
        const dateString = date.toISOString().split('T')[0];
        const day = date.getDay();
        const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const adjustedDateString = adjustedDate.toISOString().split('T')[0];

        const holidays = this.holidaysData.map(holiday => holiday.date);
        if (holidays.includes(adjustedDateString)) {
            dayCell.el.style.backgroundColor = 'lightgrey';
            dayCell.el.classList.add('fc-noninteractive');
        }
        if (day === 6 || day === 0) {
            dayCell.el.style.backgroundColor = 'lightgrey';
            dayCell.el.classList.add('fc-noninteractive');
        }
    }

    // navigateToNewRecordPage(objectName, defaultValues) {
    //     if (!defaultValues) {
    //         defaultValues = {};
    //     }
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__objectPage',
    //         attributes: {
    //             objectApiName: objectName,
    //             actionName: 'new'
    //         },
    //         state: {
    //             defaultFieldValues: defaultValues
    //         }
    //     });
    // }
}