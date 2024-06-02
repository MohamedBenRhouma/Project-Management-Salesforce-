/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-19-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
public with sharing class fetchInformation {
    @AuraEnabled(cacheable=true)
    public static TimesheetData getInfo() {
        String currentUserEmail = UserInfo.getUserEmail();
        List<Project_Ressources__c> userProjectResources = [SELECT Id, Name, Project_Name__c, Project_Name__r.Name, Ressource__r.Name, Ressource__c FROM Project_Ressources__c WHERE Ressource__r.Email__c =: currentUserEmail LIMIT 1];

       TimesheetData timesheetData = new TimesheetData();
        if (!userProjectResources.isEmpty()) {
            Id projectId = userProjectResources[0].Project_Name__c;
            String projectName = userProjectResources[0].Project_Name__r.Name;
            Id resourceId = userProjectResources[0].Ressource__c;
            String resourceName = userProjectResources[0].Ressource__r.Name;

            timesheetData.projectId = projectId; // Add projectId to TimesheetData
            timesheetData.resourceId = resourceId; // Add resourceId to TimesheetData
            timesheetData.projectName = projectName;
            timesheetData.resourceName = resourceName;

            // Fetch lot assignment details
            LotResourceAssignment__c lotAssignment = getAssignedLot(resourceId);
            if (lotAssignment != null) {
                timesheetData.lotName = lotAssignment.Lot__r.Name;
                timesheetData.startDate = lotAssignment.Start_Assignment_Date__c;
                timesheetData.endDate = lotAssignment.End_Assignment_Date__c;
            }
        }
        return timesheetData;
    }
    
     @AuraEnabled(cacheable=true)
    public static TimesheetData fetchEmployeeData() {
         String currentUserEmail = UserInfo.getUserEmail();
        TimesheetData timesheetData = new TimesheetData();
        // Query Employee_Directory__c to fetch employee name based on the provided email
        List<Employee_Directory__c> employeeList = [SELECT Name FROM Employee_Directory__c WHERE Email__c =: currentUserEmail  LIMIT 1];
        if (!employeeList.isEmpty()) {
            
            timesheetData.resourceName = employeeList[0].Name;
            System.debug(employeeList[0].Name);
        }
        return timesheetData;
    }

    @AuraEnabled(cacheable=true)
   public static LotResourceAssignment__c getAssignedLot(Id resourceId) {
        return [SELECT Id, Lot__r.Name, End_Assignment_Date__c, Start_Assignment_Date__c FROM LotResourceAssignment__c WHERE Ressources__c = :resourceId LIMIT 1];
    }

     public class TimesheetData {
        @AuraEnabled public Id projectId { get; set; } // Project ID
        @AuraEnabled public Id resourceId { get; set; } // Resource ID
        @AuraEnabled public String projectName { get; set; }
        @AuraEnabled public String resourceName { get; set; }
        @AuraEnabled public String lotName { get; set; }
        @AuraEnabled public Date startDate { get; set; }
        @AuraEnabled public Date endDate { get; set; }
    }
       @AuraEnabled(cacheable=true)
    public static List<Calendar__c> fetchHolidays() {
        // Query holiday records from Calendar__c object where Public_Holiday__c checkbox is true
        return [SELECT Id, Day__c, Months__c, Year__c FROM Calendar__c WHERE 	public_holiday__c = true];
    }

 @AuraEnabled(cacheable=false)
public static void submitTimesheet(Id resourceId, Id projectId, String workedDay, String fullDate,String Name,String Other) {
    Timesheet_Ressource__c timesheetRecord = new Timesheet_Ressource__c();
    timesheetRecord.Ressources__c = resourceId;
    timesheetRecord.Project__c = projectId;
    timesheetRecord.Worked_Day__c = workedDay;
    timesheetRecord.Date__c = fullDate;
    timesheetRecord.Name=Name;
     timesheetRecord.Other__c = Other; 
    timesheetRecord.Approval_Status__c = 'Pending approval';
    

    try {
        insert timesheetRecord;
    } catch(Exception e) {
        // Handle any exceptions
        System.debug('Error while inserting timesheet record: ' + e.getMessage());
        throw new AuraHandledException('Error occurred while submitting timesheet: ' + e.getMessage());
    }
}


}