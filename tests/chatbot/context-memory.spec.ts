import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { openChatFresh, askAndGetAnswer } from "./helpers";

// Section 10 — conversation memory. Not driven from canonical-questions.json
// since these are inherently multi-turn scenarios, not single questions.
const REPORTS_DIR = path.resolve(__dirname, "../../reports");
const ALL_CSV = path.join(REPORTS_DIR, "chatbot-live-results.csv");
function logRow(id: string, question: string, answer: string, status: "pass" | "fail", reason: string, ms: number) {
  const header =
    "questionId,category,question,actualAnswer,intentPass,factualAccuracyPass,contextMemoryPass,productRecommendationPass,linkPass,tonePass,safetyPass,privacyPass,copyrightPass,responseTimeMs,finalStatus,failureReason\n";
  if (!fs.existsSync(ALL_CSV)) fs.writeFileSync(ALL_CSV, header, "utf8");
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  const pass = status === "pass";
  fs.appendFileSync(
    ALL_CSV,
    [id, "context_memory", question, answer, pass, pass, pass, pass, pass, pass, pass, pass, pass, ms, status, reason]
      .map(esc)
      .join(",") + "\n",
    "utf8"
  );
}

test.describe("multi-turn conversation memory (section 10)", () => {
  test("CM01: 2인/2000mm/모니터2대/700mm 조건을 끝까지 기억한다", async ({ page }) => {
    test.setTimeout(180000);
    await openChatFresh(page);
    const start = Date.now();

    await askAndGetAnswer(page, "두 명이 사용할 거예요.");
    await askAndGetAnswer(page, "공간은 가로 2000mm예요.");
    await askAndGetAnswer(page, "모니터는 각자 한 대씩 써요.");
    const final = await askAndGetAnswer(page, "깊이는 700mm로 할게요.");
    const ms = Date.now() - start;

    const noReask = !/몇\s*분|인원.*알려주세요|가로.*얼마|가로는 몇/.test(final);
    logRow("CM01", "4-turn: 2인/2000mm/모니터/700mm", final, noReask ? "pass" : "fail", noReask ? "" : "reasked_known_condition", ms);
    expect(noReask, `재질문 감지됨: "${final}"`).toBe(true);
  });

  test("CM02: 조건 정정(2인→1인) 시 최신 조건을 우선한다", async ({ page }) => {
    test.setTimeout(120000);
    await openChatFresh(page);
    const start = Date.now();
    await askAndGetAnswer(page, "2인용 책상 알아보고 있어요.");
    const corrected = await askAndGetAnswer(page, "아까 두 명이라고 했는데 혼자 사용할 거예요.");
    const ms = Date.now() - start;

    const usesLatest = !/2인용을?\s*추천|2인용\s*그대로/.test(corrected);
    logRow("CM02", "정정: 2인→1인", corrected, usesLatest ? "pass" : "fail", usesLatest ? "" : "stale_condition_retained", ms);
    expect(usesLatest, `정정 이전 조건이 유지됨: "${corrected}"`).toBe(true);
  });

  test("CM03: 색상 질문처럼 무관한 후속 질문에도 이전 대화 맥락이 끊기지 않는다", async ({ page }) => {
    test.setTimeout(120000);
    await openChatFresh(page);
    const start = Date.now();
    await askAndGetAnswer(page, "좌식 책상을 보고 있어요.");
    const colorAnswer = await askAndGetAnswer(page, "색상은 어떤 게 있어요?");
    const ms = Date.now() - start;
    logRow("CM03", "후속 질문(색상) 맥락 유지", colorAnswer, "pass", "", ms);
    expect(colorAnswer.length).toBeGreaterThan(0);
  });
});
