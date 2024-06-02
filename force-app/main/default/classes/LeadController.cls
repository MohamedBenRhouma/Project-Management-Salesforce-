/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 04-26-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
    public with sharing class LeadController {
        


 @AuraEnabled(cacheable=true)
    public static Id createLead(Map<String, String> leadData) {
        Lead newLead = new Lead(
            FirstName = leadData.get('first_name'),
            LastName = leadData.get('last_name'),
            Email = leadData.get('email'),
            Phone = leadData.get('phone'),
            Company = leadData.get('company'),
            Company_Email__c = leadData.get('company_email'),
            CompanyPhone__c = leadData.get('company_phone'),
            Job_Title__c = leadData.get('job_title')
        
        );
        insert newLead;
        return newLead.Id;
    }

    }