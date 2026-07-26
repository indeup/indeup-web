"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { policyData } from "@/lib/policy";
import { getProductLink, getGuideLink, type GuideLinkId } from "@/lib/chatCatalog";
import { matchFaq } from "@/lib/chatFaq";
import type { ChatResponse } from "@/lib/chatTypes";
import { checkAllProducts, diagnoseNoMatch, type ProductMatch, type NoMatchDiagnosis, type ResolvedDimension } from "@/lib/customFit";

/**
 * Endpoint of the Cloudflare Worker proxy (see /worker/worker.js). The
 * worker — not this component — holds the Anthropic API key; this only
 * ever calls the worker's public URL. Left blank until the worker is
 * actually deployed so the widget can silently no-op instead of shipping
 * a broken fetch target.
 */
const CHAT_ENDPOINT = process.env.NEXT_PUBLIC_CHAT_ENDPOINT ?? "";

const STORAGE_KEY = "indeup-chat-widget-v2";

type DisplayMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; response: ChatResponse; logKey?: string; feedback?: "helpful" | "not-helpful" };

/** Every open starts fresh at the quick-start menu (see handleOpen) rather
 *  than silently resuming an old conversation — on mobile especially, a
 *  reopened widget showing yesterday's chat reads as broken/stuck. The
 *  previous conversation is still saved here so "이전 대화 이어보기" can pull
 *  it back for anyone who actually wanted to continue, not restart. */
function loadSavedMessages(): DisplayMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", name, params);
}

/** Defensive only — the system prompt forbids markdown, but renders any
 *  stray **bold** as real emphasis instead of leaking literal asterisks. */
function renderWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

const QUICK_START: { id: string; label: string; response: ChatResponse }[] = [
  {
    id: "find-product",
    label: "내 공간에 맞는 제품 찾기",
    response: {
      intent: "clarification",
      answer: "몇 명이 사용할 책상인가요?",
      quickReplies: ["1명 사용", "2명 사용", "바닥에 앉아 사용", "보조 테이블로 사용"],
      needsHumanSupport: false,
    },
  },
  {
    id: "size-check",
    label: "사이즈 제작 가능 여부",
    response: {
      intent: "size_check",
      answer: "책상 가로·세로·높이를 입력하면 제작 가능 여부를 바로 확인할 수 있습니다.",
      linkIds: ["customFit"],
      needsHumanSupport: false,
    },
  },
  {
    id: "delivery",
    label: "배송 기간",
    response: {
      intent: "delivery",
      answer: `주문 확인 후 일반적으로 ${policyData.productionDays}이 필요합니다. ${policyData.productionExcludes}은 제작 기간에서 제외됩니다.`,
      linkIds: ["delivery"],
      needsHumanSupport: false,
    },
  },
  {
    id: "assembly-as",
    label: "조립·A/S",
    response: {
      intent: "assembly",
      answer: "조립에 필요한 부품과 설명서가 제품과 함께 제공됩니다. 파손이나 부품 문제가 있다면 네이버 톡톡으로 문의해 주세요.",
      linkIds: ["assembly", "naverTalk"],
      needsHumanSupport: false,
    },
  },
];

/** Used for both "couldn't reach the worker at all" and, once parsed, any
 *  server-signalled failure — deliberately reads as a planned beta update
 *  rather than a broken service. */
const LOCAL_FALLBACK: ChatResponse = {
  intent: "fallback",
  answer: "현재 베타 서비스 개선을 위해 업데이트 중입니다. 잠시 후 다시 이용해 주세요.",
  linkIds: ["support"],
  needsHumanSupport: false,
};

/** Distinct from LOCAL_FALLBACK — this is the customer's own rate, not a
 *  service problem, so it shouldn't read as "we're down for maintenance." */
const RATE_LIMIT_RESPONSE: ChatResponse = {
  intent: "fallback",
  answer: "요청이 많아 잠시 지연되고 있습니다. 잠시 후 다시 시도해 주세요.",
  needsHumanSupport: false,
};

function toApiMessages(messages: DisplayMessage[]) {
  return messages.map((m) => (m.role === "user" ? { role: "user" as const, content: m.content } : { role: "assistant" as const, content: m.response.answer }));
}

