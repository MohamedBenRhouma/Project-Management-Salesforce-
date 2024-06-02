User
// dynamicDataTable.js
import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getData from '@salesforce/apex/DynamicApexClass.getData';

export default class DynamicDataTable extends LightningElement {
    data = [];
    filteredData = [];
    searchTerm = '';
    columns = [];
    @api recordId; 
    @api columnsStringData;
    @api objectAPIName = 'Employee_Directory__c'; // Update to your object API name
    @api fieldAPINames = ['Name', 'Last_Name__c', 'Employee_Role__c', 'Profile__c']; // Update to your field API names
    @api filterFieldName = '';
    @api filterCriteria = '{}'; // Default empty filter criteria
    @api customLimit;
    @api title = '';

    connectedCallback() {
        this.columns = JSON.parse(this.columnsStringData);
    }

    @wire(getObjectInfo, { objectApiName: '$objectAPIName' })
    objectInfo;

  @wire(getData, { objectAPIName: '$objectAPIName', fieldAPINames: '$fieldAPINames', customLimit: '$customLimit', departmentId: '$recordId' })
wiredAllData({ error, data }) {
    if (data) {
        this.data = data;
        this.filterData();
    } else if (error) {
        console.error('Error retrieving data:', error);
    }
}


    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
        this.filterData();
    }

    filterData() {
        let criteria = JSON.parse(this.filterCriteria);
        this.filteredData = this.data.filter(record => {
            let matchesSearchTerm = true;
            if (this.searchTerm) {
                matchesSearchTerm = this.fieldAPINames.some(field => {
                    const fieldValue = String(record[field]).toLowerCase();
                    return fieldValue.includes(this.searchTerm.toLowerCase());
                });
            }

            let matchesFilterCriteria = true;
            if (Object.keys(criteria).length > 0) {
                matchesFilterCriteria = Object.entries(criteria).every(([field, value]) => {
                    return record[field] === value;
                });
            }

            return matchesSearchTerm && matchesFilterCriteria;
        });
    }

    get filteredData() {
        return this.filteredData;
    }
}