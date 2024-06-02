// import { LightningElement, track, wire } from 'lwc';
// import getCalendarData from '@salesforce/apex/CalendarController.GetAllCalendar';

// export default class customCalendarTWO extends LightningElement {
//     @track weeks = [];
//     @track calendarData;

//     @wire(getCalendarData)
//     wiredCalendarData({ error, data }) {
//         if (data) {
//             this.calendarData = data;
//             this.buildCalendar(data); // Call buildCalendar after data is fetched
//         } else if (error) {
//             console.error('Error fetching calendar data:', error);
//         }
//     }

//     buildCalendar(calendarData) {
//         const currentYear = new Date().getFullYear();

//         // Loop through each month
//         for (let month = 0; month < 12; month++) {
//             const weeksInMonth = this.getWeeksInMonth(currentYear, month);
//             const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
//             const startingWeekday = new Date(currentYear, month, 1).getDay(); // 0 (Sun) - 6 (Sat)

//             // Create an empty week array
//             let week = [];

//             // Fill the first week with blanks and actual days
//             for (let day = 0; day < startingWeekday; day++) {
//                 week.push({ date: '', isBlank: true });
//             }
//             for (let day = 1; day <= daysInMonth; day++) {
//                 const calendarDay = calendarData.find(
//                     (item) => item.Year__c === currentYear && item.Months__c === month + 1 && item.Day__c === day
//                 );
//                 // You can add event data here if available in 'calendarDay'
//                 week.push({ date: day, isBlank: false, eventData: calendarDay ? calendarDay : null }); // Add event data if present
//             }

//             // Fill remaining weeks with full days
//             for (let i = 0; i < weeksInMonth - 1; i++) {
//                 const newWeek = [];
//                 for (let day = 1; day <= 7; day++) {
//                     week.push({ date: day, isBlank: false }); // Adjust if you have event data
//                 }
//                 this.weeks.push(newWeek);
//             }

//             // Push the partially filled week (if any)
//             if (week.length > 0) {
//                 this.weeks.push(week);
//             }
//         }
//     }

//     getWeeksInMonth(year, month) {
//         // Function to calculate the number of weeks in a month
//         return Math.ceil(new Date(year, month + 1, 0).getDate() / 7);
//     }
// }