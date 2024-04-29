public with sharing class GetRoleIdByName {
    public static Id getRoleIdByName(String roleName) {
        Id roleId;
        List<UserRole> roles = [SELECT Id FROM UserRole WHERE Name = :roleName LIMIT 1];
        if (!roles.isEmpty()) {
            roleId = roles[0].Id;
        }
        return roleId;
    }
}