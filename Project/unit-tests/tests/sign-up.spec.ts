import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/register');
});

test('should display sign-up form', async ({ page }) => {
  // Check if the sign-up form is visible
  const signupForm = await page.waitForSelector('form');
  expect(signupForm).not.toBeNull();

  // Check if all required input fields are present
  const titleInput = await signupForm.$('select');
  const firstNameInput = await signupForm.$('input[name="firstName"]');
  const surnameInput = await signupForm.$('input[name="surname"]');
  const emailInput = await signupForm.$('input[name="email"]');
  const passwordInput = await signupForm.$('input[name="password"]');
  const confirmPasswordInput = await signupForm.$('input[name="confirmPassword"]');

  expect(titleInput).not.toBeNull();
  expect(firstNameInput).not.toBeNull();
  expect(surnameInput).not.toBeNull();
  expect(emailInput).not.toBeNull();
  expect(passwordInput).not.toBeNull();
  expect(confirmPasswordInput).not.toBeNull();
});

test('should sign up with valid information', async ({ page }) => {
  // Fill in the sign-up form with valid information
  await page.locator("select").selectOption("Mr");
  await page.getByPlaceholder("First Name").fill("John");
  await page.getByPlaceholder("Surname").fill("Doe");
  await page.getByPlaceholder("Email address").fill("john.doe@example.com");
  await page.getByPlaceholder("Create password").fill("password");
  await page.getByPlaceholder("Enter password again").fill("password");

  // Submit the form
  await page.getByRole('button', {name: /Register/i}).click();
  
  // Wait for navigation after form submission

  //i could be wrong with this as this click the link but without there will be a timeout
  //with the waitForURL function but with it will give an error "TypeError: Response body object should not be disturbed or locked"
  await page.getByText('Log in now!').click();
  await page.waitForURL(/(.*)login(.*)$/, { timeout: 15000}); 
  //await page.waitForURL("/login", {timeout: 15000});
  //await page.waitForURL(/login/, { timeout: 10000});

  // Check if sign-up was successful by asserting navigation to the home page or a confirmation page
  const currentUrl = page.url();
  expect(currentUrl).toContain('/login'); // Adjust to match the expected URL after successful sign-up
});

test('should display error message with invalid information', async ({ page }) => {
  // Fill in the sign-up form with invalid information (e.g., mismatched passwords)
  await page.locator("select").selectOption("Mr");
  await page.getByPlaceholder("First Name").fill("James");
  await page.getByPlaceholder("Surname").fill("Moriarity");
  await page.getByPlaceholder("Email address").fill("james.mo@example.com");
  await page.getByPlaceholder("Create password").fill("password");
  await page.getByPlaceholder("Enter password again").fill("wrong-password");

  // Submit the form
  await page.getByRole('button', {name: /Register/i}).click();

  // Wait for the error message to appear
  const errorMessage = await page.waitForSelector('div[role="status"]');
  expect(errorMessage).not.toBeNull();
  expect(await errorMessage.textContent()).toContain('Passwords do not match');
});
