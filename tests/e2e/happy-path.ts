import { chromium } from "playwright";

async function runHappyPath() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
    });

    try {
        // Step 1: Welcome page
        console.log("Step 1: Loading Welcome page");
        await page.goto("http://localhost:5174/");
        await page.waitForLoadState("networkidle");
        await expect(page.locator("h1")).toContainText("Nova X AI");
        await expect(page.locator("button.primary")).toContainText("Continue");

        // Step 2: Navigate to Home
        console.log("Step 2: Navigating to Home");
        await page.click("button.primary");
        await page.waitForURL("**/home");
        await expect(page.locator("h1")).toContainText("Nova X AI");

        // Step 3: Navigate to Character Creation
        console.log("Step 3: Navigating to Character Creation");
        await page.click("text=+ New Character");
        await page.waitForURL("**/characters/create");
        await expect(page.locator("h1")).toContainText("Create Character");

        // Step 4: Create a character
        console.log("Step 4: Creating character");
        await page.fill('input[id="name"]', "Test Hero");
        await page.fill('textarea[id="description"]', "A brave test character");
        await page.click('button[type="submit"]');
        await page.waitForURL("**/characters/**");
        await expect(page.locator("h1")).toContainText("Test Hero");

        // Step 5: Generate images
        console.log("Step 5: Generating images");
        await page.fill('input[type="text"]', "a beautiful sunset over mountains");
        await page.click("text=Generate");
        await page.waitForSelector(".candidate-grid", { timeout: 60000 });

        // Step 6: Verify candidates
        console.log("Step 6: Verifying candidates");
        const candidates = page.locator(".candidate");
        const count = await candidates.count();
        console.log(`Generated ${count} candidates`);
        expect(count).toBeGreaterThan(0);

        // Step 7: Select a candidate
        console.log("Step 7: Selecting candidate");
        await candidates.first().locator("button.select-btn").click();
        await expect(page.locator(".candidate.selected").first()).toBeVisible();

        // Step 8: Set as primary avatar
        console.log("Step 8: Setting primary avatar");
        await page.click("text=Set as Avatar");
        await expect(page.locator(".current-avatar img")).toBeVisible();

        // Step 9: Navigate back to Home
        console.log("Step 9: Returning to Home");
        await page.click("text=← Back");
        await page.waitForURL("**/home");
        await expect(page.locator(".character-card").first()).toContainText("Test Hero");

        // Step 10: Reopen character and verify avatar
        console.log("Step 10: Reopening character");
        await page.locator(".character-card").first().click();
        await page.waitForURL("**/characters/**");
        await expect(page.locator(".current-avatar img")).toBeVisible();

        // Step 11: Open Gallery
        console.log("Step 11: Opening Gallery");
        await page.click("text=Gallery");
        await page.waitForURL("**/gallery");
        await expect(page.locator(".gallery-card").first()).toBeVisible();

        // Step 12: Favorite an image
        console.log("Step 12: Favoriting image");
        await page.locator(".gallery-card").first().click();
        await page.waitForSelector(".modal-overlay");
        await page.click("text=Favorite");

        // Step 13: Delete non-primary image
        console.log("Step 13: Deleting image");
        await page.click("text=Delete");
        await page.waitForSelector(".modal-overlay", { state: "hidden" });

        // Step 14: Return to character and verify avatar
        console.log("Step 14: Verifying persistence");
        await page.goto("http://localhost:5174/home");
        await page.waitForURL("**/home");
        await page.locator(".character-card").first().click();
        await page.waitForURL("**/characters/**");
        await expect(page.locator(".current-avatar img")).toBeVisible();

        console.log("Happy Path PASSED");
    } catch (err) {
        console.error("Happy Path FAILED:", err);
        await page.screenshot({ path: "C:/Users/Ahmed/AppData/Local/Temp/kilo/happy-path-failure.png" });
        throw err;
    } finally {
        await browser.close();
    }
}

async function expect(locator: any) {
    return locator;
}

expect.prototype.toContainText = async function (text: string) {
    const locator = this as any;
    const content = await locator.textContent();
    if (!content?.includes(text)) {
        throw new Error(`Expected "${text}" but got "${content}"`);
    }
};

expect.prototype.toBeVisible = async function () {
    const locator = this as any;
    await locator.waitFor({ state: "visible" });
};

runHappyPath().catch((err) => {
    console.error(err);
    process.exit(1);
});
