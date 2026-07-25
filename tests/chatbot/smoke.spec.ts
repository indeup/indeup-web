import { test, expect } from "@playwright/test";
import { openChatFresh } from "./helpers";

test.describe("smoke: widget opens and quick-start works", () => {
  test("FAB opens the panel and shows the 4 quick-start options", async ({ page }) => {
    await openChatFresh(page);
    await expect(page.getByTestId("quick-start-find-product")).toBeVisible();
    await expect(page.getByTestId("quick-start-size-check")).toBeVisible();
    await expect(page.getByTestId("quick-start-delivery")).toBeVisible();
    await expect(page.getByTestId("quick-start-assembly-as")).toBeVisible();
  });

  test("clicking a quick-start button produces a scripted assistant answer with no API round trip", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-delivery").click();
    await expect(page.getByTestId("chat-message-answer")).toHaveCount(1);
    const text = await page.getByTestId("chat-message-answer").first().textContent();
    expect(text?.length ?? 0).toBeGreaterThan(0);
  });

  test("close then reopen resets to the quick-start menu (fresh-start-every-open)", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-delivery").click();
    await expect(page.getByTestId("chat-message-answer")).toHaveCount(1);
    await page.getByTestId("chat-fab").click(); // close
    await page.getByTestId("chat-fab").click(); // reopen
    await expect(page.getByTestId("quick-start-find-product")).toBeVisible();
    // The prior turn should not still be showing on the fresh-open screen.
    await expect(page.getByTestId("chat-message-answer")).toHaveCount(0);
  });
});
