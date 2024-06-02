/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-12-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class UserUtilities {
    @future
    public static void InsertUser(String a, String em, String lname, Id Idp, Id IdR, String uname) {
        User u = new User(
            Alias = a,
            Email = em,
            EmailEncodingKey = 'UTF-8',
            LastName = lname,
            LanguageLocaleKey = 'en_US',
            ProfileId = Idp,
            UserRoleId = IdR,
            TimeZoneSidKey = 'Africa/Tunis',
            Username = uname
        );
        Insert u;
    }
}