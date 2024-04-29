/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 04-18-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
public with sharing class getUserName {
    @AuraEnabled(cacheable=true)
    public static String getCurrentUserName() {
        User currentUser = [SELECT Name FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return currentUser.Name;
    }
}