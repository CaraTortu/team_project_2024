import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/book-appointment", { timeout: 5000 });
});

test("should display booking appointment", async ({ page }) => {
    //check if booking form is visible
    const bookingForm = await page.waitForSelector("form");
    expect(bookingForm).not.toBeNull();

    //check if required button and input fields are there
    const check_marker = page.locator('.marker');
    const sel_clinic = page.getByRole('button', {name: 'select this clinic'});
    
    const date_locale = page.locator('.mb-8.flex.items-center.justify-between.gap-2');
    const time_locale = page.locator('.flex.max-w-fit.flex-grow.flex-col.gap-2');
    
    const sel_issue = page.getByPlaceholder('Describe the issue here');
    const sel_appoint = page.getByRole('button', {name: 'Select this appointment'});

    // Check if elements are present
    expect(check_marker).not.toBeNull();
    expect(sel_clinic).not.toBeNull();

    expect(date_locale).not.toBeNull();

    expect(time_locale).not.toBeNull();
    
    expect(sel_issue).not.toBeNull();
    expect(sel_appoint).not.toBeNull();
});

test("booking appointment and cancelling as if it were a user", async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator('input[name="email"]').fill("user@example.com");
    await page.locator('input[name="password"]').fill("password");
    
    // Submit the form
    await Promise.all([
        await page.getByRole("button", { name: /Sign in/i }).click(),
        page.waitForURL("/dashboard/upcoming", { timeout: 5000 }), // Wait for navigation after form submission
    ]);
    await page.waitForTimeout(2000);
    
    //simulate user by clicking 
    await page.getByRole('link', { name: 'Book an appointment' }).click();
    
    await page.locator('.leaflet-marker-icon').first().click(); 
    await page.getByRole('button', { name: 'Select this clinic' }).click();

    let selectedEnabledDate = false;

    while (!selectedEnabledDate) {
        // Date selection
        const date_locale = page.locator('.mb-8.flex.items-center.justify-between.gap-2');
        const date_button = date_locale.locator('button');
        const date_count = await date_button.count();
  
        // Randomly select and click an enabled date button
        let foundEnabledDateButton = false;
        while (!foundEnabledDateButton) {
            const randomIn = Math.floor(Math.random() * date_count);
            const isEnabled = await date_button.nth(randomIn).isEnabled();

            if (isEnabled) {
                await date_button.nth(randomIn).click();
                foundEnabledDateButton = true;
            selectedEnabledDate = true; 
            break;    
        }
        }
  
        await page.waitForTimeout(2000);
  
        // Time selection
        const time_locale = page.locator('.flex.max-w-fit.flex-grow.flex-col.gap-2');
        const time_button = time_locale.locator('button');
        const time_count = await time_button.count();
  
        // Track if any enabled time button was clicked
        let clickedEnabledTimeButton = false;
  
        for (let i = 0; i < time_count; i++) {
            const isEnabled = await time_button.nth(i).isEnabled();

            if (isEnabled) {
                await time_button.nth(i).click();
                clickedEnabledTimeButton = true;
                break;
            }
        }
  
        // If no enabled time button was found, retry date selection
        if (!clickedEnabledTimeButton) {
            selectedEnabledDate = false; // Reset tracking for next iteration
        }
    }
  
    // Additional waiting time (optional, adjust as needed)
    await page.waitForTimeout(2000);

    await page.getByPlaceholder('Describe the issue here').click();
    await page.getByPlaceholder('Describe the issue here').fill('coughing');


    //submit the booking
    await page.getByRole('button', { name: 'Select This Appointment' }).click();
    await page.waitForTimeout(5000);
    
    //cancels the booking
    await page.getByRole('link', { name: 'My appointments' }).click();
    await page.getByRole("button", { name: "Cancel" }).first().click();
    console.log("Cancelled booking");
});


test("see past appointments as if it were a user", async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator('input[name="email"]').fill("user@example.com");
    await page.locator('input[name="password"]').fill("password");
    // Submit the form
    await Promise.all([
        await page.getByRole("button", { name: /Sign in/i }).click(),
        page.waitForURL("/dashboard/upcoming", { timeout: 5000 }), // Wait for navigation after form submission
    ]);
    await page.waitForTimeout(2000);

    await page.getByRole('combobox').selectOption('past');
});


