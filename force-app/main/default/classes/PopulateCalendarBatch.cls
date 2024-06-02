/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-20-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
// /**
//  * @description       : Batch class to populate Calendar__c object with dates and mark holidays
//  * @author            : Mohamed Ben Rhouma
//  * @last modified on  : 05-11-2024
//  * @last modified by  : Mohamed Ben Rhouma
//  **/
// public class PopulateCalendarBatch implements Database.AllowsCallouts, Database.Batchable<sObject> {
//     private List<Date> allDates;

//     public Database.QueryLocator start(Database.BatchableContext BC) {
//         // Return a dummy query locator
//         return Database.getQueryLocator([SELECT Id FROM Account LIMIT 1]);
//     }

// public void execute(Database.BatchableContext BC, List<Account> scope) {
//     // Determine the start and end dates for the current year
//     Integer year = System.today().year();
//     Date startDate = Date.newInstance(year, 1, 1);
//     Date endDate = Date.newInstance(year, 12, 31);

//     // Generate a list of all dates in the current year
//     allDates = new List<Date>();
//     while (startDate <= endDate) {
//         allDates.add(startDate);
//         startDate = startDate.addDays(1);
//     }

//     List<String> holidays = CalendarController.fetchHolidays('TN');

//     // Query existing calendar records for the current year
//     Set<String> existingDates = new Set<String>();
//     for (Calendar__c existingRecord : [SELECT Day__c, Months__c FROM Calendar__c WHERE Year__c = :String.valueOf(year)]) {
//         existingDates.add(existingRecord.Day__c + '-' + existingRecord.Months__c);
//     }

//     // Create new calendar records for each date in the current year if they do not already exist
//     List<Calendar__c> newCalendarRecords = new List<Calendar__c>();
// System.debug('All Dates: ' + allDates);
// System.debug('Holidays: ' + holidays);
// // Inside the execute method
// for (Date d : allDates) {
//     // Format date in day-month format for comparison
//     String dateString = d.month() + '-' + d.day();

//     // Print out dateString to debug
//     System.debug('Checking date: ' + dateString);

//     // Check if the date already exists in the existing records
//     if (!existingDates.contains(dateString)) {
//         // Check if the date is a holiday
//         String formattedDate = d.year() + '-' + String.valueOf(d.month()).leftPad(2, '0') + '-' + String.valueOf(d.day()).leftPad(2, '0');
//         Boolean isHoliday = holidays.contains(formattedDate);

//         // Print out isHoliday to debug
//         System.debug('Is holiday: ' + isHoliday);

//         // Create new calendar record
//         Calendar__c newRecord = new Calendar__c();
//         newRecord.Day__c = String.valueOf(d.day());
//         newRecord.Months__c = String.valueOf(d.month());
//         newRecord.Year__c = String.valueOf(d.year());
//         newRecord.Public_Holiday__c = isHoliday;

//         // Add record to list
//         newCalendarRecords.add(newRecord);
//     }
// }

 

//     // Insert the new calendar records
//     insert newCalendarRecords;
// }

//     public void finish(Database.BatchableContext BC) {
//         // Optionally add any post-processing logic here
//     }
//     @AuraEnabled(cacheable=true)
//      public static void executeFunction(){
//      PopulateCalendarBatch batchJob = new PopulateCalendarBatch();
//     Database.executeBatch(batchJob);
//      }
// }

/**
 * @description       : Batch class to populate Calendar__c object with dates and mark holidays
 * @author            : Mohamed Ben Rhouma
 * @last modified on  : 05-20-2024
 * @last modified by  : Mohamed Ben Rhouma
 **/
public  class  PopulateCalendarBatch implements Database.AllowsCallouts, Database.Batchable<sObject> {
   private ApexPages.StandardController controller;

    public PopulateCalendarBatch(ApexPages.StandardController controller) {
        this.controller = controller;
    }
        private List<Date> allDates;

    public Database.QueryLocator start(Database.BatchableContext BC) {
        
        // Return a dummy query locator
        return Database.getQueryLocator([SELECT Id FROM Account LIMIT 1]);
    }
public void execute(Database.BatchableContext BC, List<Account> scope) {
    // Determine the start and end dates for the current year
    Integer year = System.today().year();
    Date startDate = Date.newInstance(year, 1, 1);
    Date endDate = Date.newInstance(year, 12, 31);

    // Generate a list of all dates in the current year
    List<Date> allDates = new List<Date>();
    while (startDate <= endDate) {
        allDates.add(startDate);
        startDate = startDate.addDays(1);
    }

    Map<String, String> holidays = CalendarController.fetchHolidays('TN');

    // Query existing calendar records for the current year
    Map<String, Calendar__c> existingDates = new Map<String, Calendar__c>();
    for (Calendar__c existingRecord : [SELECT Id, Day__c, Months__c FROM Calendar__c WHERE Year__c = :String.valueOf(year)]) {
        existingDates.put(existingRecord.Day__c + '-' + existingRecord.Months__c+'-'+existingRecord.Year__c, existingRecord);
    }

    // Create new calendar records for each date in the current year if they do not already exist
    List<Calendar__c> newCalendarRecords = new List<Calendar__c>();

    for (Date d : allDates) {
        // Format date in day-month format for comparison
        String dateString = d.month() + '-' + d.day();

        // Check if the date already exists in the existing records
        if (!existingDates.containsKey(dateString)) {
            // Check if the date is a holiday
            String formattedDate = d.year() + '-' + String.valueOf(d.month()).leftPad(2, '0') + '-' + String.valueOf(d.day()).leftPad(2, '0');
            Boolean isHoliday = holidays.containsKey(formattedDate);
            String holidayName = isHoliday ? holidays.get(formattedDate) : '';

            // Create new calendar record
            Calendar__c newRecord = new Calendar__c(
                Day__c = String.valueOf(d.day()),
                Months__c = String.valueOf(d.month()),
                Year__c = String.valueOf(d.year()),
                Public_Holiday__c = isHoliday,
                Description__c = holidayName
            );

            // Add record to list
            newCalendarRecords.add(newRecord);
        }
    }

    // Insert the new calendar records
    if (!newCalendarRecords.isEmpty()) {
        insert newCalendarRecords;
    }
}

    public void finish(Database.BatchableContext BC) {
        // Optionally add any post-processing logic here
    }
    @AuraEnabled(cacheable=true)
     public static void executeFunction() {
        ApexPages.StandardController sc = new ApexPages.StandardController(new Account());
        PopulateCalendarBatch batchJob = new PopulateCalendarBatch(sc);
        Database.executeBatch(batchJob);
    }
     }