/**
 * @description       : 
 * @author            : Mohamed Ben Rhouma
 * @group             : 
 * @last modified on  : 05-19-2024
 * @last modified by  : Mohamed Ben Rhouma
**/
public with sharing class RessourceController {
      @AuraEnabled(cacheable=true)
    
      
      
       public static List<Employee_Directory__c> getRessources() {
      
     
            return [SELECT Id, 	FullName__c, Email__c,Employee_Role__c,	Ressource_Type__c FROM Employee_Directory__c WHERE Department__r.Name = 'Salesforce' ];
        
    }

  


        @AuraEnabled(cacheable=true)
        public static List<Employee_Directory__c> SearchRessource(String searchKey) {
            String searchTerm = '%' + searchKey + '%'; // Ajoute des wildcards pour rechercher des correspondances partielles
          return [SELECT Id, 	FullName__c, Email__c,Employee_Role__c,	Ressource_Type__c FROM Employee_Directory__c
                    WHERE FullName__c LIKE :searchTerm and Department__r.Name = 'Salesforce'  ];
        }

       
    }