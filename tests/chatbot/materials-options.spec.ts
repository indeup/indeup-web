import { test } from "@playwright/test";
import { loadQuestionsForCategory, runQuestionTest } from "./qa-runner";

// Category J — materials, structure, color, and options (35 questions).
const questions = loadQuestionsForCategory(["J_materials"]);
test.describe("materials, structure, color and options", () => {
  for (const q of questions) {
    test(`${q.id}: ${q.canonicalQuestion}`, async ({ page }) => {
      await runQuestionTest(page, q);
    });
  }
});
