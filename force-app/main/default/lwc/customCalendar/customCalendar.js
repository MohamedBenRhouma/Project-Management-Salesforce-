import { LightningElement } from 'lwc';
import FullCalendarCustom from '@salesforce/resourceUrl/FullCalendarCustom';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendar';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { NavigationMixin } from "lightning/navigation";

export default class CustomCalendar extends NavigationMixin( LightningElement ) {
    holidaysData
    calendar;
    calendarTitle;
    objectApiName = 'Account';
    viewOptions = [
        {
            label: 'Day',
            viewName: 'timeGridDay',
            checked: false
        },
        {
            label: 'Week',
            viewName: 'timeGridWeek',
            checked: false
        },
        {
            label: 'Month',
            viewName: 'dayGridMonth',
            checked: true
        },
        {
            label: 'Table',
            viewName: 'listView',
            checked: false
        }
    ];

    changeViewHandler ( event )
    {
        const viewName = event.detail.value;
        if ( viewName != 'listView' )
        {
            this.calendar.changeView( viewName );
            const viewOptions = [ ...this.viewOptions ];
            for ( let viewOption of viewOptions )
            {
                viewOption.checked = false;
                if ( viewOption.viewName === viewName )
                {
                    viewOption.checked = true;
                }
            }
            this.viewOptions = viewOptions;
            this.calendarTitle = this.calendar.view.title;
        } else
        {
            this.handleListViewNavigation( this.objectApiName );
        }
    }

    handleListViewNavigation ( objectName )
    {
        this[ NavigationMixin.Navigate ]( {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: objectName,
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            }
        } );
    }

    calendarActionsHandler ( event )
    {
        const actionName = event.target.value;
        if ( actionName === 'previous' )
        {
            this.calendar.prev();
        } else if ( actionName === 'next' )
        {
            this.calendar.next();
        } else if ( actionName === 'today' )
        {
            this.calendar.today();
        } else if ( actionName === 'new' )
        {
            this.navigateToNewRecordPage( this.objectApiName );
        } else if ( actionName === 'refresh' )
        {

        }
        this.calendarTitle = this.calendar.view.title;
    }

    navigateToNewRecordPage ( objectName )
    {
        this[ NavigationMixin.Navigate ]( {
            type: "standard__objectPage",
            attributes: {
                objectApiName: objectName,
                actionName: "new",
            },
        } );
    }

    connectedCallback ()
    {
        Promise.all( [
            loadStyle( this, FullCalendarJS + '/lib/main.css' ),
            loadScript( this, FullCalendarJS + '/lib/main.js' ),
            loadStyle( this, FullCalendarCustom )
        ] )
            .then( () =>
            {
                this.initializeCalendar();
            } )
            .catch( error => console.log( error ) )
    }
    async initializeCalendar ()
    {
        const calendarEl = this.template.querySelector( 'div.fullcalendar' );
        const year = new Date().getFullYear();
        this.holidaysData = await this.fetchHolidays( 'TN', year );

        const calendar = new FullCalendar.Calendar( calendarEl, {
            headerToolbar: false,
            initialDate: new Date(),
            showNonCurrentDates: false,
            fixedWeekCount: false,
            allDaySlot: false,
            navLinks: false,
            dayCellDidMount: this.customizeDayCell.bind( this )
        } );
        calendar.render();
        calendar.setOption( 'contentHeight', 550 );
        this.calendarTitle = calendar.view.title;
        this.calendar = calendar;
    }

    async fetchHolidays ( country, year )
    {
        try
        {
            const response = await fetch( `https://api.api-ninjas.com/v1/holidays?country=${ country }&year=${ year }`, {
                headers: { 'X-Api-Key': 'hRvsoCeA9aRY7oFU2Ve1Og==qfR1ncNbmcEMeSHp' }
            } );
            if ( !response.ok )
            {
                throw new Error( 'Failed to fetch holidays' );
            }
            const data = await response.json();
            return data;
        } catch ( error )
        {
            console.error( 'Error fetching holidays:', error );
            throw error;
        }
    }
    customizeDayCell ( dayCell )
    {
        const date = dayCell.date;
    const dateString = date.toISOString().split('T')[0];

    // Adjust date to match the timezone used by the calendar
    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const adjustedDateString = adjustedDate.toISOString().split('T')[0];

    const holidays = this.holidaysData.map(holiday => holiday.date);
    if (holidays.includes(adjustedDateString)) {
        dayCell.el.style.backgroundColor = 'lightgrey';
        dayCell.el.classList.add('fc-noninteractive');
    }
    }
}