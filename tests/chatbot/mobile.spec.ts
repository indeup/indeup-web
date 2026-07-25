import { test, expect } from "@playwright/test";
import { openChatFresh } from "./helpers";

// Category M — mobile viewport behavior. These assertions are meaningful
// specifically under the "mobile-chrome" Playwright project (390x844); on
// desktop-chrome they'll still pass but aren't testing anything new.
test.describe("category M: mobile viewport", () => {
  test("FAB 버튼이 뷰포트 안에 보이고 터치 타겟이 44px 이상이다", async ({ page }) => {
    await page.goto("/");
    const fab = page.getByTestId("chat-fab");
    await expect(fab).toBeVisible();
    const box = await fab.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      const viewport = page.viewportSize();
      if (viewport) {
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
      }
    }
  });

  test("채팅 패널이 모바일 뷰포트 폭을 넘지 않는다 (가로 스크롤 없음)", async ({ page }) => {
    await openChatFresh(page);
    const panel = page.getByTestId("chat-panel");
    const box = await panel.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    if (box && viewport) {
      expect(box.width).toBeLessThanOrEqual(viewport.width + 1);
    }
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(hasHorizontalScroll).toBe(false);
  });

  test("퀵스타트 버튼들이 터치로 탭 가능하고 응답이 표시된다", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-size-check").tap();
    await expect(page.getByTestId("chat-message-answer").first()).toBeVisible();
  });

  test("입력창 포커스 시 전송 버튼이 화면 밖으로 밀려나지 않는다", async ({ page }) => {
    await openChatFresh(page);
    const input = page.getByTestId("chat-input");
    await input.tap();
    await expect(page.getByTestId("chat-send")).toBeVisible();
  });
});
