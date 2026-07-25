// Shared keyword → guide-category matcher used by both fetch scripts, so a
// blog post's real Naver tags and a YouTube video's real title can both be
// filed under the same 7 category buttons the /guide page's search UI uses.
// Nothing here invents data — it only classifies text that was already real.

export const CATEGORIES = [
  "원룸 책상",
  "컴퓨터 책상",
  "2인용 책상",
  "책상 깊이",
  "책상 높이",
  "공간 배치",
  "맞춤 제작",
];

const CATEGORY_KEYWORDS = {
  "원룸 책상": ["원룸", "자취방", "복층", "원룸책상"],
  "컴퓨터 책상": ["컴퓨터책상", "컴퓨터 책상", "모니터", "PC", "게이밍"],
  "2인용 책상": ["2인용", "커플", "형제", "자매", "부부", "듀얼모니터"],
  "책상 깊이": ["깊이"],
  "책상 높이": ["높이"],
  "공간 배치": ["배치", "공간활용", "공간 활용", "인테리어", "동선", "구조"],
  "맞춤 제작": ["맞춤", "주문제작", "맞춤제작", "맞춤책상", "제작"],
};

export function matchCategories(text) {
  if (!text) return [];
  const found = new Set();
  for (const category of CATEGORIES) {
    const keywords = CATEGORY_KEYWORDS[category];
    if (keywords.some((kw) => text.includes(kw))) found.add(category);
  }
  return [...found];
}
