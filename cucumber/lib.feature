Feature: Running Cucumber with Protractor
  As a user of Protractor
  I should be able to use Cucumber
  to run my E2E tests

  Scenario: Test Railway Booking
    Given I go on "http://railway.hinet.net/ctno1.htm"
    Given user id "A123456789"
    Given from "146"
    Given to "098"
    Given getin date from config
    Given train number "280"
    Given quantity "1"
    When I submit the data 
    Then I will get the cookie "JSESSIONID" 
    #Then I get the cookie "NSC_BQQMF"
    Given I try to get the random image
    Then I get the recognized number
    When I book the ticket with recognized number
    Then I check the result

  @dev
  Scenario: Open google
    Given I go on "https://www.google.com.tw"
    Then I check the header
    
