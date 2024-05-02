// customCalendar.js
import { LightningElement, track } from 'lwc';

export default class CustomCalendarTWO extends LightningElement {
 @track currentDate = new Date();
    @track daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    get currentMonth() {
        return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    get calendarDates() {
        const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay();
        const daysInMonth = lastDayOfMonth.getDate();
        const calendarDates = [];

        for (let i = 1 - firstDayOfWeek; i <= daysInMonth; i++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i);
            calendarDates.push({ date: date, class: this.dateClass(date), day: date.getDate() });
        }

        return calendarDates;
    }

    goToPreviousMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    }

    goToNextMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    }

    dateClass(date) {
        return date.getMonth() !== this.currentDate.getMonth() ? 'other-month calendar-date' : 'calendar-date';
    }
}