function LinkButton({ id, onNavigate }: { id: string; onNavigate: (id: GuideLinkId, isExternal: boolean) => void }) {
  const link = getGuideLink(id);
  if (!link) return null;
  const isExternal = link.href.startsWith("http");
  const className =
    "min-h-11 inline-flex items-center rounded-full border border-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-[var(--color-brand)] transition-colors hover:bg-[var(--color-brand)] hover:text-white";
  if (isExternal) {
    return (
      <a data-testid={`chat-link-${id}`} href={link.href} target="_blank" rel="noreferrer noopener" className={className} onClick={() => onNavigate(id as GuideLinkId, true)}>
        {link.label}
      </a>
    );
  }
  return (
    <Link data-testid={`chat-link-${id}`} href={link.href} className={className} onClick={() => onNavigate(id as GuideLinkId, false)}>
      {link.label}
    </Link>
  );
}

function ProductCard({ productId, reason, onDetail, onPurchase }: { productId: string; reason: string; onDetail: (id: string) => void; onPurchase: (id: string) => void }) {
  const product = getProductLink(productId);
  if (!product || !product.isActive) return null;
  const storeAll = getGuideLink("storeAll");

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
      <div className="relative h-28 w-full">
        <Image src={product.imageUrl} alt={product.name} fill sizes="360px" className="object-cover" />
      </div>
      <div className="p-3.5">
        <p className="text-sm font-bold text-[var(--color-primary)]">{product.name}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--color-muted-foreground)]">{reason}</p>
        <p className="mt-1 text-[10px] leading-4 text-[var(--color-muted-foreground)]">
          사진은 제품 라인 참고용이며, 실제 구성(단품/컴퓨터책상 등)은 다를 수 있습니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={product.detailUrl}
            onClick={() => onDetail(productId)}
            className="min-h-11 inline-flex items-center rounded-full bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            제품 자세히 보기
          </Link>
          {product.purchaseUrl ? (
            <a
              href={product.purchaseUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => onPurchase(productId)}
              className="min-h-11 inline-flex items-center rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-brand)]"
            >
              공식 스토어에서 구매하기
            </a>
          ) : storeAll ? (
            <a
              href={storeAll.href}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => onPurchase(productId)}
              className="min-h-11 inline-flex items-center rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-brand)]"
            >
              공식 스토어 전체보기
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Runs the real /custom-fit/ feasibility logic (checkAllProducts) directly
 *  in the browser — no AI round-trip, no chance of the model mis-guessing a
 *  size. Exact same source of truth as the calculator page, just embedded
 *  so a size question can be answered in the chat itself. */
function SizeCheckForm() {
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<{ kind: "match"; matches: ProductMatch[] } | { kind: "none"; diagnosis: NoMatchDiagnosis } | null>(null);
  const naverTalk = getGuideLink("naverTalk");

  function handleCheck() {
    const w = Number(width);
    const d = Number(depth);
    const h = Number(height);
    if (!w || !d || !h) return;
    trackEvent("chat_size_check_submitted", { width: w, depth: d, height: h });
    const matches = checkAllProducts(w, d, h);
    setResult(matches.length > 0 ? { kind: "match", matches: matches.slice(0, 3) } : { kind: "none", diagnosis: diagnoseNoMatch(w, d, h) });
  }

  const digitsOnly = (v: string) => v.replace(/[^0-9]/g, "").slice(0, 5);

  function formatDim(label: string, dim: ResolvedDimension) {
    const parts = [dim.specLine, dim.optionLine].filter(Boolean);
    return `${label} ${dim.resolvedValue}mm${parts.length ? ` · ${parts.join(" · ")}` : ""}`;
  }

  return (
    <div className="w-[92%] rounded-2xl border border-[var(--color-border)] bg-white p-3.5">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "가로(mm)", value: width, set: setWidth },
          { label: "세로(mm)", value: depth, set: setDepth },
          { label: "높이(mm)", value: height, set: setHeight },
        ].map((f) => (
          <label key={f.label} className="block">
            <span className="text-[10px] font-semibold text-[var(--color-muted-foreground)]">{f.label}</span>
            <input
              type="text"
              inputMode="numeric"
              value={f.value}
              onChange={(e) => f.set(digitsOnly(e.target.value))}
              className="mt-1 h-10 w-full rounded-lg border border-[var(--color-border)] px-2 text-sm outline-none focus:border-[var(--color-brand)]"
            />
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleCheck}
        disabled={!width || !depth || !height}
        className="mt-3 min-h-10 w-full rounded-full bg-[var(--color-brand)] text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        제작 가능 여부 확인
      </button>

      {result?.kind === "match" && (
        <div className="mt-3 flex flex-col gap-3">
          {result.matches.map((m) => {
            const product = getProductLink(m.product);
            return (
              <div key={`${m.product}-${m.variantKey}`} className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                {product && (
                  <div className="relative h-24 w-full">
                    <Image src={product.imageUrl} alt={m.productName} fill sizes="360px" className="object-cover" />
                  </div>
                )}
                <div className="p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">{m.displayLabel}</p>
                  <p className="text-xs font-bold text-[var(--color-primary)]">{m.productName}</p>
                  {product && (
                    <p className="mt-0.5 text-[10px] leading-4 text-[var(--color-muted-foreground)]">
                      사진은 제품 라인 참고용이며, 실제 구성(멀티탭거치대 포함 여부 등)은 위 제품명을 기준으로 합니다.
                    </p>
                  )}

                  <div className="mt-1.5 flex flex-col gap-0.5 text-[11px] leading-5 text-[var(--color-muted-foreground)]">
                    <span>{formatDim("가로", m.width)}</span>
                    <span>{formatDim("세로", m.depth)}</span>
                    <span>{formatDim("높이", m.height)}</span>
                  </div>

                  {m.anyInquiry && <p className="mt-1 text-[10px] text-[var(--color-muted-foreground)]">일부 옵션은 별도 확인이 필요합니다.</p>}

                  <p className="mt-1.5 text-[10px] leading-4 text-[var(--color-muted-foreground)]">
                    아래 버튼으로 이동한 뒤, 위 옵션값과 동일하게 선택하고 구매해 주세요.
                  </p>

                  <a
                    href={m.buyUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => trackEvent("chat_purchase_clicked", { productId: m.product, source: "size_check" })}
                    className="mt-1.5 inline-flex min-h-9 items-center rounded-full bg-[var(--color-brand)] px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    이 사이즈로 구매하기
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {result?.kind === "none" && (
        <div className="mt-3 rounded-xl border border-[var(--color-border)] p-2.5 text-xs leading-5 text-[var(--color-muted-foreground)]">
          <p>입력하신 사이즈로 제작 가능한 제품을 찾지 못했습니다.</p>
          {result.diagnosis.width && <p className="mt-1">{result.diagnosis.width}</p>}
          {result.diagnosis.depth && <p className="mt-1">{result.diagnosis.depth}</p>}
          {result.diagnosis.height && <p className="mt-1">{result.diagnosis.height}</p>}
          {naverTalk && (
            <a
              href={naverTalk.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex min-h-9 items-center rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] hover:border-[var(--color-brand)]"
            >
              네이버 톡톡으로 문의하기
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  // Only used to show/hide the "이전 대화 이어보기" recall button — starting
  // false and flipping true post-mount is a normal client-only feature
  // check, not a hydration mismatch, since it never changes what the
  // server-rendered HTML looked like (still the empty quick-start screen).
  const [hasSavedHistory, setHasSavedHistory] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasOpenedOnce = useRef(false);

  useEffect(() => {
    setHasSavedHistory(loadSavedMessages() !== null);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (messages.length === 0) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    setHasSavedHistory(true);
  }, [messages]);

  if (!CHAT_ENDPOINT) return null;

  function appendMessages(newOnes: DisplayMessage[]) {
    setMessages((prev) => [...prev, ...newOnes]);
    const lastAssistant = [...newOnes].reverse().find((m): m is Extract<DisplayMessage, { role: "assistant" }> => m.role === "assistant");
    if (lastAssistant) setLiveAnnouncement(lastAssistant.response.answer);
  }

  function pushScripted(userLabel: string, response: ChatResponse, eventName?: string) {
    appendMessages([{ role: "user", content: userLabel }, { role: "assistant", response }]);
    if (eventName) trackEvent(eventName, { intent: response.intent });
  }

  async function sendUserText(rawText: string, opts?: { viaQuickReply?: boolean }) {
    const text = rawText.trim();
    if (!text || loading) return;

    const withUser: DisplayMessage[] = [...messages, { role: "user", content: text }];
    setMessages(withUser);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    trackEvent(opts?.viaQuickReply ? "chat_quick_reply_clicked" : "chat_question_submitted", { text });

    const faqHit = matchFaq(text);
    if (faqHit) {
      const response: ChatResponse = {
        intent: "general",
        answer: faqHit.answer,
        linkIds: faqHit.linkIds,
        quickReplies: faqHit.quickReplies,
        needsHumanSupport: false,
      };
      appendMessages([{ role: "assistant", response }]);
      trackEvent("chat_intent_detected", { intent: "faq", faqId: faqHit.id });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toApiMessages(withUser) }),
      });

      if (res.status === 429) {
        appendMessages([{ role: "assistant", response: RATE_LIMIT_RESPONSE }]);
        trackEvent("chat_response_error", { status: 429 });
        return;
      }

      const data: unknown = await res.json();
      if (!res.ok || !data || typeof data !== "object" || !("answer" in data)) {
        throw new Error("bad response");
      }
      const response = data as ChatResponse;
      // logKey rides alongside the ChatResponse contract fields rather than
      // inside it — it's internal bookkeeping for the feedback buttons
      // below, never rendered, so it doesn't belong in the shared contract.
      const logKey = "logKey" in data && typeof data.logKey === "string" ? data.logKey : undefined;
      appendMessages([{ role: "assistant", response, logKey }]);
      trackEvent("chat_intent_detected", { intent: response.intent });
      if (response.products?.length) {
        trackEvent("chat_product_recommended", { productIds: response.products.map((p) => p.productId) });
      }
      if (response.needsHumanSupport) trackEvent("chat_human_handoff", { intent: response.intent });
      if (response.intent === "fallback") trackEvent("chat_fallback", {});
    } catch {
      appendMessages([{ role: "assistant", response: LOCAL_FALLBACK }]);
      trackEvent("chat_response_error", {});
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    // Always land on the fresh quick-start menu, not wherever the last
    // conversation left off — "이전 대화 이어보기" on that menu is the
    // explicit opt-in for anyone who actually wants it back.
    setMessages([]);
    if (!hasOpenedOnce.current) {
      hasOpenedOnce.current = true;
      trackEvent("chat_open", {});
    }
  }

  function handleClose() {
    setOpen(false);
    // Reset immediately on close too (not just deferred to the next open) —
    // the conversation itself is already safe in sessionStorage from the
    // persistence effect, so this can't lose anything "이전 대화 이어보기"
    // wouldn't recover.
    setMessages([]);
  }

  function resumeSavedConversation() {
    const saved = loadSavedMessages();
    if (saved) setMessages(saved);
    trackEvent("chat_history_resumed", {});
  }

  function handleTextareaInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendUserText(input);
    }
  }

  function setFeedback(index: number, value: "helpful" | "not-helpful") {
    const target = messages[index];
    setMessages((prev) => prev.map((m, i) => (i === index && m.role === "assistant" ? { ...m, feedback: value } : m)));
    trackEvent("chat_feedback", { index, value });
    // Fire-and-forget: this is telemetry for later human review (see
    // handleFeedback in worker.js), not part of the chat's critical path, so
    // a failed/slow request here should never block or error out the UI.
    // Scripted quick-start/FAQ answers never got a logKey (no AI call, no KV
    // log to attach to), so there's nothing meaningful to send for those.
    if (CHAT_ENDPOINT && target?.role === "assistant" && target.logKey) {
      fetch(`${CHAT_ENDPOINT.replace(/\/$/, "")}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logKey: target.logKey, feedback: value }),
      }).catch(() => {});
    }
    if (value === "not-helpful") {
      // Auto-improve in the moment: immediately ask the model to try again
      // with the signal that its last answer missed the mark, rather than
      // making the customer pick from a menu. The retried answer becomes
      // the new last message and gets its own feedback prompt, so this can
      // repeat if needed. Aggregated feedback for actually promoting good
      // answers into static FAQ/guide content still needs a human reviewing
      // the KV logs (qa: + fb: records) — this endpoint only makes that
      // review possible, it doesn't automate the review itself.
      sendUserText("방금 답변이 도움이 되지 않았어요. 다른 방식으로 다시 설명해주세요.");
    }
  }

  function resetToMenu() {
    setMessages([]);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <div aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </div>

      {open && (
        <div data-testid="chat-panel" className="flex h-[min(78vh,600px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.22)] sm:h-[680px] sm:w-[420px]">
          <div className="border-b-2 border-[var(--color-brand)] bg-[var(--color-primary)] px-4 pb-3.5 pt-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Image src="/INDEUP_LOGO_WHITE.svg" alt="인디업 INDEUP" width={64} height={23} />
                  <span className="rounded-full bg-[var(--color-brand)] px-1.5 py-0.5 text-[9px] font-bold tracking-wide">BETA</span>
                </div>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Made to Fit Your Space</p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={resetToMenu}
                    aria-label="처음 화면으로 돌아가기"
                    className="flex h-8 items-center rounded-full px-2.5 text-[11px] font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    처음으로
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="채팅 닫기"
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col justify-center gap-3 overflow-y-auto px-5 py-6">
              <p className="text-center text-base font-bold text-[var(--color-primary)]">어떤 도움이 필요하신가요?</p>
              <div className="mt-2 flex flex-col gap-2.5">
                {QUICK_START.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    data-testid={`quick-start-${item.id}`}
                    onClick={() => pushScripted(item.label, item.response, "chat_quick_start_selected")}
                    className="min-h-11 rounded-xl border border-[var(--color-border)] px-4 py-3 text-left text-sm font-medium text-[var(--color-primary)] transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-muted)]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {hasSavedHistory && (
                <button
                  type="button"
                  onClick={resumeSavedConversation}
                  className="min-h-9 text-center text-xs font-semibold text-[var(--color-brand)] underline underline-offset-2"
                >
                  이전 대화 이어보기
                </button>
              )}
              <p className="mt-4 text-center text-[11px] leading-6 text-[var(--color-muted-foreground)]">
                베타 서비스로 답변이 정확하지 않을 수 있습니다.
                <br />
                정확한 안내는 고객센터({policyData.operatingHours}) 또는 네이버 톡톡으로 문의해 주세요.
              </p>
            </div>
          ) : (
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} data-testid="chat-message-user" className="flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-[var(--color-brand)] px-3.5 py-2.5 text-sm leading-6 text-white">{m.content}</div>
                  </div>
                ) : (
                  <div key={i} data-testid="chat-message-assistant" className="flex flex-col items-start gap-2">
                    <div data-testid="chat-message-answer" className="max-w-[92%] whitespace-pre-wrap rounded-2xl bg-[var(--color-muted)] px-3.5 py-2.5 text-sm leading-6 text-[var(--color-primary)]">
                      {renderWithBold(m.response.answer)}
                    </div>

                    {m.response.products && m.response.products.length > 0 && (
                      <div className="flex w-[92%] flex-col gap-2">
                        {m.response.products.map((p) => (
                          <ProductCard
                            key={p.productId}
                            productId={p.productId}
                            reason={p.reason}
                            onDetail={(id) => {
                              trackEvent("chat_product_detail_clicked", { productId: id });
                              // Internal navigation — collapse so the panel doesn't sit on top of
                              // the product page the customer just asked to go look at; the
                              // conversation itself stays intact in sessionStorage either way.
                              setOpen(false);
                            }}
                            onPurchase={(id) => trackEvent("chat_purchase_clicked", { productId: id })}
                          />
                        ))}
                      </div>
                    )}

                    {(() => {
                      const linkIds = new Set(m.response.linkIds ?? []);
                      if (m.response.needsHumanSupport) linkIds.add("naverTalk");
                      if (linkIds.size === 0) return null;
                      return (
                        <div className="flex flex-wrap gap-2">
                          {[...linkIds].map((id) => (
                            <LinkButton
                              key={id}
                              id={id}
                              onNavigate={(navId, isExternal) => {
                                trackEvent("chat_link_clicked", { linkId: navId });
                                if (!isExternal) setOpen(false);
                              }}
                            />
                          ))}
                        </div>
                      );
                    })()}

                    {m.response.linkIds?.includes("customFit") && <SizeCheckForm />}

                    {(() => {
                      if (!m.response.quickReplies || m.response.quickReplies.length === 0) return null;
                      // A "네이버 톡톡 상담" button is already showing whenever needsHumanSupport
                      // or linkIds already has naverTalk — don't also offer a quick-reply chip
                      // that just re-triggers the same FAQ answer and duplicates that button.
                      const alreadyOffersNaverTalk = m.response.needsHumanSupport || (m.response.linkIds ?? []).includes("naverTalk");
                      const replies = m.response.quickReplies.filter((r) => !(alreadyOffersNaverTalk && matchFaq(r)?.id === "naver-talk"));
                      if (replies.length === 0) return null;
                      return (
                        <div className="flex flex-wrap gap-2">
                          {replies.map((reply) => (
                            <button
                              key={reply}
                              type="button"
                              data-testid="chat-quick-reply"
                              onClick={() => sendUserText(reply, { viaQuickReply: true })}
                              className="min-h-11 rounded-full border border-[var(--color-brand-light)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-brand)] transition-colors hover:bg-[var(--color-muted)]"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      );
                    })()}

                    {i === messages.length - 1 && m.response.intent !== "clarification" && m.response.intent !== "fallback" && (
                      <div className="mt-0.5">
                        {!m.feedback ? (
                          <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted-foreground)]">
                            <span>답변이 도움이 되었나요?</span>
                            <button type="button" onClick={() => setFeedback(i, "helpful")} className="min-h-8 rounded-full border border-[var(--color-border)] px-2.5 py-1 font-semibold hover:border-[var(--color-brand)]">
                              도움됐어요
                            </button>
                            <button type="button" onClick={() => setFeedback(i, "not-helpful")} className="min-h-8 rounded-full border border-[var(--color-border)] px-2.5 py-1 font-semibold hover:border-[var(--color-brand)]">
                              다시 답변 받기
                            </button>
                          </div>
                        ) : m.feedback === "helpful" ? (
                          <p className="text-[11px] text-[var(--color-muted-foreground)]">피드백 감사합니다.</p>
                        ) : (
                          // "not-helpful" auto-triggers a retry (see setFeedback) — this message
                          // is replaced within the same render pass by the new user/assistant
                          // turn, so it's only ever visible for an instant.
                          <p className="text-[11px] text-[var(--color-muted-foreground)]">답변을 다시 준비하고 있어요...</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-[var(--color-muted)] px-3.5 py-2.5 text-sm text-[var(--color-muted-foreground)]" role="status">
                    답변 작성 중...
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-end gap-2 border-t border-[var(--color-border)] p-3">
            <label htmlFor="indeup-chat-input" className="sr-only">
              메시지 입력
            </label>
            <textarea
              id="indeup-chat-input"
              data-testid="chat-input"
              ref={textareaRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="궁금한 점을 입력하세요"
              maxLength={2000}
              rows={1}
              className="max-h-[120px] flex-1 resize-none rounded-2xl border border-[var(--color-border)] px-4 py-2.5 text-sm leading-6 outline-none focus:border-[var(--color-brand)]"
            />
            <button
              type="button"
              data-testid="chat-send"
              onClick={() => sendUserText(input)}
              disabled={loading || !input.trim()}
              aria-label="전송"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--color-brand)] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        data-testid="chat-fab"
        onClick={open ? handleClose : handleOpen}
        aria-label={open ? "채팅 닫기" : "AI 제품 안내 채팅 열기"}
        className="flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform duration-200 active:scale-95"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <span className="text-[11px] font-extrabold leading-none tracking-tight text-[var(--color-primary)]">AI</span>
            <span className="mt-[3px] h-[2px] w-4 rounded-full bg-[var(--color-brand)]" aria-hidden="true" />
            <span className="mt-[3px] text-[10px] font-extrabold leading-none tracking-tight text-[var(--color-brand)]">CHAT</span>
          </>
        )}
      </button>
    </div>
  );
}
