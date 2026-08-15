import { test, expect } from "@playwright/test";

test.describe("Focused Integration Checkpoint", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/");
        await page.waitForLoadState("networkidle");
    });

    test("character create -> generate image -> gallery -> chat flow", async ({ page }) => {
        test.setTimeout(180000);
        const errors: string[] = [];
        page.on("pageerror", (err) => errors.push(err.message));
        page.on("console", (msg) => {
            if (msg.type() === "error") errors.push(msg.text());
        });

        // Step 1: Welcome -> Home
        await expect(page.locator("h1")).toContainText("Nova X AI");
        await page.click("button.primary");
        await page.waitForURL("**/home");
        await expect(page.locator("h1")).toContainText("Nova X AI");

        // Step 2: Home -> Character Create
        await page.click('button:has-text("+ New Character")');
        await page.waitForURL("**/characters/create");
        await expect(page.locator("h1")).toContainText("Create Character");

        // Step 3: Fill identity
        await page.fill('input[id="name"]', "Test Hero");
        await page.fill('textarea[id="description"]', "A brave test character");
        await page.click('button.primary:has-text("Next")');
        await page.waitForTimeout(500);

        // Step 4: Select appearance
        await page.locator('label:has-text("Body Type")').locator('..').locator('button:has-text("Athletic")').click();
        await page.locator('label:has-text("Hair Color")').locator('..').getByRole('button', { name: 'Brown', exact: true }).click();
        await page.click('button.primary:has-text("Next")');
        await page.waitForTimeout(500);

        // Step 5: Select personality trait
        await page.locator('.trait-grid button:has-text("Loyal")').click();
        await page.click('button.primary:has-text("Next")');
        await page.waitForTimeout(500);

        // Step 6: Review -> proceed to generation
        await page.click('button.primary:has-text("Next")');
        await page.waitForTimeout(500);

        // Step 7: Generate avatars
        await page.click('button:has-text("Generate Avatars")');
        await page.waitForSelector(".candidate-grid", { timeout: 60000 });

        // Verify candidates have real URIs
        const candidateImages = page.locator(".candidate-card img");
        const count = await candidateImages.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const src = await candidateImages.nth(i).getAttribute("src");
            expect(src).not.toBeNull();
            expect(src).not.toContain("placeholder");
        }

        // Step 8: Select candidate
        await page.locator(".candidate-card").first().click();
        await page.click('button:has-text("Confirm Selection")');
        await page.waitForTimeout(500);

        // Step 9: Save character
        await page.click('button:has-text("Save Character")');
        await page.waitForURL((url) => url.pathname.startsWith('/characters/') && !url.pathname.includes('/create'));
        await page.waitForSelector("text=Test Hero", { timeout: 10000 });
        await expect(page.locator("h1")).toContainText("Test Hero");

        // Step 10: Open Gallery
        await page.click("text=Gallery");
        await page.waitForURL("**/gallery");
        await expect(page.locator(".gallery-card").first()).toBeVisible();
        const gallerySrc = await page.locator(".gallery-card img").first().getAttribute("src");
        expect(gallerySrc).not.toContain("placeholder");

        // Step 11: Preview modal
        await page.locator(".gallery-card").first().click();
        await page.waitForSelector(".modal-overlay");
        const modalSrc = await page.locator(".modal img").getAttribute("src");
        expect(modalSrc).not.toContain("placeholder");

        // Step 12: Close modal and go Home
        await page.click(".close-btn");
        await page.waitForSelector(".modal-overlay", { state: "hidden" });
        await page.click("text=← Home");
        await page.waitForURL("**/home");
        const homeAvatarSrc = await page.locator(".character-card .character-avatar img").first().getAttribute("src");
        expect(homeAvatarSrc).not.toContain("placeholder");

        // Step 13: Start Chat
        await page.locator(".character-card").first().click();
        await page.waitForURL("**/characters/**");
        await page.click("text=Start Chat");
        await page.waitForURL("**/chat*");
        await expect(page.locator("h1")).toContainText("Chat");
        await expect(page.locator(".chat-container")).toBeVisible();

        // Step 14: Send message
        await page.fill(".chat-input-bar input", "Hello, character!");
        await page.click(".chat-input-bar button");
        await page.waitForSelector(".chat-message.user .message-bubble", { timeout: 10000 });
        await expect(page.locator(".chat-message.user .message-bubble")).toContainText("Hello, character!");

        // Verify no uncaught errors
        const significantErrors = errors.filter((e) => !e.includes("favicon") && !e.includes("ERR_UNKNOWN_URL_SCHEME"));
        expect(significantErrors).toHaveLength(0);
    });
});
