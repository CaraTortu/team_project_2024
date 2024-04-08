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
    await page.goto("/dashboard/schedule", { timeout: 5000 });
});

test("should display my schedule page with relevant info", async ({ page }) => {
    //check if information page is visible
    await page.goto("/dashboard/schedule", { timeout: 5000 });
    const scheduleForm = await page.waitForSelector("form");
    expect(scheduleForm).not.toBeNull();

    
    const info_bar = page.locator('.my-2.flex.flex-col.rounded-lg.bg-gray-100.p-2.hover:cursor-pointer');
    
    const info_PatN= page.locator('span.text-sm text-gray-600');
    const info_PatID= page.locator('.text-sm text-gray-600');
    const info_PatProb= page.locator('.text-sm text-gray-600');

    // Checks for element
    expect(info_bar).not.toBeNull();
    expect(info_PatN).not.toBeNull();
    expect(info_PatID).not.toBeNull();
    expect(info_PatProb).not.toBeNull();
});

test("go to schedule page", async ({ page }) => {

    await page.waitForTimeout(2000);
});
