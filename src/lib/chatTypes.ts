/**
 * Shape of every AI chat response. Must stay in sync with the tool schema
 * in worker/worker.js (RESPONSE_TOOL) — the worker forces the model to
 * return exactly this shape via Anthropic tool-use, never free text/HTML.
 */
export type ChatIntent =
  | "general"
  | "product_recommendation"
  | "size_check"
  | "delivery"
  | "assembly"
  | "warranty"
  | "support"
  | "clarification"
  | "fallback";

export type ChatProductRecommendation = { productId: string; reason: string };

export type ChatResponse = {
  intent: ChatIntent;
  answer: string;
  products?: ChatProductRecommendation[];
  linkIds?: string[];
  quickReplies?: string[];
  needsHumanSupport?: boolean;
};
