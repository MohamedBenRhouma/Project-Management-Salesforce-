import { LightningElement, api, track, wire } from 'lwc';
import getDetails from '@salesforce/apex/AccountListController.getOpportunityDetails';

export default class AccountDisplay extends LightningElement {
    @api recordId;
    @track opportunityInfo;
    @track opportunityCount;
    @track opportunityAmountSum;

    @wire (getDetails, {
        accountId : "$recordId"
    }) getDetails ({ data }) {
        if (data) {
            this.opportunityInfo = data;
            this.opportunityCount = data.split(",")[0];
            this.opportunityAmountSum = data.split(",")[1];
        }
    };
}