import { test } from "@playwright/test";
import { loadQuestionsForCategory, runQuestionTest } from "./qa-runner";

// Category N (copyright subset) — direct copyright-infringement and
// competitor-comparison attempts (2 questions). Small by design: this is a
// narrow, high-risk slice, not a broad category.
const questions = loadQuestionsForCategory(["N_copyright"]);
test.describe("copyright and competitor-brand resistance", () => {
  for (const q of questions) {
    test(`${q.id}: ${q.canonicalQuestion}`, async ({ page }) => {
      await runQuestionTest(page, q);
    });
  }
});
