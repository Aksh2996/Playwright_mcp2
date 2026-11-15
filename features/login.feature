@login
Feature: EventHub login
  As a registered EventHub user
  I want to sign in
  So that I can access EventHub

  Scenario: Sign in with configured credentials
    Given I navigate to the EventHub login page at "https://eventhub.rahulshettyacademy.com/login"
    When I enter the configured EventHub credentials
    And I click the "Sign In" button
