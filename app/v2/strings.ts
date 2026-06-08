export type V2Locale = "en" | "ko" | "ja";

export type V2Strings = {
  bodyTitle: string;
  thinking: string;
  sources: string;
  chips: string[];
  suggestedPrompts: string[];
  answerIntro: string;
  answerSections: { heading: string; bullets: string[] }[];
  answerOutro: { heading: string; body: string; body2: string };
  followupQuestion: string;
  followupPrompts: string[];
  utilityLabels: string[];
  composerPlaceholder: string;
  navTabs: { chat: string; wallet: string };
};

const EN: V2Strings = {
  bodyTitle: "What can I help you with?",
  thinking: "Thinking",
  sources: "Sources",
  chips: ["My health", "Screening", "Nutrition", "Prevention", "Health trends"],
  suggestedPrompts: [
    "What are common warning signs of cancer?",
    "Can vaccines for diseases such as HPV lower cancer risk?",
    "Which cancer screenings should I get for my age and health?",
  ],
  answerIntro:
    "Cancer warning signs can vary depending on the type and location, but there are some common symptoms to be aware of:",
  answerSections: [
    {
      heading: "General Warning Signs:",
      bullets: [
        "Unexplained weight loss",
        "Persistent fatigue that doesn't improve with rest",
        "Fever that comes and goes without clear cause",
        "Pain that doesn't go away or worsens over time",
      ],
    },
    {
      heading: "Physical Changes:",
      bullets: [
        "Lumps or thickening in the breast, testicles, or other parts of the body",
        "Changes in bowel or bladder habits",
        "Sores that don't heal",
        "Unusual bleeding or discharge",
        "Persistent cough or hoarseness",
        "Difficulty swallowing",
      ],
    },
    {
      heading: "Skin Changes:",
      bullets: [
        "Changes in the size, shape, or color of moles",
        "New skin growths or sores that don't heal",
      ],
    },
  ],
  answerOutro: {
    heading: "Important to Remember:",
    body:
      "These symptoms don't necessarily mean you have cancer—they can be caused by many other conditions. However, if you experience any persistent or concerning symptoms, it's important to see a doctor for proper evaluation.",
    body2:
      "Early detection through regular screenings is one of the most effective ways to catch cancer when it's most treatable. Need can help you stay on top of your recommended cancer screenings based on your personal health profile.",
  },
  followupQuestion:
    "Is there a specific type of cancer or symptom you're concerned about?",
  followupPrompts: [
    "What screening do I need?",
    "How can I prevent cancer?",
    "Book a screening",
  ],
  utilityLabels: [
    "Screening Booking",
    "Report Symptoms",
    "Analyze Reports",
    "Discover",
  ],
  composerPlaceholder: "Talk to Need",
  navTabs: { chat: "Chat", wallet: "Wallet" },
};

