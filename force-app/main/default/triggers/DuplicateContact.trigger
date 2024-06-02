/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-14-2024
 * @last modified by  : Mohamed Ben Rhouma
**/

// This trigger is to prevent duplicate Contact  based on Email Field

trigger DuplicateContact on Contact (before insert, before update, after undelete) {
    List<Contact> contactList = new List<Contact>();
    Set<String> newEmailSet = new Set<String>();
    Set<String> existingEmailSet = new Set<String>();
    
    if ((Trigger.isBefore && (Trigger.isInsert || Trigger.isUpdate)) || (Trigger.isAfter && Trigger.isUndelete)) {
        if (Trigger.isUpdate) {

            for (Contact con : Trigger.new) {
                if (con.Id == null) {
                    contactList.add(con);
                }
            }
        } else {
            contactList = Trigger.new;
        }
        
        for (Contact con : contactList) {
            if (con.Email != null) {
                newEmailSet.add(con.Email);
            }
        }
        
        List<Contact> existingContactList = [SELECT Id, Email FROM Contact WHERE Email IN :newEmailSet AND Email != null];
        
        for (Contact con : existingContactList) {
            existingEmailSet.add(con.Email);
        }
        
        for (Contact con : contactList) {
            if (existingEmailSet.contains(con.Email) && con.Id == null) {
                con.Email.addError('Duplicate Email is not Allowed');
            } else {
                existingEmailSet.add(con.Email);
            }
        }
    }
}