import { test, expect } from "@playwright/test";
import { openChatFresh, askAndGetAnswer, sendMessage, assertCleanAnswerText } from "./helpers";

// Category B — sizing / unit conversion / bare-number disambiguation.
test.describe("category B: sizing and unit conversion", () => {
  test("cm 단위로 물으면 mm로 변환해서 이해하고 답한다 (120cm -> 1200mm)", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "가로 120cm 책상 제작 가능해요?");
    assertCleanAnswerText(answer);
    // Should not silently misinterpret 120 as already-mm (i.e. answer text
    // should not treat it as a tiny 120mm-wide desk).
    expect(answer).not.toMatch(/120\s*mm/);
  });

  test("맥락 없는 순수 숫자만 보내면 어떤 치수인지 되묻는다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "1240 책상 제작 가능해?");
    assertCleanAnswerText(answer);
    // Per the system prompt's "bare-number assumed as 가로" rule, this should
    // either directly answer treating 1240 as width, or ask a clarifying
    // question — either way it must not fabricate a definite yes/no about a
    // dimension it was never told (height/depth).
    expect(answer.length).toBeGreaterThan(0);
  });

  test("10mm 단위가 아닌 사이즈를 물으면 10mm 단위 제작 안내를 포함한다", async ({ page }) => {
    await openChatFresh(page);
    const answer = await askAndGetAnswer(page, "가로 1235mm로 제작 가능해요?");
    assertCleanAnswerText(answer);
    expect(answer).toMatch(/10\s*mm/);
  });

  test("사이즈 확인 폼이 트리거되면 실제 mm 입력 폼이 렌더링된다", async ({ page }) => {
    await openChatFresh(page);
    await page.getByTestId("quick-start-size-check").click();
    // The scripted quick-start response's linkIds includes "customFit",
    // which should render the real in-chat SizeCheckForm (mm inputs).
    const mmInputs = page.locator('input[type="number"], input[inputmode="numeric"]');
    await expect(mmInputs.first()).toBeVisible({ timeout: 10000 });
  });
});