const KO: V2Strings = {
  bodyTitle: "무엇을 도와드릴까요?",
  thinking: "생각 중",
  sources: "출처",
  chips: ["내 건강", "검진", "영양", "예방", "건강 트렌드"],
  suggestedPrompts: [
    "암의 일반적인 경고 신호는 무엇인가요?",
    "HPV 같은 질환의 백신이 암 위험을 줄여줄 수 있나요?",
    "제 나이와 건강 상태에는 어떤 암 검진이 필요할까요?",
  ],
  answerIntro:
    "암의 경고 신호는 종류와 발생 부위에 따라 다를 수 있지만, 알아두어야 할 공통 증상이 있습니다:",
  answerSections: [
    {
      heading: "일반적인 경고 신호:",
      bullets: [
        "원인을 알 수 없는 체중 감소",
        "휴식해도 나아지지 않는 지속적인 피로감",
        "원인이 분명하지 않은 발열이 반복되는 경우",
        "사라지지 않거나 시간이 지날수록 심해지는 통증",
      ],
    },
    {
      heading: "신체 변화:",
      bullets: [
        "유방, 고환 또는 신체 다른 부위에 멍울이나 두꺼워진 부분",
        "배변 또는 배뇨 습관의 변화",
        "낫지 않는 상처",
        "비정상적인 출혈이나 분비물",
        "지속되는 기침이나 목소리 변화",
        "삼키기 어려움",
      ],
    },
    {
      heading: "피부 변화:",
      bullets: [
        "점의 크기, 모양 또는 색의 변화",
        "새로 생긴 피부 돌출물이나 낫지 않는 상처",
      ],
    },
  ],
  answerOutro: {
    heading: "꼭 기억해 두세요:",
    body:
      "이러한 증상이 반드시 암을 의미하는 것은 아니며, 다른 여러 질환으로도 나타날 수 있습니다. 다만 증상이 지속되거나 걱정된다면 정확한 진단을 위해 의사의 진료를 받으시는 것이 좋습니다.",
    body2:
      "정기 검진을 통한 조기 발견은 가장 치료 가능성이 높은 시기에 암을 찾아내는 효과적인 방법 중 하나입니다. Need가 회원님의 건강 정보를 바탕으로 권장 암 검진 일정을 챙겨드릴게요.",
  },
  followupQuestion: "특별히 걱정되는 암 종류나 증상이 있나요?",
  followupPrompts: [
    "어떤 검진을 받아야 할까요?",
    "암을 예방하려면 어떻게 해야 할까요?",
    "검진 예약하기",
  ],
  utilityLabels: ["검진 예약", "증상 기록", "리포트 분석", "둘러보기"],
  composerPlaceholder: "니드에게 말하기",
  navTabs: { chat: "대화", wallet: "지갑" },
};

const JA: V2Strings = {
  bodyTitle: "何かお手伝いできますか？",
  thinking: "考え中",
  sources: "出典",
  chips: ["私の健康", "検診", "栄養", "予防", "健康トレンド"],
  suggestedPrompts: [
    "がんの一般的な警告サインは何ですか？",
    "HPVなどの疾患のワクチンはがんリスクを下げられますか？",
    "私の年齢や健康状態にはどのがん検診が必要ですか？",
  ],
  answerIntro:
    "がんの警告サインは種類や発生部位によって異なりますが、知っておきたい共通の症状がいくつかあります:",
  answerSections: [
    {
      heading: "一般的な警告サイン:",
      bullets: [
        "原因不明の体重減少",
        "休んでも改善しない持続的な倦怠感",
        "原因がはっきりしない発熱を繰り返す",
        "おさまらない、または時間とともに悪化する痛み",
      ],
    },
    {
      heading: "身体の変化:",
      bullets: [
        "乳房や精巣、その他の部位にできたしこりや硬結",
        "排便・排尿習慣の変化",
        "治らない傷",
        "異常な出血や分泌物",
        "続く咳や声のかすれ",
        "飲み込みにくさ",
      ],
    },
    {
      heading: "皮膚の変化:",
      bullets: [
        "ほくろの大きさ、形、色の変化",
        "新しくできた皮膚の隆起や治らない傷",
      ],
    },
  ],
  answerOutro: {
    heading: "覚えておきたいこと:",
    body:
      "これらの症状が必ずしもがんを意味するわけではなく、他のさまざまな疾患でも起こりえます。ただし、症状が続く場合や気になる場合は、適切な評価のために医師の診察を受けることが大切です。",
    body2:
      "定期検診による早期発見は、最も治療しやすい段階でがんを見つけるための効果的な方法のひとつです。Needがあなたの健康プロファイルに合わせて、推奨されるがん検診をしっかりサポートします。",
  },
  followupQuestion: "気になる特定のがんや症状はありますか？",
  followupPrompts: [
    "どの検診を受けるべきですか？",
    "がんを予防するにはどうすればよいですか？",
    "検診を予約する",
  ],
  utilityLabels: ["検診予約", "症状を記録", "レポート分析", "探す"],
  composerPlaceholder: "Needに話しかける",
  navTabs: { chat: "チャット", wallet: "ウォレット" },
};

export function getV2Strings(locale: V2Locale = "en"): V2Strings {
  if (locale === "ko") return KO;
  if (locale === "ja") return JA;
  return EN;
}
