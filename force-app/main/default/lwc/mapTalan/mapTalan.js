import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class MapTalan extends NavigationMixin(LightningElement) {
    @track mapMarkers = [];

    connectedCallback() {
        const billingCity = "Tunis";
        const billingCountry = "Tunise";
        const billingPostalCode = "2035";
        const billingState = "Charguia";
        const billingStreet = "10 Rue de l'énergie solaire Impasse N°1 Charguia 1";

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
    }
}