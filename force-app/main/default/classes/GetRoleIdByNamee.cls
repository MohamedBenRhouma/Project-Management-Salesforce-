/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 05-02-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
// public with sharing class GetRoleIdByNamee {
//     public Id getRoleIdByNamee(String roleName) {
//         Id roleId;
        
//         List<UserRole> roles = [SELECT Id FROM UserRole WHERE Name = :roleName LIMIT 1];
//         if (!roles.isEmpty()) {
//             roleId = roles[0].Id;
//         }
        
//         return roleId;
//     }
// }
public with sharing class GetRoleIdByNamee {
    @InvocableMethod(label='Get Role ID by Name' description='Get the ID of a Role based on its Name')
    public static List<Id> getRoleIdByName(List<String> roleNames) {
        List<Id> roleIds = new List<Id>();
        
        for (String roleName : roleNames) {
            Id roleId;
            List<UserRole> roles = [SELECT Id FROM UserRole WHERE Name = :roleName LIMIT 1];
            if (!roles.isEmpty()) {
                roleId = roles[0].Id;
            }
            roleIds.add(roleId);
        }
        
        return roleIds;
    }
}