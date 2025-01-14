Feature: File

  Scenario: Uploading a file successfully
    Given I send a POST request to "/file/upload" with the file "example.txt"
    Then the server should respond with a 201 status code
    And the server response should contain the message "Upload successful"

  Scenario: No file uploaded
    Given I send a POST request to "/file/upload" without a file
    Then the server should respond with a 400 status code
    And the server response should contain the message "No file uploaded"
