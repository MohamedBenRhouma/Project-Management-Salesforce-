/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-12-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
// public with sharing class GetProfileIdByName {
//     public Id getProfileIdByName(String profileName) {
//         Id profileId;
        
//         List<Profile> profiles = [SELECT Id FROM Profile WHERE Name = :profileName LIMIT 1];
//         if (!profiles.isEmpty()) {
//             profileId = profiles[0].Id;
//         }
        
//         return profileId;
//     }
// }

public with sharing class GetProfileIdByName {
    @InvocableMethod(label='Get Profile ID by Name' description='Get the ID of a Profile based on its Name')
    public static List<Id> getProfileIdByName(List<String> profileNames) {
        List<Id> profileIds = new List<Id>();
        
        for (String profileName : profileNames) {
            Id profileId;
            List<Profile> profiles = [SELECT Id FROM Profile WHERE Name = :profileName LIMIT 1];
            if (!profiles.isEmpty()) {
                profileId = profiles[0].Id;
            }
            profileIds.add(profileId);
        }
        
        return profileIds;
    }
}