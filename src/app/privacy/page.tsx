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
                신청 등)을 운영하고 있지 않습니다. 이에 따라 현재 홈페이지
                자체를 열람하는 행위만으로는 회사가 개인정보를 별도로
                수집·저장하지 않습니다.
              </p>
              <p>
                다만 아래와 같이 홈페이지 이용 과정에서 발생할 수 있는
                정보의 흐름이 있으며, 각 항목의 처리 주체를 명확히
                안내합니다.
              </p>
            </Article>

            <Article num={2} title="처리하는 개인정보의 항목">
              <p>
                회사가 홈페이지를 통해 직접 수집·보유하는 개인정보 항목은
                없습니다. 다만 웹서버 운영 과정에서 접속 로그, IP 주소 등이
                호스팅사(카페24 주식회사)의 서버에 자동으로 생성·보관될 수
                있으며, 이는 서비스 안정성 확보와 부정 이용 방지 목적의
                최소한의 기술적 기록입니다.
              </p>
            </Article>

            <Article num={3} title="개인정보의 처리 및 보유 기간">
              <p>
                회사가 직접 수집하는 개인정보가 없으므로 별도의 보유·이용
                기간이 발생하지 않습니다. 제2조의 접속 로그는 호스팅사의
                운영 정책 및 「통신비밀보호법」 등 관계 법령에 따른 기간
                동안 보관 후 파기됩니다.
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
                회사는 홈페이지의 안정적 운영을 위해 아래와 같이 웹호스팅
                업무를 위탁하고 있습니다.
              </p>
              <ul className="list-disc pl-5">
                <li>수탁업체: 카페24 주식회사</li>
                <li>위탁업무: 웹사이트 호스팅 및 서버 운영</li>
              </ul>
              <p>
                회사는 위탁계약 체결 시 「개인정보 보호법」에 따라 수탁자가
                개인정보를 안전하게 처리하도록 관리·감독합니다.
              </p>
            </Article>

            <Article num={6} title="쿠키(Cookie)의 설치·운영 및 거부">
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

            <Article num={7} title="정보주체의 권리·의무 및 행사 방법">
              <p>
                정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·
                처리정지 등을 요구할 권리를 행사할 수 있습니다. 다만
                제1조에서 안내한 바와 같이 회사가 직접 보유한 개인정보가
                없으므로, 실제 권리 행사는 대부분 네이버 브랜드스토어(구매
                관련) 또는 Instagram(임베드 관련) 등 각 서비스 제공자를
                통해 이루어져야 하는 경우가 많습니다. 회사와 관련한 사항은
                아래 제9조의 연락처로 문의해 주시면 관계 법령에 따라
                신속히 조치하겠습니다.
              </p>
            </Article>

            <Article num={8} title="개인정보의 안전성 확보조치">
              <p>
                회사는 개인정보 보호를 위해 다음과 같은 조치를 취하고
                있습니다.
              </p>
              <ul className="list-disc pl-5">
                <li>불필요한 개인정보 입력 양식을 홈페이지에 두지 않음</li>
                <li>홈페이지 전송 구간 HTTPS(SSL) 암호화 적용</li>
                <li>웹서버 접근 및 관리 권한의 최소화</li>
              </ul>
            </Article>

            <Article num={9} title="개인정보 보호책임자">
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

            <Article num={10} title="권익침해 구제방법">
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

            <Article num={11} title="개인정보 처리방침의 변경">
              <p>
                이 개인정보 처리방침은 홈페이지에 문의 폼·회원가입·결제
                기능 등이 새로 추가되는 경우 그 내용을 반영해 개정될 수
                있으며, 변경 시 이 페이지를 통해 공지합니다.
              </p>
            </Article>

            <p className="border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-muted-foreground)]">
              공고일 2026년 7월 21일
              <br />
              시행일 2026년 7월 21일
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
