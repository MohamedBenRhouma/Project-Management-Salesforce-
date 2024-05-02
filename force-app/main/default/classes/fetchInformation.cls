/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 04-30-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
public with sharing class fetchInformation {
    public static void getInfo() {
        String currentUserEmail = UserInfo.getUserEmail();
        List<Project_Ressources__c> userProjectResources = [SELECT Id, Name, Project_Name__c, Project_Name__r.Name, Ressource__c FROM Project_Ressources__c WHERE Ressource__r.Email__c = 'xexob13499@fryshare.com' LIMIT 1];

        if (!userProjectResources.isEmpty()) {
            Id projectId = userProjectResources[0].Project_Name__c;
            String projectName = userProjectResources[0].Project_Name__r.Name;
            Id resourceId = userProjectResources[0].Ressource__c;
            System.debug('Project ID: ' + projectId);
            System.debug('Project Name: ' + projectName);
            System.debug('Resource ID: ' + resourceId);
        } else {
            System.debug('No project found for current user.');
        }
    }

    public static void getAssignedLot(Id resourceId) {
        List<LotResourceAssignment__c> lotResources = [SELECT Id, Lot__r.Name, End_Assignment_Date__c, Start_Assignment_Date__c FROM LotResourceAssignment__c WHERE Ressources__c = :resourceId LIMIT 1];

        if (!lotResources.isEmpty()) {
            String lotName = lotResources[0].Lot__r.Name;
            Date startDate = lotResources[0].Start_Assignment_Date__c;
            Date endDate = lotResources[0].End_Assignment_Date__c;
            System.debug('LotName: ' + lotName);
            System.debug('StartDate: ' + startDate);
            System.debug('EndDate: ' + endDate);
        } else {
            System.debug('No lot assignment found for the resource.');
        }
    }
}
