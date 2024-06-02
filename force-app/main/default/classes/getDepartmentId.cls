/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-12-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class getDepartmentId {
    @InvocableMethod(label='Get Department ID by Name' description='Get the ID of a Department based on its Name')
    public static List<Id> getDepartmentId(List<String> departmentNames) {
        List<Id> departmentIds = new List<Id>();
        for (String departmentName : departmentNames) {
            Id departmentId;
            List<Department__c> departments = [SELECT Id FROM Department__c WHERE  Name = :departmentName LIMIT 1];
            if (!departments.isEmpty()) {
                departmentId = departments[0].Id;
            departmentIds.add(departmentId);
        }
       
    }
     return departmentIds;
}
}