/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-20-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
// /**
//  * @description       : Class to fetch holidays from an API
//  * @author            : Mohamed Ben Rhouma
//  * @group             : 
//  * @last modified on  : 05-11-2024
//  * @last modified by  : Mohamed Ben Rhouma
// **/
// public class CalendarController {

//     public static List<String> fetchHolidays(String country) {
//         // Extract current year
//         Integer currentYear = System.today().year();

//         String apiKey = 'hRvsoCeA9aRY7oFU2Ve1Og==qfR1ncNbmcEMeSHp';
//         String endpoint = 'https://api.api-ninjas.com/v1/holidays?country=' + country + '&year=' + currentYear;

//         // Create HTTP request
//         HttpRequest req = new HttpRequest();
//         req.setEndpoint(endpoint);
//         req.setMethod('GET');

//         // Set API key in request header
//         req.setHeader('X-API-KEY', apiKey);

//         // Send HTTP request
//         Http http = new Http();
//         HttpResponse res = http.send(req);


        

//         List<String> holidays = new List<String>();
//         if (res.getStatusCode() == 200) {
//             // Parse response and extract holiday dates into the holidays list
//             List<Object> jsonResponse = (List<Object>) JSON.deserializeUntyped(res.getBody());
//             for (Object holidayObj : jsonResponse) {
//                 Map<String, Object> holiday = (Map<String, Object>) holidayObj;
//                 String dateString = (String) holiday.get('date');
//                 holidays.add(dateString);
//             }
//         } else {
//             // Handle error response
//             System.debug('Error: ' + res.getStatusCode() + ' - ' + res.getBody());
//             // You might want to throw an exception or handle the error differently
//         }
// System.debug(holidays);
//         return holidays;
//     }
//     @AuraEnabled(cacheable=true)
//      public static List<Calendar__c> getCalendarData() {
//         Integer currentYear = Date.today().year();
//         return [SELECT Day__c, Months__c, Year__c, Public_Holiday__c FROM Calendar__c WHERE Year__c = :String.valueOf(currentYear)];
//     }
//     @AuraEnabled(cacheable=true)
//          public static List<Calendar__c> GetAllCalendar() {
//         Integer currentYear = Date.today().year();
//         return [SELECT Day__c, Months__c, Year__c, Public_Holiday__c FROM Calendar__c];
//     }
//      @AuraEnabled
//     public static void createEntry(Date dateValue, Boolean isPublicHoliday) {
//         // Add logic to create a new entry in your Calendar Custom Object
//         // Example:
//         // Calendar_Custom_Object__c newEntry = new Calendar_Custom_Object__c();
//         // newEntry.Date__c = dateValue;
//         // newEntry.Public_Holiday__c = isPublicHoliday;
//         // insert newEntry;
//     }

//     @AuraEnabled
//     public static void deleteEntry(String recordId) {
//         // Add logic to delete an entry from your Calendar Custom Object
//         // Example:
//         // Calendar_Custom_Object__c entryToDelete = [SELECT Id FROM Calendar_Custom_Object__c WHERE Id = :recordId LIMIT 1];
//         // delete entryToDelete;
//     }

// }

/**
 * @description       : Class to fetch holidays from an API
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-20-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
public with sharing class CalendarController {
// this function is to call the hooliday api and fetch the holiday date then store them in a map 
@AuraEnabled(cacheable=true)
public static Map<String, String> fetchHolidays(String country) {
    // Extract current year
    Integer currentYear = System.today().year();

    String apiKey = 'hRvsoCeA9aRY7oFU2Ve1Og==qfR1ncNbmcEMeSHp';
    String endpoint = 'https://api.api-ninjas.com/v1/holidays?country=' + country + '&year=' + currentYear;

    HttpRequest req = new HttpRequest();
    req.setEndpoint(endpoint);
    req.setMethod('GET');

    req.setHeader('X-API-KEY', apiKey);

    Http http = new Http();
    HttpResponse res = http.send(req);

    Map<String, String> holidaysMap = new Map<String, String>();
    if (res.getStatusCode() == 200) {
        // Parse response and extract holiday dates and names into the holidaysMap
        List<Object> jsonResponse = (List<Object>) JSON.deserializeUntyped(res.getBody());
        for (Object holidayObj : jsonResponse) {
            Map<String, Object> holiday = (Map<String, Object>) holidayObj;
            String dateString = (String) holiday.get('date');
            String holidayName = (String) holiday.get('name');
            holidaysMap.put(dateString, holidayName);
        }
    } else {
        System.debug('Error: ' + res.getStatusCode() + ' - ' + res.getBody());
    }

    // Ensure to return the holidaysMap
    return holidaysMap;
}
    // @AuraEnabled(cacheable=true)
    //  public static List<Calendar__c> getCalendarData() {
    //     Integer currentYear = Date.today().year();
    //     return [SELECT Day__c, Months__c, Year__c, Public_Holiday__c FROM Calendar__c WHERE Year__c = :String.valueOf(currentYear)];
    // }
    // @AuraEnabled(cacheable=true)
    //      public static List<Calendar__c> GetAllCalendar() {
    //     Integer currentYear = Date.today().year();
    //     return [SELECT Day__c, Months__c, Year__c, Public_Holiday__c FROM Calendar__c];
    //      }



    
    @AuraEnabled(cacheable=true)
    public static List<Calendar__c> getCalendarData(String month, String year) {
        List<Calendar__c> calendarData = new List<Calendar__c>();
        
        // Query calendar records filtering by month and year
        calendarData = [SELECT Id, Name, Day__c, Months__c, Year__c, Public_Holiday__c, Description__c
                        FROM Calendar__c
                        WHERE Months__c = :month AND Year__c = :year];
        system.debug(calendarData);
        return calendarData;
    }

    @AuraEnabled
    public static void deleteCalendarData(List<Id> recordIds) {
        try {
            List<Calendar__c> recordsToDelete = [SELECT Id FROM Calendar__c WHERE Id IN :recordIds];
            delete recordsToDelete;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


@AuraEnabled(cacheable=false)
public static void updateOrCreateDates(String day, Integer month, String year, Boolean isPublicHoliday, String description) {
    try {
        List<Calendar__c> existingRecords = [SELECT Id, Description__c, Public_Holiday__c
                                             FROM Calendar__c
                                             WHERE Day__c = :day
                                             AND Months__c = :String.valueOf(month)
                                             AND Year__c = :year
                                             LIMIT 1];

        if (existingRecords != null && !existingRecords.isEmpty()) {
            // If existing record found, update it
            Calendar__c existingRecord = existingRecords[0];
            existingRecord.Description__c = description;
            existingRecord.Public_Holiday__c = isPublicHoliday;
            update existingRecord;
        } else {
            // If no existing record found, create a new one
            Calendar__c newRecord = new Calendar__c(
                Day__c = day,
                Months__c = String.valueOf(month),
                Year__c = year,
                Description__c = description,
                Public_Holiday__c = isPublicHoliday
            );
            insert newRecord;
        }
    } catch (Exception e) {
        // Handle exception
        System.debug('Error occurred while saving dates: ' + e.getMessage());
        throw e;
    }
}



    // Wrapper class to hold date information
    public class DateWrapper {
        public Integer day;
        public Integer month;
        public Integer year;
        public Boolean isPublicHoliday;
        public String description;
    }
}