import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/checkout/', {timeout: 6000 });
});

test("should display checkout page info", async ({ page }) => {
    
    //check if information page is visible
    const infoForm = await page.waitForSelector("form");
    expect(infoForm).not.toBeNull();

    const app_info = page.locator('.ExpandableText--truncated');
    const subtotal = page.locator('.Text Text-color--default Text-fontSize--14 Text-fontWeight--500');
    const total_due = page.locator('.Text Text-color--default Text-fontSize--14 Text-fontWeight--500');
    const checkout_email = page.frameLocator('iframe[name="embedded-checkout"]').locator('div').filter({ hasText: /^Email$/ })
    const card_tab = page.frameLocator('iframe[name="embedded-checkout"]').getByTestId('card-tab-button')
    const card_input = page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('1234 1234 1234');
    const mmyy_input =page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('MM / YY');
    const cvc_input = page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('CVC');
    const ccName_input = page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('Full name on card');
    const region_input = page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('Country or region');
    const save_info = page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('Securely save my inforamtion');
    const payment_but = page.frameLocator('iframe[name="embedded-checkout"]').getByTestId('hosted-payment-submit-button');

    //check if elemenets are not null
    expect(app_info).not.toBeNull();//appointment info
    expect(subtotal).not.toBeNull();//subtotal info
    expect(total_due).not.toBeNull();//tota info
    expect(checkout_email).not.toBeNull();//email info
    expect(card_tab).not.toBeNull();//choose payment type tab
    expect(card_input).not.toBeNull();//card num input
    expect(mmyy_input).not.toBeNull();//month/year input
    expect(cvc_input).not.toBeNull();//cvc input
    expect(ccName_input).not.toBeNull();//credit card input
    expect(region_input).not.toBeNull();//region input
    expect(save_info).not.toBeNull();//save info input
    expect(payment_but).not.toBeNull();//payment button
    
});

test("make payment", async ({ page }) => {
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
    
    await page.getByRole('button', { name: 'Pay now' }).click();
    await page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('1234 1234 1234').click();
    await page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('1234 1234 1234').fill('4242 4242 4242 4242');
    await page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('MM / YY').click();
    await page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('MM / YY').fill('12 / 30');
    await page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('CVC').click();
    await page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('CVC').fill('123');
    await page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('Full name on card').click();
    await page.frameLocator('iframe[name="embedded-checkout"]').getByPlaceholder('Full name on card').fill('Toshi test');
    await page.frameLocator('iframe[name="embedded-checkout"]').getByLabel('Country or region').selectOption('IE');
    await page.frameLocator('iframe[name="embedded-checkout"]').getByTestId('hosted-payment-submit-button').click();
    await page.getByRole('button', { name: 'Back to Appointments' }).click();

});
