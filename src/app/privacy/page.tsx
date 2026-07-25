import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "인디업(INDEUP) 공식 홈페이지의 개인정보 처리방침입니다.",
  alternates: {
    canonical: "/privacy/",
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

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />
      <main className="flex-1 px-6 py-20 sm:px-12 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
            Privacy
          </p>
          <h1
            className="mt-4 font-bold tracking-[-0.02em]"
            style={{ fontSize: "var(--type-h2)" }}
          >
            개인정보처리방침
          </h1>
          <p className="mt-6 text-base leading-7 text-[var(--color-secondary)]">
            스니처(이하 &lsquo;회사&rsquo;)는 인디업(INDEUP) 공식 홈페이지(이하
            &lsquo;홈페이지&rsquo;)를 운영하며, 「개인정보 보호법」 제30조에
            따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고
            원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을
            수립·공개합니다.
          </p>

          <div className="mt-10 flex flex-col gap-10 text-base leading-7 text-[var(--color-secondary)]">
            <Article num={1} title="개인정보의 처리 목적 및 현재 처리 현황">
              <p>
                홈페이지는 회원가입, 주문·결제 기능을 제공하지 않으며, 이름·
                연락처·주소 등을 입력받는 별도의 양식(문의 폼, 뉴스레터
                신청 등)을 운영하고 있지 않습니다. 이에 따라 홈페이지를
                열람하는 행위만으로는 회사가 개인정보를 별도로 수집·저장하지
                않습니다.
              </p>
              <p>
                다만 홈페이지에 설치된 AI 챗봇(베타)을 이용해 직접 질문을
                입력하는 경우, 그 질문 내용은 답변 생성과 서비스 품질 개선을
                목적으로 처리됩니다. AI 챗봇은 이름·전화번호·주소·주문번호
                등을 먼저 요구하지 않으며, 이용자가 자발적으로 입력한 내용에
                한해 아래 제2조·제3조·제6조에 따라 처리됩니다.
              </p>
            </Article>

            <Article num={2} title="처리하는 개인정보의 항목">
              <p>
                회사가 홈페이지를 통해 직접 수집·보유하는 개인정보 항목은
                원칙적으로 없습니다. 다만 웹서버 운영 과정에서 접속 로그, IP
                주소 등이 호스팅사(카페24 주식회사)의 서버에 자동으로
                생성·보관될 수 있으며, 이는 서비스 안정성 확보와 부정 이용
                방지 목적의 최소한의 기술적 기록입니다.
              </p>
              <p>
                AI 챗봇 이용 시에는 이용자가 입력한 질문 내용과 챗봇이 분류한
                문의 유형(예: 제품 추천, 배송 문의 등)이 저장될 수 있습니다.
                전화번호, 이메일, 주문번호 등 식별 가능한 정보가 질문에
                포함된 경우 저장 전 자동으로 마스킹 처리되며, 도배성 요청을
                막기 위해 접속 IP가 짧은 시간(최대 90초) 동안 일시적으로만
                처리됩니다.
              </p>
            </Article>

            <Article num={3} title="개인정보의 처리 및 보유 기간">
              <p>
                회사가 직접 수집하는 개인정보가 없으므로 별도의 보유·이용
                기간이 발생하지 않습니다. 제2조의 접속 로그는 호스팅사의
                운영 정책 및 「통신비밀보호법」 등 관계 법령에 따른 기간
                동안 보관 후 파기됩니다.
              </p>
              <p>
                AI 챗봇의 질문·문의유형 기록은 서비스 개선 목적 달성에
                필요한 범위에서 최대 180일간 보관 후 자동 파기됩니다. 도배성
                요청 방지를 위해 일시적으로 처리되는 접속 IP는 90초 이내에
                자동 삭제됩니다.
              </p>
            </Article>

            <Article num={4} title="개인정보의 제3자 제공">
              <p>
                회사는 정보주체의 개인정보를 제3자에게 제공하지 않습니다.
                단, 실제 상품 구매는 홈페이지가 아닌 네이버 브랜드스토어를
                통해 이루어지며, 이 경우 주문·배송·결제에 필요한 개인정보는
                구매자가 네이버 브랜드스토어에 직접 제공하는 것으로, 해당
                정보의 처리는 네이버(주)의 개인정보처리방침이 적용됩니다.
              </p>
            </Article>

            <Article num={5} title="개인정보 처리의 위탁">
              <p>
                회사는 홈페이지의 안정적 운영과 AI 챗봇 서비스 제공을 위해
                아래와 같이 업무를 위탁하고 있습니다.
              </p>
              <ul className="list-disc pl-5">
                <li>수탁업체: 카페24 주식회사 — 위탁업무: 웹사이트 호스팅 및 서버 운영</li>
                <li>
                  수탁업체: Cloudflare, Inc. — 위탁업무: AI 챗봇 요청 중계 및
                  질문·문의유형 기록 보관(Cloudflare Workers, Workers KV)
                </li>
              </ul>
              <p>
                회사는 위탁계약 체결 시 「개인정보 보호법」에 따라 수탁자가
                개인정보를 안전하게 처리하도록 관리·감독합니다.
              </p>
            </Article>

            <Article num={6} title="개인정보의 국외 이전">
              <p>
                AI 챗봇이 답변을 생성하는 과정에서 이용자가 입력한 질문
                내용은 AI 응답 생성을 위해 미국 소재 Anthropic, PBC의
                서버로 전송됩니다. Cloudflare, Inc. 역시 전세계 데이터
                센터를 통해 서비스를 제공하는 사업자로, 처리 위치가
                국내로 한정되지 않을 수 있습니다.
              </p>
              <ul className="list-disc pl-5">
                <li>이전받는 자: Anthropic, PBC / Cloudflare, Inc.</li>
                <li>이전 목적: AI 챗봇 답변 생성 및 서비스 제공(인프라 운영)</li>
                <li>이전되는 항목: 이용자가 챗봇에 직접 입력한 질문 내용</li>
                <li>이전 국가·시점·방법: 미국 등, 챗봇 이용 시점, 네트워크를 통한 전송</li>
                <li>보유·이용 기간: 제3조에 따름</li>
              </ul>
              <p>
                두 업체 모두 자체 개인정보 보호정책 및 관련 법령에 따라
                정보를 처리하며, 회사는 AI 챗봇이 이름·전화번호·주소·주문번호
                등을 먼저 요구하지 않도록 운영하여 국외로 이전되는 정보를
                최소화하고 있습니다.
              </p>
            </Article>

            <Article num={7} title="쿠키(Cookie)의 설치·운영 및 거부">
              <p>
                홈페이지는 자체적으로 방문자를 식별하기 위한 쿠키를
                설치하지 않습니다. 다만 홈페이지에는 인스타그램(Instagram)
                공식 게시물이 임베드되어 있으며, 이 임베드 콘텐츠를
                불러오는 과정에서 Instagram을 운영하는 Meta의 정책에 따라
                쿠키 등이 설치될 수 있습니다. 이는 회사가 아닌 Meta가
                처리하는 영역이며, 이용자는 웹브라우저 설정에서 쿠키 저장을
                거부할 수 있습니다. 다만 이 경우 임베드된 콘텐츠의 일부
                기능이 정상적으로 표시되지 않을 수 있습니다.
              </p>
            </Article>

            <Article num={8} title="정보주체의 권리·의무 및 행사 방법">
              <p>
                정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·
                처리정지 등을 요구할 권리를 행사할 수 있습니다. AI 챗봇에
                입력한 질문 기록에 대한 열람·삭제 요청도 아래 제10조의
                연락처로 문의해 주시면 확인 후 조치합니다. 그 밖의 사항은
                제1조에서 안내한 바와 같이 회사가 직접 보유한 개인정보가
                없으므로, 실제 권리 행사는 대부분 네이버 브랜드스토어(구매
                관련) 또는 Instagram(임베드 관련) 등 각 서비스 제공자를
                통해 이루어져야 하는 경우가 많습니다.
              </p>
            </Article>

            <Article num={9} title="개인정보의 안전성 확보조치">
              <p>
                회사는 개인정보 보호를 위해 다음과 같은 조치를 취하고
                있습니다.
              </p>
              <ul className="list-disc pl-5">
                <li>불필요한 개인정보 입력 양식을 홈페이지에 두지 않음</li>
                <li>홈페이지 전송 구간 HTTPS(SSL) 암호화 적용</li>
                <li>웹서버 접근 및 관리 권한의 최소화</li>
                <li>AI 챗봇 기록 저장 전 전화번호·이메일 등 식별정보 자동 마스킹</li>
                <li>AI 챗봇 기록의 보유기간 제한(최대 180일) 및 기간 경과 후 자동 파기</li>
              </ul>
            </Article>

            <Article num={10} title="개인정보 보호책임자">
              <p>
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이
                개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <p>
                성명 하민성 (대표)
                <br />
                연락처 1668-5738
                <br />
                주소 경남 김해시 동북로473번길 385-14
              </p>
            </Article>

            <Article num={11} title="권익침해 구제방법">
              <p>
                정보주체는 개인정보침해로 인한 구제를 받기 위하여
                개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터
                등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에
                기타 개인정보침해의 신고, 상담에 대하여는 아래 기관에
                문의하시기 바랍니다.
              </p>
              <ul className="list-disc pl-5">
                <li>개인정보분쟁조정위원회 (1833-6972, kopico.go.kr)</li>
                <li>개인정보침해신고센터 (118, privacy.kisa.or.kr)</li>
                <li>대검찰청 사이버범죄수사단 (1301, spo.go.kr)</li>
                <li>경찰청 사이버수사국 (182, ecrm.cyber.go.kr)</li>
              </ul>
            </Article>

            <Article num={12} title="개인정보 처리방침의 변경">
              <p>
                이 개인정보 처리방침은 홈페이지에 문의 폼·회원가입·결제
                기능 등이 새로 추가되거나 AI 챗봇의 처리 방식이 변경되는
                경우 그 내용을 반영해 개정될 수 있으며, 변경 시 이 페이지를
                통해 공지합니다.
              </p>
            </Article>

            <p className="border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-muted-foreground)]">
              공고일 2026년 7월 25일
              <br />
              시행일 2026년 7월 25일
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
