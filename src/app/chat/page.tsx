import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const pageTitle = "AI 챗봇 상담 | 인디업";
const pageDescription = "인디업 AI 상담 도우미에게 책상 사이즈, 제품 추천, 배송·조립 관련 질문을 바로 물어보세요.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: {
    canonical: "/chat/",
  },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: "/chat/",
  },
};

export default function ChatPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:px-12 sm:py-32">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
          AI Assistant
        </p>
        <h1 className="mt-4 max-w-lg font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
          궁금한 점을 바로 물어보세요.
        </h1>
        <p className="mt-4 max-w-md text-base leading-[1.3] text-[var(--color-secondary)] sm:text-lg">
          제품 추천, 사이즈 확인, 배송·조립 안내까지
          <br />
          오른쪽 아래 채팅창에서 바로 답을 드립니다.
        </p>
      </main>

      <Footer />
    </div>
  );
}
