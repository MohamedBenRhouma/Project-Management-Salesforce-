/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-02-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
// public with sharing class GetRoleIdByName {
//     public static Id getRoleIdByName(String roleName) {
//         Id roleId;
//         List<UserRole> roles = [SELECT Id FROM UserRole WHERE Name = :roleName LIMIT 1];
//         if (!roles.isEmpty()) {
//             roleId = roles[0].Id;
//         }
//         return roleId;
//     }
// }