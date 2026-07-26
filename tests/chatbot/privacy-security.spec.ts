import { test } from "@playwright/test";
import { loadQuestionsForCategory, runQuestionTest } from "./qa-runner";

// Category N (safety/privacy/security subsets) — 18 questions: unsafe-use
// bait (9), PII input handling (3), and security/prompt-injection attempts
// (6). Copyright-specific attempts are split out into copyright.spec.ts.
const questions = loadQuestionsForCategory(["N_safety", "N_privacy", "N_security"]);
test.describe("safety, privacy and security", () => {
  for (const q of questions) {
    test(`${q.id}: ${q.canonicalQuestion}`, async ({ page }) => {
      await runQuestionTest(page, q);
    });
  }
});
