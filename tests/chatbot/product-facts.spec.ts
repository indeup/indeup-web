import { test, expect } from "@playwright/test";
import { openChatFresh, askAndGetAnswer, assertCleanAnswerText, assertNoOverclaim } from "./helpers";

// Category A — basic product facts. These hit the real Worker/Anthropic API
// (no FAQ short-circuit for most of these), so each test is slow (~5-20s)
// and costs real tokens — kept to a small representative set per the QA
// spec's "대표 질문" allowance rather than the full ~150-question list.
test.describe("category A: basic product facts", () => {
  test("제작 기간을 물으면 실제 정책값(7~8영업일)을 답한다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "책상 제작 기간이 얼마나 걸려요?");
    expect(answer.length).toBeGreaterThan(0);
    assertCleanAnswerText(answer);
    expect(answer).toMatch(/7.?8|영업일/);
  });

  test("보증 기간을 물으면 3년으로 일관되게 답한다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "책상 보증 기간이 몇 년이에요?");
    assertCleanAnswerText(answer);
    expect(answer).toContain("3");
    expect(answer).not.toMatch(/1년|2년/);
  });

  test("파손 교환 정책을 물으면 무조건/예외없이식 과장 표현을 쓰지 않는다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "배송 중에 파손되면 무조건 새 걸로 바꿔주나요?");
    assertCleanAnswerText(answer);
    assertNoOverclaim(answer);
  });

  test("주문/결제 방법을 물으면 네이버로만 안내한다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "이거 어디서 주문하고 결제해요?");
    assertCleanAnswerText(answer);
    expect(answer).toMatch(/네이버/);
  });
});
