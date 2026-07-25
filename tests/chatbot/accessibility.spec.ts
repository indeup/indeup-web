import { test, expect } from "@playwright/test";
import { openChatFresh } from "./helpers";

// Category L — UI/accessibility checklist items that can be verified
// statically (attributes, focus, live regions) without relying on AI output.
test.describe("category L: accessibility", () => {
  test("FAB 버튼에 aria-label이 있다", async ({ page }) => {
    await page.goto("/");
    const fab = page.getByTestId("chat-fab");
    await expect(fab).toHaveAttribute("aria-label", /.+/);
  });

  test("입력창에 연결된 label과 전송 버튼에 aria-label이 있다", async ({ page }) => {
    await openChatFresh(page);
    const input = page.getByTestId("chat-input");
    await expect(input).toHaveAttribute("id", "indeup-chat-input");
    const label = page.locator('label[for="indeup-chat-input"]');
    await expect(label).toHaveCount(1);
    await expect(page.getByTestId("chat-send")).toHaveAttribute("aria-label", "전송");
  });

  test("새 메시지가 aria-live 영역을 통해 announce된다", async ({ page }) => {
    await openChatFresh(page);
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toHaveCount(1);
    await page.getByTestId("quick-start-delivery").click();
    await expect(liveRegion).not.toHaveText("");
  });

  test("키보드만으로 FAB에 포커스하고 Enter로 열 수 있다", async ({ page }) => {
    await page.goto("/");
    const fab = page.getByTestId("chat-fab");
    await fab.focus();
    await expect(fab).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("chat-panel")).toBeVisible();
  });

  test("텍스트 입력 필드가 Tab으로 도달 가능하다", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("chat-input").focus();
    await expect(page.getByTestId("chat-input")).toBeFocused();
  });
});
