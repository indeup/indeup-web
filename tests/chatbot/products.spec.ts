import { test } from "@playwright/test";
import { loadQuestionsForCategory, runQuestionTest } from "./qa-runner";

// Categories C-H — per-product-line detail (single/double/floor desk, side
// table, home-bar-table, frame). 115 questions total.
const questions = loadQuestionsForCategory([
  "C_single_desk",
  "D_double_desk",
  "E_floor_desk",
  "F_side_table",
  "G_home_bar_table",
  "H_frame",
]);
test.describe("per-product-line detail questions", () => {
  for (const q of questions) {
    test(`${q.id}: ${q.canonicalQuestion}`, async ({ page }) => {
      await runQuestionTest(page, q);
    });
  }
});
