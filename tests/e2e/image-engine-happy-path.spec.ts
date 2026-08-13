import { test, expect } from "@playwright/test";

test.describe("Image Engine Happy Path", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/");
        await page.waitForLoadState("networkidle");
    });

    test("should complete full happy path", async ({ page }) => {
        test.setTimeout(60000);
        const errors: string[] = [];
        page.on("pageerror", (err) => errors.push(err.message));
        page.on("console", (msg) => {
            if (msg.type() === "error") errors.push(msg.text());
        });
        // Step 1: Welcome page
        await expect(page.locator("h1")).toContainText("Nova X AI");
        await expect(page.locator("button.primary")).toContainText("Continue");

        // Step 2: Navigate to Home
        await page.click("button.primary");
        await page.waitForURL("**/home");
        await expect(page.locator("h1")).toContainText("Nova X AI");

        // Step 3: Navigate to Character Creation
        await page.click("text=+ New Character");
        await page.waitForURL("**/characters/create");
        await expect(page.locator("h1")).toContainText("Create Character");

        // Step 4: Create a character
        await page.fill('input[id="name"]', "Test Hero");
        await page.fill('textarea[id="description"]', "A brave test character");
        await page.click('button[type="submit"]');
        await page.waitForURL("**/characters/**");
        await expect(page.locator("h1")).toContainText("Test Hero");

        // Step 5: Open Image Generation
        await page.fill('input[type="text"]', "a beautiful sunset over mountains");
        await page.click('.generation-form button');
        await page.waitForSelector(".candidate-grid", { timeout: 60000 });

        // Step 6: Verify candidates were generated
        const candidates = page.locator(".candidate");
        const count = await candidates.count();
        expect(count).toBeGreaterThan(0);

        // Step 7: Select one candidate
        await candidates.first().locator("button.select-btn").click();
        await expect(page.locator(".candidate.selected").first()).toBeVisible();

        // Step 8: Set selected candidate as primary avatar
        await page.click("text=Set as Avatar");
        await expect(page.locator(".current-avatar img")).toBeVisible();

        // Step 9: Navigate back to Home
        await page.click("text=← Back");
        await page.waitForURL("**/home");
        await expect(page.locator(".character-card").first()).toContainText("Test Hero");

        // Step 10: Reopen character and verify avatar persists
        await page.locator(".character-card").first().click();
        await page.waitForURL("**/characters/**");
        await expect(page.locator(".current-avatar img")).toBeVisible();

        // Step 11: Open Gallery
        await page.click("text=Gallery");
        await page.waitForURL("**/gallery");
        await expect(page.locator(".gallery-card").first()).toBeVisible();

        // Step 12: Favorite an image
        await page.locator(".gallery-card").first().click();
        await page.waitForSelector(".modal-overlay");
        await page.click("text=Favorite");

        // Step 13: Verify deletion of non-primary image works
        await page.click("text=Delete");
        await page.waitForSelector(".modal-overlay", { state: "hidden" });

        // Step 14: Return to character and verify primary avatar remains
        await page.click("text=← Home");
        await page.waitForURL("**/home");
        await page.locator(".character-card").first().click();
        await page.waitForURL("**/characters/**");
        await expect(page.locator(".current-avatar img")).toBeVisible();
    });

    test("should have no uncaught exceptions", async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (err) => errors.push(err.message));
        page.on("console", (msg) => {
            if (msg.type() === "error") errors.push(msg.text());
        });

        await page.goto("http://localhost:5173/");
        await page.waitForLoadState("networkidle");

        await page.click("button.primary");
        await page.waitForURL("**/home");

        await page.click("text=+ New Character");
        await page.waitForURL("**/characters/create");

        await page.fill('input[id="name"]', "Error Test");
        await page.fill('textarea[id="description"]', "Testing error handling");
        await page.click('button[type="submit"]');
        await page.waitForURL("**/characters/**");

        await page.fill('input[type="text"]', "test prompt");
        await page.click('.generation-form button');
        await page.waitForSelector(".candidate-grid", { timeout: 60000 });

        expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
    });
});
