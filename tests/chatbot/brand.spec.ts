import { test } from "@playwright/test";
import { loadQuestionsForCategory, runQuestionTest } from "./qa-runner";

// Category A — brand/official info (15 questions, Q001-Q015).
const questions = loadQuestionsForCategory(["A_brand"]);
test.describe("brand and official information", () => {
  for (const q of questions) {
    test(`${q.id}: ${q.canonicalQuestion}`, async ({ page }) => {
      await runQuestionTest(page, q);
    });
  }
});
