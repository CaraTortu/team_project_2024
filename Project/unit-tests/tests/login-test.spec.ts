import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/login", { timeout: 5000 });
});

test("should display login form", async ({ page }) => {
    // Check if the login form is visible
    const loginForm = await page.waitForSelector("form");
    expect(loginForm).not.toBeNull();

    const email_input = page.locator('input[name="email"]');
    const password_input = page.locator('input[name="password"]');

    // Check if email-address and password input fields are present
    expect(email_input).not.toBeNull();
    expect(password_input).not.toBeNull();
});

test("should login with valid credentials", async ({ page }) => {
    await page.locator('input[name="email"]').fill("user@example.com");
    await page.locator('input[name="password"]').fill("password");

    // Submit the form
    await Promise.all([
        await page.getByRole("button", { name: /Sign in/i }).click(),
        page.waitForURL("/dashboard/upcoming", { timeout: 5000 }), // Wait for navigation after form submission
    ]);
});

test("should display error message with invalid credentials", async ({
    page,
}) => {
    await page.locator('input[name="email"]').fill("user@example.com");
    await page.locator('input[name="password"]').fill("incorrect");

    // Submit the form
    await page.getByRole("button", { name: /Sign in/i }).click();

    // Wait for the error message to appear
    const errorMessage = page.locator('div[role="status"]');

    expect(errorMessage).not.toBeNull();

    expect(await errorMessage.textContent()).toContain(
        "Invalid email or password",
    );
});
