trigger PreventDuplicateAccount on Account (before insert) {
    Set<String> existingEmails = new Set<String>();

    for (Account existingAccount : [SELECT Email__c FROM Account WHERE Email__c != null]) {
        existingEmails.add(existingAccount.Email__c.toLowerCase()); 
    }

    for (Account newAccount : Trigger.new) {
        if (newAccount.Email__c != null && existingEmails.contains(newAccount.Email__c.toLowerCase())) {
            newAccount.addError('An Account with this email already exists.');
        }
    }
}