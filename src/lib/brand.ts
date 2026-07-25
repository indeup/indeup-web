/**
 * Single source of truth for brand-level facts that were previously
 * duplicated as literal strings across ~10 files (layout.tsx, Footer,
 * Header, brand/page.tsx, etc.) — all with identical values already (no
 * conflicts found when consolidating), so this is a pure de-duplication,
 * not a data change. Anything here should only ever be edited in one place.
 */

export const siteUrl = "https://indeup.com";

export const brandNameKo = "인디업";
export const brandNameEn = "INDEUP";
/** Real registered operating entity — not a placeholder. */
export const legalName = "스니처";
export const representativeName = "하민성";

export const supportPhone = "1668-5738";
export const supportPhoneDisplay = `고객센터 ${supportPhone}`;
export const supportEmail = "contact@indeup.com";

/** Real registration numbers, required disclosures under Korea's
 *  전자상거래법 — sourced from the actual 사업자등록증 / 통신판매업신고증. */
export const businessRegistrationNumber = "621-10-50306";
export const mailOrderSalesNumber = "제2024-경남김해-0892호";

export const businessAddress = {
  streetAddress: "동북로473번길 385-14",
  addressLocality: "김해시",
  addressRegion: "경남",
  addressCountry: "KR",
} as const;

export const logoUrl = `${siteUrl}/INDEUP_LOGO.svg`;

export const naverStoreUrl = "https://brand.naver.com/indeup";
export const naverBlogUrl = "https://blog.naver.com/indeup_official";
export const naverTalkUrl = "https://talk.naver.com/profile/wcs0s3";
export const tistoryUrl = "https://indeup.tistory.com/";
export const youtubeUrl = "https://www.youtube.com/@indeup";
export const instagramUrl = "https://www.instagram.com/indeup.kr";

/** Real official channels only — every entry here is safe to use in
 *  Organization.sameAs. Remove an entry here (not per-callsite) if a
 *  channel is ever discontinued. */
export const officialChannels = [naverStoreUrl, naverBlogUrl, tistoryUrl, youtubeUrl, instagramUrl] as const;
