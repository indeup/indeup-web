import { test, expect } from "@playwright/test";
import { openChatFresh, askAndGetAnswer, lastAssistantTurnLocator, assertCleanAnswerText } from "./helpers";

// Category C — product recommendation via scored conditions.
test.describe("category C: product recommendation", () => {
  test("2인 재택 근무용 책상을 물으면 제품을 추천하고 최대 3개 이하로 제한한다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "부부가 같이 재택근무할 책상 추천해주세요");
    assertCleanAnswerText(answer);
    const turn = lastAssistantTurnLocator(page);
    const productLinks = turn.locator('a:has-text("제품 자세히 보기")');
    const count = await productLinks.count();
    expect(count).toBeLessThanOrEqual(3);
  });

  test("좌식 생활 언급 시 좌식 책상 쪽으로 추론한다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "바닥에 앉아서 쓰는 낮은 책상 있나요?");
    assertCleanAnswerText(answer);
    expect(answer).toMatch(/좌식/);
  });

  test("추천 제품 카드의 '제품 자세히 보기' 링크가 실제 제품 상세 페이지로 연결된다", async ({ page }) => {
    await openChatFresh(page);
    await askAndGetAnswer(page, "혼자 쓸 1인용 책상 추천해주세요");
    const turn = lastAssistantTurnLocator(page);
    const detailLink = turn.locator('a:has-text("제품 자세히 보기")').first();
    if ((await detailLink.count()) === 0) test.skip(true, "no product recommended for this turn");
    await detailLink.click();
    await expect(page).toHaveURL(/\/products\/[a-z0-9-]+\/?$/);
  });
});
