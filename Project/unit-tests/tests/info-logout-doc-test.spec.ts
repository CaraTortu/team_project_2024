import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
        // Login first
    await page.goto('/login');
    await page.locator('input[name="email"]').fill("doctor@example.com");
    await page.locator('input[name="password"]').fill("password");
    // Submit the form
    await Promise.all([
        await page.getByRole("button", { name: /Sign in/i }).click(),
        page.waitForURL("/dashboard/schedule", { timeout: 5000 }), // Wait for navigation after form submission
    ]);
    await page.waitForTimeout(2000);
    await page.goto("/dashboard/my-info", { timeout: 5000 });

});

test("should display my info page with relevant info", async ({ page }) => {
    //check if information page is visible
    const infoForm = await page.waitForSelector("form");
    expect(infoForm).not.toBeNull();

    const info_name = page.locator('.mt-1.rounded.bg-gray-100.p-2'); //checks the div for info
    const info_email = page.locator('.mt-1.rounded.bg-gray-100.p-2'); 
    const info_id = page.locator('.mt-1.rounded.bg-gray-100.p-2'); 

    // checks for element
    expect(info_name).not.toBeNull();
    expect(info_email).not.toBeNull();
    expect(info_id).not.toBeNull();
});

test("go to information page as a doctor", async ({ page }) => {
    await page.getByRole('link', { name: 'My account' }).click();
});

test("should logout as a user", async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator('input[name="email"]').fill("doctor@example.com");
    await page.locator('input[name="password"]').fill("password");
    // Submit the form
    await Promise.all([
        await page.getByRole("button", { name: /Sign in/i }).click(),
        page.waitForURL("/dashboard/schedule", { timeout: 5000 }), // Wait for navigation after form submission
    ]);
    await page.waitForTimeout(2000);

    page.getByRole('button', { name: 'Sign out' })
});