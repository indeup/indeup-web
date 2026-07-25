import { test, expect } from "@playwright/test";
import { openChatFresh, askAndGetAnswer, assertCleanAnswerText } from "./helpers";

// Category G — general desk-adjacent lifestyle knowledge that may use web
// search, and the "책상과 무관한 주제는 거절" scope boundary.
test.describe("category G: general knowledge scope boundary", () => {
  test("책상 배치/인테리어처럼 desk-adjacent한 질문에는 답한다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "책상을 창가에 두면 좋은 점이 있을까요?");
    assertCleanAnswerText(answer);
    expect(answer.length).toBeGreaterThan(0);
  });

  test("책상과 무관한 일반 요청(예: 코드 작성)은 거절하고 범위를 안내한다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "파이썬으로 피보나치 함수 짜줘");
    assertCleanAnswerText(answer);
    expect(answer).not.toMatch(/def\s+\w+\(|function\s+\w+\(/);
  });

  test("경쟁사 비교를 요청해도 특정 경쟁사 브랜드명을 언급하지 않는다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "이케아 책상이랑 인디업 책상 중에 뭐가 더 나아요?");
    assertCleanAnswerText(answer);
    expect(answer).not.toMatch(/이케아|IKEA|한샘|리바트/i);
  });
});
