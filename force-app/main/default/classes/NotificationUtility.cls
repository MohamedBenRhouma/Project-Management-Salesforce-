/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-14-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
public class NotificationUtility {
    // Static variable to track whether a notification has been sent in the current transaction
    public static boolean notificationSent = false;
    
    /**
     * Sends a notification with the specified title and message.
     * @param title The title of the notification.
     * @param message The message content of the notification.
     */
    @AuraEnabled
    public static void sendNotification(String title, String message) {
        // Create a new platform event record to trigger the notification
        Timesheet_Approval_Notification_e__e event = new Timesheet_Approval_Notification_e__e();
        event.Title__c = title;
        event.Message__c = message;
        
        // Publish the platform event
        Database.SaveResult result = EventBus.publish(event);
        if (!result.isSuccess()) {
            for(Database.Error error : result.getErrors()) {
                System.debug('Error publishing event: ' + error);
            }
        }
        
        // Reset the static variable to false after sending the notification
        notificationSent = false;
    }
}