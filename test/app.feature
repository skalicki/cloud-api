Feature: App feature

  Scenario: Successful API request
    Given I send a GET request to "/"
    Then I receive a 200 status code and the message "Hello World!"