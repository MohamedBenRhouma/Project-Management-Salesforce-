/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 05-02-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
trigger employeeDirectoryController on Employee_Directory__c (before insert, before update) {
    public void createUser(List<Employee_Directory__c> newEmployeeDirectories) {
    //     List<User> usersToInsert = new List<User>();
    //     for (Employee_Directory__c newEmployeeDirectory : newEmployeeDirectories) {
    //         String selectedRole = newEmployeeDirectory.Employee_Role__c;
    //         String selectedProfile = newEmployeeDirectory.Profile__c;

    //         // Assuming GetRoleIdByNamee class exists with a method getRoleIdByName(String roleName)
    //         // GetRoleIdByNamee roleNameGetter = new GetRoleIdByNamee();
    //         // Id roleId = roleNameGetter.getRoleIdByName(selectedRole);

    //         // Assuming GetProfileIdByName class exists with a method getProfileIdByName(String profileName)
    //         // GetProfileIdByName profileIdGetter = new GetProfileIdByName();
    //         // Id profileId = profileIdGetter.getProfileIdByName(selectedProfile);

    //         String alias = newEmployeeDirectory.Alias__c;
    //         String email = newEmployeeDirectory.Email__c;
    //         String lname = newEmployeeDirectory.Name;
    //         String uname = newEmployeeDirectory.Username__c;

    //         UserUtilities.InsertUser(alias, email, lname, profileId, roleId, uname);
    //     }
    // }
}
}