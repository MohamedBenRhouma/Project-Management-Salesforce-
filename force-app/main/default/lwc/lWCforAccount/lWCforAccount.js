import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';

const ADDRESS_FIELDS = [
    'Account.BillingCity',
    'Account.BillingCountry',
    'Account.BillingPostalCode',
    'Account.BillingState',
    'Account.BillingStreet'
];

export default class LWCforAccount extends NavigationMixin(LightningElement) {
    @api recordId;
    @track mapMarkers = [];
    @track error;

    @wire(getRecord, { recordId: '$recordId', fields: ADDRESS_FIELDS })
    wiredAccount({ error, data }) {
        if (data) {
            const billingCity = data.fields.BillingCity.value;
            const billingCountry = data.fields.BillingCountry.value;
            const billingPostalCode = data.fields.BillingPostalCode.value;
            const billingState = data.fields.BillingState.value;
            const billingStreet = data.fields.BillingStreet.value;

            this.mapMarkers = [{
                location: {
                    City: billingCity,
                    Country: billingCountry,
                    PostalCode: billingPostalCode,
                    State: billingState,
                    Street: billingStreet
                },
                icon: 'standard:account',
                title: 'Account Location'
            }];
        } else if (error) {
            this.error = error;
            this.mapMarkers = []; // Clear map markers in case of error
        }
    }
}