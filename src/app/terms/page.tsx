import type { Metadata } from "next";
import Header from "@/components/Header";
import { legalName, representativeName, supportPhone, businessAddress, naverStoreUrl } from "@/lib/brand";

export const metadata: Metadata = {
  title: "이용약관",
  description: "인디업(INDEUP) 공식 홈페이지의 이용약관입니다.",
  alternates: {
    canonical: "/terms/",
  },
  openGraph: {
    title: "이용약관 | 인디업 INDEUP",
    description: "인디업(INDEUP) 공식 홈페이지의 이용약관입니다.",
    url: "/terms/",
  },
};

function Article({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[var(--color-primary)]">
        제{num}조 ({title})
      </h2>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />
      <main className="flex-1 px-6 py-20 sm:px-12 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
            Terms
          </p>
          <h1 className="mt-4 font-semibold tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
            이용약관
          </h1>
          <p className="mt-6 text-base leading-[1.4] text-[var(--color-secondary)]">
            {legalName}(이하 &lsquo;회사&rsquo;)는 인디업(INDEUP) 공식 홈페이지(이하
            &lsquo;홈페이지&rsquo;)를 운영하며, 본 약관은 홈페이지가 제공하는 정보 열람
            서비스의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을
            규정함을 목적으로 합니다.
          </p>

          <div className="mt-10 flex flex-col gap-10 text-base leading-[1.4] text-[var(--color-secondary)]">
            <Article num={1} title="목적">
              <p>
                본 약관은 회사가 운영하는 홈페이지를 이용함에 있어 회사와
                이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을
                목적으로 합니다.
              </p>
            </Article>

            <Article num={2} title="정의">
              <ul className="list-disc pl-5">
                <li>&lsquo;홈페이지&rsquo;란 회사가 운영하는 인디업(INDEUP) 공식 웹사이트를 말합니다.</li>
                <li>
                  &lsquo;이용자&rsquo;란 홈페이지에 접속하여 본 약관에 따라 회사가 제공하는
                  정보를 이용하는 모든 방문자를 말합니다.
                </li>
                <li>
                  &lsquo;공식 판매처&rsquo;란 실제 상품 주문·결제·배송이 이루어지는 네이버
                  브랜드스토어({naverStoreUrl})를 말합니다.
                </li>
              </ul>
            </Article>

            <Article num={3} title="약관의 게시와 개정">
              <p>
                회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 홈페이지
                초기 화면 또는 연결 화면에 게시합니다. 회사는 관계 법령을
                위반하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시
                적용일자 및 개정사유를 명시하여 그 적용일자 7일 전부터
                홈페이지에 공지합니다.
              </p>
            </Article>

            <Article num={4} title="서비스의 내용">
              <p>회사는 홈페이지를 통해 다음과 같은 정보를 제공합니다.</p>
              <ul className="list-disc pl-5">
                <li>인디업 브랜드 및 제품 소개</li>
                <li>제품별 규격·구성·제작 방식 등 제품 정보</li>
                <li>공간 크기에 맞는 책상 사이즈를 확인하는 자가진단 도구</li>
                <li>책상 사이즈·배치와 관련한 정보성 콘텐츠(가이드)</li>
              </ul>
              <p>
                홈페이지는 정보 제공을 목적으로 하며, 회원가입이나 로그인 절차
                없이 누구나 열람할 수 있습니다. 홈페이지 자체에서는 상품 주문,
                결제, 배송 등 전자상거래 기능을 제공하지 않습니다.
              </p>
            </Article>

            <Article num={5} title="실제 거래에 관한 사항">
              <p>
                인디업 제품의 주문·결제·배송·교환·환불 등 실제 거래는
                홈페이지가 아닌 공식 판매처(네이버 브랜드스토어)를 통해서만
                이루어집니다. 홈페이지의 &lsquo;공식 스토어에서 구매하기&rsquo; 등의
                버튼은 공식 판매처로 이동하는 안내 링크이며, 그 이후의 주문·
                결제·배송·청약철회·교환·환불 등 거래에 관한 사항은 본
                약관이 아니라 네이버 브랜드스토어의 이용약관 및 「전자상거래
                등에서의 소비자보호에 관한 법률」 등 관계 법령이 적용됩니다.
              </p>
            </Article>

            <Article num={6} title="이용자의 의무">
              <p>이용자는 홈페이지 이용과 관련하여 다음 행위를 하여서는 안 됩니다.</p>
              <ul className="list-disc pl-5">
                <li>홈페이지에 게시된 정보를 무단으로 복제·배포·전송·전시하는 행위</li>
                <li>홈페이지의 안정적 운영을 방해하는 행위(과도한 트래픽 유발, 자동화된 접근 등)</li>
                <li>회사 또는 제3자의 지식재산권을 침해하는 행위</li>
                <li>기타 관계 법령 또는 공서양속에 위반되는 행위</li>
              </ul>
            </Article>

            <Article num={7} title="지식재산권">
              <p>
                홈페이지에 게시된 텍스트, 이미지, 영상, 로고, 디자인 등에 대한
                저작권 및 지식재산권은 회사에 귀속되며, 이용자는 회사의 사전
                서면 동의 없이 이를 영리 목적으로 복제·수정·배포·전송할 수
                없습니다.
              </p>
            </Article>

            <Article num={8} title="정보의 정확성">
              <p>
                회사는 홈페이지에 게시하는 제품 규격, 제작 기간, 브랜드 정보
                등이 정확하도록 노력하나, 제품 사양은 제작 여건에 따라 사전
                고지 없이 변경될 수 있습니다. 실제 구매 시 정확한 사양과
                가격은 공식 판매처의 게시 정보를 기준으로 합니다.
              </p>
            </Article>

            <Article num={9} title="책임의 제한">
              <p>
                회사는 천재지변, 통신장애 등 회사가 통제할 수 없는 사유로
                인한 서비스 중단에 대해서는 책임을 지지 않습니다. 회사는
                홈페이지를 통해 링크된 네이버 브랜드스토어, 네이버 블로그,
                유튜브, 인스타그램 등 제3자가 운영하는 서비스의 내용, 정책 및
                그로 인해 발생한 손해에 대해서는 책임을 지지 않습니다.
              </p>
            </Article>

            <Article num={10} title="분쟁해결 및 관할법원">
              <p>
                본 약관과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는
                대한민국 법을 적용하며, 소송이 제기될 경우 민사소송법상의
                관할법원에 제기합니다.
              </p>
            </Article>

            <Article num={11} title="문의처">
              <p>
                본 약관과 관련한 문의사항은 아래 연락처로 문의해 주시기
                바랍니다.
              </p>
              <p>
                {legalName} (대표 {representativeName})
                <br />
                연락처 {supportPhone}
                <br />
                주소 {businessAddress.addressRegion} {businessAddress.addressLocality} {businessAddress.streetAddress}
              </p>
            </Article>

            <p className="border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-muted-foreground)]">
              공고일 2026년 7월 24일
              <br />
              시행일 2026년 7월 24일
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
