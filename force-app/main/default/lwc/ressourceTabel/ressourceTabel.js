import { LightningElement, wire ,api } from 'lwc';
import getRessources from '@salesforce/apex/RessourceController.getRessources';
import searchRessource from '@salesforce/apex/RessourceController.SearchRessource'; // Changed import name
import { NavigationMixin } from 'lightning/navigation';


const COLUMNS = [
    { label: 'Full Name', fieldName: 'FullName__c', type: 'text' },
    { label: 'Email', fieldName: 'Email__c', type: 'email' },
    { label: 'Employee Role', fieldName: 'Employee_Role__c', type: 'text' },
    { label: 'Resource Type', fieldName: 'Ressource_Type__c', type: 'text' },
    // View Action column
    {
        label: 'View',
        type: 'button',
        initialWidth: 100,
        typeAttributes: {
            label: 'View',
            name: 'view',
            title: 'View',
            variant: 'neutral' // Use 'neutral' variant for white button
        }
    }
   

  
    
]

export default class ressourceTabel extends NavigationMixin( LightningElement ) {
    totalAccounts = 0;
    columns = COLUMNS;
    visibleRessources = []
    resources;
    error;
    searchKey = '';

    @wire( getRessources )
    wiredResources ( result )
    {
        if ( result.data )
        {
            this.resources = result.data;
            this.error = undefined;
        } else if ( result.error )
        {
            this.error = result.error;
            this.resources = undefined;
        }
    }


    handleSearchKeyChange ( event )
    {
        this.searchKey = event.target.value;
        this.searchResources(); // Call search function when search key changes
    }
    

    searchResources ()
    {
        searchRessource( { searchKey: this.searchKey } )
            .then( result =>
            {
                this.resources = result;
                this.error = undefined;
            } )
            .catch( error =>
            {
                this.error = error;
                this.resources = undefined;
            } );
    }

    handleRowAction ( event )
    {
        const action = event.detail.action;
        const row = event.detail.row;

        switch ( action.name )
        {
            case 'view':
                this.viewResource( row.Id );
                break;
            default:
                break;
        }
    }

    viewResource ( resourceId )
    {
        // Navigate to the resource record page
        this[ NavigationMixin.Navigate ]( {
            type: 'standard__recordPage',
            attributes: {
                recordId: resourceId,
                objectApiName: 'Employee_Directory__c',
                actionName: 'view'
            }
        } );
    }

}