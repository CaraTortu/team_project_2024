import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test('should display login form', async ({ page }) => {
  // Check if the login form is visible
  const loginForm = await page.waitForSelector('form');
  expect(loginForm).not.toBeNull();
  
  // Check if email-address and password input fields are present
  const emailinput = await loginForm.$('input[name="email"]');
  const passwordInput = await loginForm.$('input[name="password"]');
  expect(emailinput).not.toBeNull();
  expect(passwordInput).not.toBeNull();
});
  
test('should login with valid credentials', async ({ page }) => {
  // Fill in the login form with valid credentials
  await page.getByPlaceholder("Email address").fill("john.doe@example.com");
  await page.getByPlaceholder("Password").fill("password");
  
// Submit the form
  await Promise.all([
  await page.getByRole('button', {name: /Sign in/i}).click(),
  page.waitForNavigation(), // Wait for navigation after form submission
  ]);
  
  // Check if login was successful by asserting navigation to the home page or a dashboard
  const currentUrl = page.url();
  expect(currentUrl).toContain('dashboard');
});
  
test('should display error message with invalid credentials', async ({ page }) => {
  // Fill in the login form with invalid credentials
  await page.getByPlaceholder("Email address").fill("johnWrong.doe@example.com");
  await page.getByPlaceholder("Password").fill("wrong_password");
  
  // Submit the form
  await page.getByRole('button', {name: /Sign in/i}).click();
  
  // Wait for the error message to appear
  
  const errorMessage = await page.waitForSelector('div[role="status"]');
  expect(errorMessage).not.toBeNull();
  expect(await errorMessage.textContent()).toContain('Invalid email or password');
  });
  