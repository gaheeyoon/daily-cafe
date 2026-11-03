/* ============================================================
   하루찻집 아카이브 데이터
   - 이 파일만 고치면 방명록 · 포토월 · 사진 · 결산 페이지에 반영됩니다.
   - 사진 파일은 photos/wall/ (포토월), photos/gallery/ (사진) 폴더에 넣고
     아래 src 에 파일 경로를 적어 주세요.
   - 아래 내용은 모두 "예시"입니다. 실제 내용으로 교체해 주세요.
   ============================================================ */
window.ARCHIVE = {

  /* 방명록: 오프라인 방명록을 찍은 사진 (순서대로 표시)
     - 원본: photos/guestbook/01.jpg  (가로 1800px 권장)
     - 썸네일: photos/guestbook/thumb/01.jpg (가로 600px) — 없으면 원본을 사용 */
  guestbook: [
    { src: "photos/guestbook/01.jpg", thumb: "photos/guestbook/thumb/01.jpg" },
    { src: "photos/guestbook/02.jpg", thumb: "photos/guestbook/thumb/02.jpg" },
    { src: "photos/guestbook/03.jpg", thumb: "photos/guestbook/thumb/03.jpg" },
    { src: "photos/guestbook/04.jpg", thumb: "photos/guestbook/thumb/04.jpg" },
    { src: "photos/guestbook/05.jpg", thumb: "photos/guestbook/thumb/05.jpg" }
  ],

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
