import { test } from "@playwright/test";
import { loadQuestionsForCategory, runQuestionTest } from "./qa-runner";

// Category K — pricing, ordering, production, and delivery (35 questions).
// Many of these are deliberately unanswerable from official data (price,
// discounts, exact ship dates) and are expected to route to human support
// rather than being guessed.
const questions = loadQuestionsForCategory(["K_order_delivery"]);
test.describe("pricing, order, production and delivery", () => {
  for (const q of questions) {
    test(`${q.id}: ${q.canonicalQuestion}`, async ({ page }) => {
      await runQuestionTest(page, q);
    });
  }
});
