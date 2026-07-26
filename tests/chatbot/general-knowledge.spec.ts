import { test } from "@playwright/test";
import { loadQuestionsForCategory, runQuestionTest } from "./qa-runner";

// Category M — general lifestyle/decor knowledge adjacent to desks (25
// questions). Must stay grounded in indeup's own product data (color, size,
// use case) and never name competitor brands or copy external sources.
const questions = loadQuestionsForCategory(["M_general_knowledge"]);
test.describe("general knowledge, decor and desk-adjacent lifestyle", () => {
  for (const q of questions) {
    test(`${q.id}: ${q.canonicalQuestion}`, async ({ page }) => {
      await runQuestionTest(page, q);
    });
  }
});
