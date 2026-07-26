import { test } from "@playwright/test";
import { loadQuestionsForCategory, runQuestionTest } from "./qa-runner";

// Category I — custom sizing and measurement (55 questions), the largest
// single category since it covers unit conversion, edge cases, and invalid
// input handling in addition to plain size-feasibility questions.
const questions = loadQuestionsForCategory(["I_sizing"]);
test.describe("custom sizing and measurement", () => {
  for (const q of questions) {
    test(`${q.id}: ${q.canonicalQuestion}`, async ({ page }) => {
      await runQuestionTest(page, q);
    });
  }
});
