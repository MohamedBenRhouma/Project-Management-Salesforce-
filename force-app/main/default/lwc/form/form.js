import { LightningElement, track } from 'lwc';
import createLead from '@salesforce/apex/LeadController.createLead';

export default class form extends LightningElement {
     submitted = false;
    errorEmail;
    errorPhone;

handleSubmit(event) {
    event.preventDefault();
   
    const formData = new FormData(event.target);

//     let valid = true;

//     // Validation de l'email
//     const email = formData.get('email');
//     if (!email.includes('@')) {
//         this.errorEmail = 'L\'adresse email doit contenir un symbole @';
//         valid = false;
//     } else {
//         this.errorEmail = ''; 
//     }

  
//     const phone = formData.get('phone');
//     if (phone.length !== 8) {
//         this.errorPhone = 'Le numéro de téléphone doit contenir 8 chiffres';
//         valid = false;
//     } else {
//         this.errorPhone = ''; 
//     }

//    console.log("emna")
//     if (!valid) {
//         return;
//     }

    const leadData = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        adresse: formData.get('address'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        Company_Email__c: formData.get('company_email'), // New fields
        CompanyPhone__c: formData.get('company_phone'), // New fields
        Job_Title__c: formData.get('job_title'), // New fields
    };

    console.log( 'Soumission du formulaire avec les données:', leadData );
    console.log(leadData)

    createLead({ leadData: leadData })
        .then(leadId => {
            console.log('Lead créé avec ID:', leadId);
            this.submitted = true;
        })
        .catch(error => {
            console.error('Erreur lors de la création du lead:', error);
        });
}
}