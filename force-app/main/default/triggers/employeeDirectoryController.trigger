/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-12-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
trigger employeeDirectoryController on Employee_Directory__c (before insert,before update) {
    public void createUser(List<Employee_Directory__c> newEmployeeDirectories) {
        List<User> usersToInsert = new List<User>();
        for (Employee_Directory__c newEmployeeDirectory : newEmployeeDirectories) {
            String selectedRole = newEmployeeDirectory.Employee_Role__c;
            String selectedProfile = newEmployeeDirectory.Profile__c;
            
            GetRoleIdByNamee roleName = new GetRoleIdByNamee();

            Id roleId = roleName.getRoleIdByNamee(selectedRole);
            
            GetProfileIdByName profileIdGetter = new GetProfileIdByName();
            Id profileId = profileIdGetter.getProfileIdByName(selectedProfile);
            
            String alias = newEmployeeDirectory.Alias__c;
            String email = newEmployeeDirectory.Email__c;
            String lname = newEmployeeDirectory.Name;
            String uname = newEmployeeDirectory.Username__c;

            UserUtilities.InsertUser(alias,email,lname,profileId,roleId,uname);
            

        }
    }
}
