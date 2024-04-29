import { LightningElement, track } from 'lwc';
import getCurrentUserName from '@salesforce/apex/getUserName.getCurrentUserName';

export default class DynamicDigitalClock extends LightningElement {
    @track userName;
    @track currentDate;

    connectedCallback() {
        // Fetch current user's name when the component is connected
        this.fetchUserName();
        // Start the clock interval
        this.startClock();
        // Set current date
        this.setCurrentDate();
    }

    fetchUserName() {
        getCurrentUserName()
            .then(result => {
                this.userName = result;
            })
            .catch(error => {
                console.error('Error fetching user name:', error);
            });
    }

    startClock() {
        setInterval(() => {
            let date = new Date(),
                hour = date.getHours(),
                min = date.getMinutes(),
                sec = date.getSeconds();

            let d;
            d = hour < 12 ? "AM" : "PM";
            hour = hour > 12 ? hour - 12 : hour;
            hour = hour === 0 ? 12 : hour;

            hour = hour < 10 ? "0" + hour : hour;
            min = min < 10 ? "0" + min : min;
            sec = sec < 10 ? "0" + sec : sec;

            this.template.querySelector(".hour_num").innerText = hour;
            this.template.querySelector(".min_num").innerText = min;
            this.template.querySelector(".sec_num").innerText = sec;
            this.template.querySelector(".am_pm").innerText = d;
        }, 1000);
    }

    setCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        this.currentDate = new Date().toLocaleDateString('en-US', options);
    }
}