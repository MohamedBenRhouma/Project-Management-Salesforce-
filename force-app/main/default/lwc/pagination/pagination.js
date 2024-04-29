// import { LightningElement,api } from 'lwc';

// export default class Pagination extends LightningElement
// {
//     totalRecords
//     recrodSize = 5
//     get records()
//     {
//         return this.visibleRecords
//     }
//     @api
//     set records(data)
//     {
//         if (data)
//         {
//             this.totalRecordd = data;
//             this.visibleRecords = data.slice( 0, this.recrodSize )
//             this.totalPage= Math.ceil(data.length/this.recrodSize)
//         }
//     }
//     nexthandler ()
//     {
        
//     }
//     previoushandler ()
//     {
        
//     }
//     updateRecords ()
//     {
//         this.dispatchEvent( new CustomEvent( 'update', {
//             detail: {
//                 records :this.visibleRecords
//             }
//         }))
//     }
// }
import { LightningElement, api, track } from 'lwc';

export default class Pagination extends LightningElement {
    @track enablePrevious = false;
    @track enableNext = false;

    totalRecords;
    recordSize = 5;
    currentPage = 1;
    totalPage = 0;
    visibleRecords=[];

    @api
    set records(data) {
        if (data) {
            this.totalRecords = data;
            this.totalPage = Math.ceil(data.length / this.recordSize);
            this.updateVisibleRecords();
        }
    }

    get records() {
        return this.visibleRecords;
    }

    get disablePrevious() {
        return this.currentPage <= 1;
    }

    get disableNext() {
        return this.currentPage >= this.totalPage;
    }

    nexthandler() {
        if (this.currentPage < this.totalPage) {
            this.currentPage++;
            this.updateVisibleRecords();
            this.updateButtonStatus();
        }
    }

    previoushandler() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateVisibleRecords();
            this.updateButtonStatus();
        }
    }

     updateVisibleRecords() {
        const startIndex = (this.currentPage - 1) * this.recordSize;
        const endIndex = startIndex + this.recordSize;
        this.visibleRecords = this.totalRecords.slice(startIndex, endIndex);
        this.dispatchEvent(new CustomEvent('update', {
            detail: {
                records: this.visibleRecords
            }
        }));
    }

    updateButtonStatus() {
        this.enablePrevious = !this.disablePrevious;
        this.enableNext = !this.disableNext && this.totalPage > 1;
    }
    
}