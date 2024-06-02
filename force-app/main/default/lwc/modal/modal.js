import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class Modal extends LightningModal {
    @api content;

    handleOkay() {
        this.close('okay');
    }

    handleCancel() {
        this.close('cancel');
    }
}