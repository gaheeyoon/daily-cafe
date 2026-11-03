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


  /* 방명록 페이지는 폴더별로 사진이 자동 표시됩니다 (파일명 순).
       guestbook/  손글씨 방명록
       children/   용돈을 기부해 준 어린이들
       envelopes/  기부 봉투에 글귀를 남겨 주신 분들 (사진이 없으면 섹션이 숨겨집니다)
     방명록: guestbook/ 폴더에 올린 사진이 파일명 순서대로 자동 표시됩니다.
     (GitHub 저장소의 guestbook 폴더에 jpg·png·webp 사진을 올리기만 하면 됩니다.)
     아래 목록은 GitHub 에서 폴더를 읽어 오지 못할 때(로컬 미리보기 등)만 쓰는 예비용이며, 비워 두어도 됩니다. */
  guestbook: [],

  /* 포토월: photos/wall/ 폴더의 사진이 자동 표시됩니다. (아래는 예비용, 비워 두어도 됩니다) */
  photowall: [
    // { src: "photos/wall/01.jpg", caption: "학부모회 임원진" },
  ],

  /* 사진: photos/gallery/ 폴더의 사진이 자동 표시됩니다. (아래는 예비용, 비워 두어도 됩니다) */
  photos: [
    // { src: "photos/gallery/01.jpg", caption: "행사 준비" },
  ],

  /* 결산 — 후원 물품 (금액은 표시하지 않습니다)
     goods: 품목 / qty: 개수 (숫자, 모르면 null → "개" 가 자동으로 붙습니다) / donor: 후원자 (없으면 "") */
  summary: {
    note: "수익금 전액은 태안군청소년 장학기금으로 전달됩니다.",
    sponsors: [
      { goods: "가래떡", qty: 70, donor: "정선교" },
      { goods: "떡국떡", qty: 50, donor: "홍선희" },
      { goods: "샤브마니아외식상품권", qty: 10, donor: "이준규·홍선희" },
      { goods: "쌀(10kg)", qty: 20, donor: "홍민기·홍선희" },
      { goods: "쌀(10kg)", qty: 10, donor: "정선교" },
      { goods: "활새우1kg", qty: 10, donor: "진수일·박지혜" },
      { goods: "고구마(하)5kg", qty: 15, donor: "박지혜" },
      { goods: "고구마(혼합)3kg", qty: 10, donor: "윤가희" },
      { goods: "립스틱(3개set)", qty: 30, donor: "김민경" },
      { goods: "유기농 쨈", qty: 12, donor: "" },
      { goods: "비건치약", qty: 20, donor: "" },
      { goods: "새치커버스틱", qty: 10, donor: "이가영" },
      { goods: "건강즙 4종", qty: 30, donor: "유명근" },
      { goods: "마스크팩", qty: 50, donor: "김천호" },
      { goods: "비맥스(영양제)", qty: 30, donor: "" },
      { goods: "리시브(영양제)", qty: 34, donor: "" },
      { goods: "자담치킨외식상품권", qty: 4, donor: "임환·국은희" },
      { goods: "장아찌, 묵은지", qty: null, donor: "오진아" }
    ]
  }
};
