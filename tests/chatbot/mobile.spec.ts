import { test, expect } from "@playwright/test";
import { openChatFresh } from "./helpers";

// Section 14 — mobile viewport (390x844) and general UI behavior checklist.
// Meaningful specifically under the "mobile-chrome" Playwright project.
test.describe("mobile viewport and UI behavior", () => {
  test("FAB 버튼이 뷰포트 안에 보이고 터치 타겟이 44px 이상이다", async ({ page }) => {
    await page.goto("/");
    const fab = page.getByTestId("chat-fab");
    await expect(fab).toBeVisible();
    const box = await fab.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("채팅 패널이 모바일 뷰포트 폭을 넘지 않는다 (가로 스크롤 없음)", async ({ page }) => {
    await openChatFresh(page);
    const panel = page.getByTestId("chat-panel");
    const box = await panel.boundingBox();
    const viewport = page.viewportSize();
    if (box && viewport) expect(box.width).toBeLessThanOrEqual(viewport.width + 1);
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  test("퀵스타트 버튼이 터치로 탭 가능하고 응답이 표시된다", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-size-check").tap();
    await expect(page.getByTestId("chat-message-answer").first()).toBeVisible();
  });

  test("입력창 포커스 시 전송 버튼이 화면 밖으로 밀려나지 않는다", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("chat-input").tap();
    await expect(page.getByTestId("chat-send")).toBeVisible();
  });

  test("Enter로 전송, Shift+Enter로 줄바꿈된다", async ({ page }) => {
    await openChatFresh(page);
    const input = page.getByTestId("chat-input");
    await input.fill("줄바꿈 테스트");
    await input.press("Shift+Enter");
    const value1 = await input.inputValue();
    expect(value1).toContain("\n");
    await input.press("Enter");
    await expect(page.getByTestId("chat-message-user").last()).toBeVisible({ timeout: 10000 });
  });

  test("새로고침 후 대화가 sessionStorage 정책대로 처리된다(재오픈 시 퀵스타트로 리셋)", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-delivery").click();
    await expect(page.getByTestId("chat-message-answer")).toHaveCount(1);
    await page.reload();
    await page.getByTestId("chat-fab").click();
    await expect(page.getByTestId("quick-start-find-product")).toBeVisible();
  });

  test("긴 답변도 줄바꿈되어 패널 폭을 넘지 않는다", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-size-check").click();
    const answer = page.getByTestId("chat-message-answer").first();
    const panelBox = await page.getByTestId("chat-panel").boundingBox();
    const answerBox = await answer.boundingBox();
    if (panelBox && answerBox) {
      expect(answerBox.x + answerBox.width).toBeLessThanOrEqual(panelBox.x + panelBox.width + 1);
    }
  });

  test("접근성: aria-live 영역과 입력 label이 존재한다", async ({ page }) => {
    await openChatFresh(page);
    await expect(page.locator('[aria-live="polite"]')).toHaveCount(1);
    await expect(page.locator('label[for="indeup-chat-input"]')).toHaveCount(1);
  });
});
