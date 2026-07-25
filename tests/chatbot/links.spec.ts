import { test, expect } from "@playwright/test";
import { openChatFresh } from "./helpers";

// Category E — button/link destination verification. Uses the deterministic
// quick-start scripted responses (not AI-generated) so link targets are
// stable and don't depend on model output — the AI-recommended links are
// already covered by recommendation.spec.ts's click-through test.
test.describe("category E: link and button destinations", () => {
  test("배송 안내 퀵스타트의 링크 버튼이 실제 지원 페이지로 연결된다", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-delivery").click();
    const link = page.locator('[data-testid^="chat-link-"]').first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).not.toMatch(/\/#(custom|contact)$/);
  });

  test("조립/AS 퀵스타트의 링크가 404 없이 실제로 열린다", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-assembly-as").click();
    const link = page.locator('[data-testid^="chat-link-"]').first();
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    if (href && href.startsWith("/")) {
      const resp = await page.request.get(href);
      expect(resp.ok(), `${href} returned ${resp.status()}`).toBeTruthy();
    }
  });

  test("네이버 톡톡 링크는 새 탭으로 열리도록 target=_blank가 설정되어 있다", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-delivery").click();
    const talkLink = page.getByText("네이버 톡톡 상담", { exact: false });
    if ((await talkLink.count()) === 0) test.skip(true, "naverTalk not offered for this scripted response");
    await expect(talkLink.first()).toHaveAttribute("target", "_blank");
    await expect(talkLink.first()).toHaveAttribute("rel", /noopener/);
  });
});
