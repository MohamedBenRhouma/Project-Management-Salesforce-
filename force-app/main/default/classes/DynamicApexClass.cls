/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 04-14-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
public with sharing class DynamicApexClass {
    @AuraEnabled(cacheable=true)
    public static List<sObject> getData(String objectAPIName, List<String> fieldAPINames, Integer customLimit, Id departmentId) {
        String query ='SELECT ' + String.join(fieldAPINames, ', ') + ' FROM ' + objectAPIName + ' WHERE Department__c = :departmentId';
        if(customLimit != null && customLimit > 0) {
            query += ' LIMIT ' + customLimit;
        }
        return Database.query(query);
    }
}