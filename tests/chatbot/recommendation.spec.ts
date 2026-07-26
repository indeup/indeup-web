import { test } from "@playwright/test";
import { loadQuestionsForCategory, runQuestionTest } from "./qa-runner";

// Category B — product selection/recommendation across customer situations (25 questions).
const questions = loadQuestionsForCategory(["B_recommendation"]);
test.describe("product recommendation by customer situation", () => {
  for (const q of questions) {
    test(`${q.id}: ${q.canonicalQuestion}`, async ({ page }) => {
      await runQuestionTest(page, q);
    });
  }
});
