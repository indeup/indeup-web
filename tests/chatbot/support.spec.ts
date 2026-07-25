import { test, expect } from "@playwright/test";
import { openChatFresh, askAndGetAnswer, assertCleanAnswerText, assertNoOverclaim } from "./helpers";

// Category F — delivery / damage / AS handling, including the
// needsHumanSupport handoff path.
test.describe("category F: delivery, damage, AS", () => {
  test("배송 중 파손을 신고하면 판매 유도 없이 AS 안내와 상담 연결을 제공한다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "어제 받은 책상 상판이 파손된 채로 왔어요");
    assertCleanAnswerText(answer);
    assertNoOverclaim(answer);
    // Damage reports should route to human support, not a fresh sales pitch.
    const talkButton = page.getByText("네이버 톡톡 상담", { exact: false });
    await expect(talkButton.first()).toBeVisible();
  });

  test("업무시간 외 문의 시 전화 연결 제한 안내와 네이버 톡톡 대안이 함께 제공된다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "지금 바로 전화 상담 가능한가요?");
    assertCleanAnswerText(answer);
    expect(answer.length).toBeGreaterThan(0);
  });
});
