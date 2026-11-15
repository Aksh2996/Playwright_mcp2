@test1
Feature: Playwright documentation website
  As a visitor
  I want to browse the Playwright documentation
  So that I can find information about using Playwright

  Background:
    Given I open the Playwright homepage

  Scenario: The homepage has a Playwright title
    Then the page title should contain "Playwright"

  Scenario: Open the getting started guide
    When I follow the "Get started" link
    Then I should see the "Installation" heading
