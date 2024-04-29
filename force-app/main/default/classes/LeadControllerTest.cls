@isTest
private class LeadControllerTest {

    @isTest
    static void testCreateLead() {
        // Prepare test data (simulate form submission)
        Map<String, String> leadData = new Map<String, String>{
            'first_name' => 'Test',
            'last_name' => 'Lead',
            'email' => 'test@example.com',
            'phone' => '1234567890',
            'company' => 'Test Company',
            'company_email' => 'company@test.com',
            'company_phone' => '0987654321',
            'job_title' => 'President, CEO, Vice President'
        };

        // Call the method to create a lead
        Test.startTest();
        Id leadId = LeadController.createLead(leadData);
        Test.stopTest();

        // Retrieve the lead and verify its fields
        Lead createdLead = [SELECT Id, FirstName, LastName, Email, Phone, Company, Company_Email__c, CompanyPhone__c, Job_Title__c FROM Lead WHERE Id = :leadId];
        System.assertEquals('Test', createdLead.FirstName);
        System.assertEquals('Lead', createdLead.LastName);
        System.assertEquals('test@example.com', createdLead.Email);
        System.assertEquals('1234567890', createdLead.Phone);
        System.assertEquals('Test Company', createdLead.Company);
        System.assertEquals('company@test.com', createdLead.Company_Email__c);
        System.assertEquals('0987654321', createdLead.CompanyPhone__c);
        System.assertEquals('President, CEO, Vice President', createdLead.Job_Title__c);
    }
}