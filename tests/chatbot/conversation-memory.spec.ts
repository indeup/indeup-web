import { test, expect } from "@playwright/test";
import { openChatFresh, askAndGetAnswer, assertCleanAnswerText } from "./helpers";

// Category D — multi-turn context memory. Establishes facts across several
// turns in one thread, then asks a follow-up that only makes sense if the
// model actually retained the earlier turns instead of re-asking for them.
test.describe("category D: conversation memory", () => {
  test("이전 턴에서 알려준 인원수/사이즈를 다시 묻지 않고 이어서 답한다", async ({ page }) => {
    // 4 sequential AI calls in one thread — needs more headroom than the
    // 90s project default.
    test.setTimeout(180000);
    await openChatFresh(page);

    await askAndGetAnswer(page, "2인이 같이 쓸 책상을 찾고 있어요");
    await askAndGetAnswer(page, "가로는 2000mm 정도로 생각하고 있어요");
    const a3 = await askAndGetAnswer(page, "높이는 700mm면 될까요?");
    assertCleanAnswerText(a3);
    // Should not re-ask "몇 분이 쓰시나요" / "가로는 몇 mm로 생각하세요" — those
    // were already answered in turns 1-2.
    expect(a3).not.toMatch(/몇\s*분|인원.*알려|가로.*알려주세요/);

    const a4 = await askAndGetAnswer(page, "색상은 어떤 게 있어요?");
    assertCleanAnswerText(a4);
  });

  test("대화 중간에 조건을 정정하면 이후 답변에 정정된 조건이 반영된다", async ({ page }) => {
    await openChatFresh(page);
    await askAndGetAnswer(page, "2인용 책상 알아보고 있어요");
    const corrected = await askAndGetAnswer(page, "아 다시 생각해보니 저 혼자 쓸 거예요, 1인용으로요");
    assertCleanAnswerText(corrected);
    expect(corrected).not.toMatch(/2인/);
  });
});
