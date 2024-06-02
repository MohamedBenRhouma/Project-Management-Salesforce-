/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 04-19-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
public with sharing class AccountListController {
    // /*
    //  * Get all accounts.
    //  * 
    //  */
    @AuraEnabled(cacheable=true)
    public static Account getAccountDetails(Id accountId){
        return [SELECT Id, Name, AccountNumber, AnnualRevenue, RecordTypeId,
                    BillingCity, BillingState, BillingPostalCode, BillingCountry,
                    Website, CompanyPhone__c, BillingStreet
                FROM Account
                WHERE Id = :accountId
                LIMIT 1];

            }
               @AuraEnabled(cacheable=true)
    public static String getOpportunityDetails (String accountId) {
        Integer count = [SELECT COUNT() FROM Opportunity WHERE AccountId =: accountId];
        Decimal amountUsingAggregateResult = (Decimal) [SELECT SUM(Amount) sum FROM Opportunity WHERE AccountId =: accountId][0].get('sum');
        Decimal amountUsingLoop = 0;

        for(Opportunity opportunityObj : [SELECT Id, Amount FROM Opportunity WHERE AccountId =: accountId]) {
            amountUsingLoop = amountUsingLoop + opportunityObj.Amount;
        }

        return String.valueOf(count) + ',' + UserInfo.getDefaultCurrency() + ' ' + String.valueOf(amountUsingAggregateResult);
    }
}