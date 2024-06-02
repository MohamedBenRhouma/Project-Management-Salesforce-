/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-16-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
public with sharing class CustomCalendarController {
    @AuraEnabled(cacheable=false)
    public static List<Activities__c> getAllActivitiesData() {
        List<Activities__c> activitiesList = [SELECT Id, End_Date__c, Start_Date__c, Purpose__c, Name FROM Activities__c];
        System.debug('Fetched Activities: ' + activitiesList);
        return activitiesList;
    }
}