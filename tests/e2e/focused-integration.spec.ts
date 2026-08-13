import { test, expect } from "@playwright/test";

test.describe("Focused Integration Checkpoint", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/");
        await page.waitForLoadState("networkidle");
    });

    test("character create -> generate image -> gallery -> chat flow", async ({ page }) => {
        test.setTimeout(120000);
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

        // Step 3: Create character
        await page.fill('input[id="name"]', "Test Hero");
        await page.fill('textarea[id="description"]', "A brave test character");
        await page.click('button[type="submit"]');
        await page.waitForURL("**/characters/**");
        await expect(page.locator("h1")).toContainText("Test Hero");

        // Step 4: Generate image
        await page.fill('input[type="text"]', "a beautiful sunset over mountains");
        await page.click(".generation-form button");
        await page.waitForSelector(".candidate-grid", { timeout: 60000 });

        // Verify candidates have real URIs
        const candidateImages = page.locator(".candidate img");
        const count = await candidateImages.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const src = await candidateImages.nth(i).getAttribute("src");
            expect(src).not.toBeNull();
            expect(src).not.toContain("placeholder");
        }

        // Step 5: Select candidate
        await page.locator(".candidate").first().locator("button.select-btn").click();
        await expect(page.locator(".candidate.selected").first()).toBeVisible();

        // Step 6: Set as avatar
        await page.click("text=Set as Avatar");
        await expect(page.locator(".current-avatar img")).toBeVisible();
        const avatarSrc = await page.locator(".current-avatar img").getAttribute("src");
        expect(avatarSrc).not.toContain("placeholder");

        // Step 7: Open Gallery
        await page.click("text=Gallery");
        await page.waitForURL("**/gallery");
        await expect(page.locator(".gallery-card").first()).toBeVisible();
        const gallerySrc = await page.locator(".gallery-card img").first().getAttribute("src");
        expect(gallerySrc).not.toContain("placeholder");

        // Step 8: Preview modal
        await page.locator(".gallery-card").first().click();
        await page.waitForSelector(".modal-overlay");
        const modalSrc = await page.locator(".modal img").getAttribute("src");
        expect(modalSrc).not.toContain("placeholder");

        // Step 9: Close modal and go Home
        await page.click(".close-btn");
        await page.waitForSelector(".modal-overlay", { state: "hidden" });
        await page.click("text=← Home");
        await page.waitForURL("**/home");
        const homeAvatarSrc = await page.locator(".character-card .character-avatar img").first().getAttribute("src");
        expect(homeAvatarSrc).not.toContain("placeholder");

        // Step 10: Start Chat
        await page.locator(".character-card").first().click();
        await page.waitForURL("**/characters/**");
        await page.click("text=Start Chat");
        await page.waitForURL("**/chat*");
        await expect(page.locator("h1")).toContainText("Chat");
        await expect(page.locator(".chat-container")).toBeVisible();

        // Step 11: Send message
        await page.fill(".chat-input-bar input", "Hello, character!");
        await page.click(".chat-input-bar button");
        await page.waitForSelector(".chat-message.user .message-bubble", { timeout: 10000 });
        await expect(page.locator(".chat-message.user .message-bubble")).toContainText("Hello, character!");

        // Verify no uncaught errors (ignore expected fake URI errors from fake provider)
        const significantErrors = errors.filter((e) => !e.includes("favicon") && !e.includes("ERR_UNKNOWN_URL_SCHEME"));
        expect(significantErrors).toHaveLength(0);
    });
});
