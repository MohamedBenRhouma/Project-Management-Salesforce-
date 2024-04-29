// import { LightningElement, api, wire } from 'lwc';
// import { getObjectInfo } from 'lightning/uiObjectInfoApi';
// import getData from '@salesforce/apex/DynamicApexClass.getData';
// export default class DataTabSemiDynamique extends LightningElement
// {
//       data = [];
//     filteredData = [];
//     searchTerm = '';
//     columns = [];
//     @api recordId; 
//     @api columnsStringData;
//     @api objectAPIName = 'Employee_Directory__c'; // Update to your object API name
//     @api fieldAPINames = ['Name', 'Last_Name__c', 'Employee_Role__c', 'Profile__c']; // Update to your field API names
//     @api filterFieldName = '';
//     @api filterCriteria = '{}'; // Default empty filter criteria
//     @api customLimit;
//     @api title = '';

//     connectedCallback() {
//         this.columns = JSON.parse(this.columnsStringData);
//     }

//     @wire(getObjectInfo, { objectApiName: '$objectAPIName' })
//     objectInfo;

//   @wire(getData, { objectAPIName: '$objectAPIName', fieldAPINames: '$fieldAPINames', customLimit: '$customLimit', departmentId: '$recordId' })
// wiredAllData({ error, data }) {
//     if (data) {
//         this.data = data;
//         this.filterData();
//     } else if (error) {
//         console.error('Error retrieving data:', error);
//     }
// }


//   handleSearchTermChange(event) {
//     this.searchTerm = event.target.value;
//     console.log('Search term:', this.searchTerm); // Add this line to check if the method is called
//     this.filterData();
// }


//    filterData() {
//     let criteria = JSON.parse(this.filterCriteria);
//     this.filteredData = this.data.filter(record => {
//         let matchesSearchTerm = true;
//         if (this.searchTerm) {
//             matchesSearchTerm = this.fieldAPINames.some(field => {
//                 const fieldValue = String(record[field]).toLowerCase();
//                 return fieldValue.includes(this.searchTerm.toLowerCase());
//             });
//         }

//         let matchesFilterCriteria = true;
//         if (criteria.length > 0) {
//             matchesFilterCriteria = criteria.some(filter => {
//                 return Object.entries(filter).every(([field, value]) => {
//                     return Array.isArray(value) ? value.includes(record[field]) : record[field] === value;
//                 });
//             });
//         }

//         return matchesSearchTerm && matchesFilterCriteria;
//     });
//     }




//     get filteredData() {
//         return this.filteredData;
//     }
// }
import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getData from '@salesforce/apex/DynamicApexClass.getData';

export default class DataTabSemiDynamique extends LightningElement {
    data = [];
    filteredData = [];
    searchTerm = '';
    columns = [];
    @api recordId; 
    @api columnsStringData;
    @api objectAPIName = 'Employee_Directory__c';
    @api fieldAPINames = ['Name', 'Last_Name__c', 'Employee_Role__c', 'Profile__c'];
    @api filterFieldName = '';
    @api filterCriteria = '{}';
    @api customLimit;
    @api title = '';
    // Pagination properties
    pageSizeOptions = [5, 10, 25, 50, 75, 100];
    totalRecords = 0;
    pageSize;
    totalPages;
    pageNumber = 1;
    recordsToDisplay = [];

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
            if (criteria.length > 0) {
                matchesFilterCriteria = criteria.some(filter => {
                    return Object.entries(filter).every(([field, value]) => {
                        return Array.isArray(value) ? value.includes(record[field]) : record[field] === value;
                    });
                });
            }

            return matchesSearchTerm && matchesFilterCriteria;
        });
        this.paginationHelper();
    }

    handleRecordsPerPage(event) {
        this.pageSize = parseInt(event.target.value, 10);
        this.pageNumber = 1; // Reset to first page when changing page size
        this.paginationHelper();
    }

    previousPage() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.paginationHelper();
        }
    }

    nextPage() {
        if (this.pageNumber < this.totalPages) {
            this.pageNumber++;
            this.paginationHelper();
        }
    }

    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }

    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }

    paginationHelper() {
        const startIndex = (this.pageNumber - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
        this.recordsToDisplay = this.filteredData.slice(startIndex, endIndex);
        this.totalRecords = this.filteredData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
}