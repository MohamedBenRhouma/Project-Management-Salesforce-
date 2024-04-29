import { LightningElement, api } from 'lwc';

export default class MultiSelectPicklist extends LightningElement {
    @api fieldName;
    @api value;

    handleChange(event) {
        this.dispatchEvent(new CustomEvent('change', { detail: { value: event.detail.value } }));
    }
}