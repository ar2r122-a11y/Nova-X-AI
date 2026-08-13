import { chromium } from "playwright";

async function debug() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on("console", (msg) => console.log(`[${msg.type()}] ${msg.text()}`));
    page.on("pageerror", (err) => console.log(`[pageerror] ${err.message}`));

    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");

    await page.click("button.primary");
    await page.waitForURL("**/home");

    await page.click("text=+ New Character");
    await page.waitForURL("**/characters/create");

    await page.fill('input[id="name"]', "Debug Hero");
    await page.fill('textarea[id="description"]', "Debug character");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/characters/**");

    await page.waitForTimeout(1000);

    // Generate
    await page.fill('input[type="text"]', "debug prompt");
    await page.click('.generation-form button');
    await page.waitForSelector(".candidate-grid", { timeout: 60000 });

    // Select first candidate
    await page.locator(".candidate").first().locator("button.select-btn").click();
    await page.waitForTimeout(2000);

    // Check if selected class was added
    const hasSelected = await page.locator(".candidate.selected").count();
    console.log("Selected candidates:", hasSelected);

    await page.screenshot({ path: "C:/Users/Ahmed/AppData/Local/Temp/kilo/debug-selection.png" });

    await browser.close();
}

debug().catch((err) => {
    console.error(err);
    process.exit(1);
});
