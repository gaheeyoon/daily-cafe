/* ============================================================
   하루찻집 아카이브 데이터
   - 이 파일만 고치면 방명록 · 포토월 · 사진 · 결산 페이지에 반영됩니다.
   - 사진 파일은 photos/wall/ (포토월), photos/gallery/ (사진) 폴더에 넣고
     아래 src 에 파일 경로를 적어 주세요.
   - 아래 내용은 모두 "예시"입니다. 실제 내용으로 교체해 주세요.
   ============================================================ */
window.ARCHIVE = {

  /* 폴더 자동 읽기에 쓰는 저장소 정보 */
  github: { owner: "gaheeyoon", repo: "daily-cafe", branch: "main" },


  /* 방명록: guestbook/ 폴더에 올린 사진이 파일명 순서대로 자동 표시됩니다.
     (GitHub 저장소의 guestbook 폴더에 jpg·png·webp 사진을 올리기만 하면 됩니다.)
     아래 목록은 GitHub 에서 폴더를 읽어 오지 못할 때(로컬 미리보기 등)만 쓰는 예비용이며, 비워 두어도 됩니다. */
  guestbook: [],

  /* 포토월: 포토월 앞에서 찍은 사진 */
  photowall: [
    // { src: "photos/wall/01.jpg", caption: "학부모회 임원진" },
  ],

  /* 사진: 행사 현장 사진 */
  photos: [
    // { src: "photos/gallery/01.jpg", caption: "행사 준비" },
  ],

  /* 결산 (금액 단위: 원) — 합계와 장학기금은 자동 계산됩니다 */
  summary: {
    stats: [
      { k: "참석", v: "000명" },
      { k: "후원처", v: "00곳" },
      { k: "회차", v: "3회" }
    ],
    income: [
      { label: "음료·다과 판매", amount: 0 },
      { label: "후원금", amount: 0 },
      { label: "물품 판매", amount: 0 }
    ],
    expense: [
      { label: "재료비", amount: 0 },
      { label: "대관·행사 경비", amount: 0 }
    ],
    donation: "태안군청소년 장학기금으로 전달됩니다.",   // 전달 안내 문구
    sponsors: [
      { goods: "쌀 200kg", donor: "홍길동" },
      { goods: "샤브마니아 50만원 상당", donor: "홍길동" }
    ]
  }
};
