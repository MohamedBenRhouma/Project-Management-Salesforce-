/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-19-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
trigger SubmitForApprovalTrigger on Timesheet_Ressource__c (after insert, after update) {
    if (Trigger.isAfter) {
        if (Trigger.isInsert || Trigger.isUpdate) {
            // Check if the notification has already been sent in this transaction
                Set<Id> recordIds = new Set<Id>();
                Map<Id, Timesheet_Ressource__c> recordMap = new Map<Id, Timesheet_Ressource__c>();
                
                // Collect the IDs of all submitted records and store them in a map for later use
                for (Timesheet_Ressource__c record : Trigger.new) {
                    if (record.Approval_Status__c == 'Pending approval') {
                        recordIds.add(record.Id);
                        recordMap.put(record.Id, record);
                    }
                }
                
                if (!recordIds.isEmpty()) {
                    // Construct a single notification message with information about all submitted records
                    String notificationMessage = 'New Timesheet Records Submitted for Approval:\n';
                    for (Id recordId : recordIds) {
                        Timesheet_Ressource__c record = recordMap.get(recordId);
                        notificationMessage += 'Record ID: ' + record.Id + ', Resource Name: ' + record.Ressources__r.Name + ', Worked Day: ' + record.Worked_Day__c + '\n';
                    }
                  
                    // Submit the records for approval
                    List<Approval.ProcessSubmitRequest> submitRequests = new List<Approval.ProcessSubmitRequest>();
                    for (Id recordId : recordIds) {
                        Approval.ProcessSubmitRequest submitRequest = new Approval.ProcessSubmitRequest();
                        submitRequest.setObjectId(recordId);
                        submitRequests.add(submitRequest);
                    }
                    Approval.process(submitRequests);

                    // Set the static variable to true to indicate that the notification has been sent
                    NotificationUtility.notificationSent = true;
                }
            
        }
    }
}