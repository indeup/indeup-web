import { Page, expect, Locator } from "@playwright/test";

export async function openChatFresh(page: Page) {
  await page.goto("/");
  await page.getByTestId("chat-fab").click();
  await expect(page.getByTestId("chat-panel")).toBeVisible();
}

export async function sendMessage(page: Page, text: string) {
  const input = page.getByTestId("chat-input");
  await input.fill(text);
  await page.getByTestId("chat-send").click();
}

/** Sends a message and waits for exactly one new assistant answer bubble to
 *  appear, then returns its text. Counting bubbles (rather than waiting on
 *  the "답변 작성 중..." indicator) is robust against FAQ hits, which never
 *  show a loading state at all because they're answered client-side. */
export async function askAndGetAnswer(page: Page, text: string, timeoutMs = 45000): Promise<string> {
  const answers = page.getByTestId("chat-message-answer");
  const before = await answers.count();
  await sendMessage(page, text);
  await expect(answers).toHaveCount(before + 1, { timeout: timeoutMs });
  return ((await answers.nth(before).textContent()) ?? "").trim();
}

export function lastAnswerLocator(page: Page): Locator {
  return page.getByTestId("chat-message-answer").last();
}

/** Container scoped to whichever assistant bubble is currently last — used
 *  to find the linkIds/quickReplies rendered alongside that specific turn. */
export function lastAssistantTurnLocator(page: Page): Locator {
  return page.getByTestId("chat-message-assistant").last();
}

const RAW_URL_PATTERN = /https?:\/\//i;
const INTERNAL_PATH_PATTERN = /\/(custom-fit|products|support|guide)\//;
const EMOJI_PATTERN = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

export function assertCleanAnswerText(text: string) {
  expect(text, `raw URL leaked into answer: "${text}"`).not.toMatch(RAW_URL_PATTERN);
  expect(text, `internal path leaked into answer: "${text}"`).not.toMatch(INTERNAL_PATH_PATTERN);
  expect(text, `emoji found in answer: "${text}"`).not.toMatch(EMOJI_PATTERN);
}

export function assertNoOverclaim(text: string) {
  const bannedPhrases = ["무조건", "예외 없이", "100% 가능", "절대 파손되지"];
  for (const phrase of bannedPhrases) {
    expect(text, `overclaiming phrase "${phrase}" found in: "${text}"`).not.toContain(phrase);
  }
}
