console.log("main.js 연결됨!");

function updateStartImage() {
  const startImg = document.querySelector('.start');
  if (!startImg) return;
  if (window.innerWidth <= 768) {
    startImg.src = 'images/title.png';
    startImg.style.top = '30%';
  } else {
    startImg.src = 'images/start bt.png';
    startImg.style.top = ''; // PC 기본 위치로 되돌림
  }
}

window.addEventListener('load', updateStartImage);
window.addEventListener('resize', updateStartImage);

// === 공통: 환경설정 패널 열고닫기(.prefs, .prefs-trigger, #prefs-panel 있으면 동작) ===
(() => {
  const prefs   = document.querySelector(".prefs");
  const trigger = document.querySelector(".prefs-trigger");
  const panel   = document.getElementById("prefs-panel");
  if (!prefs || !trigger || !panel) return;

  // 초기 aria 상태(선택)
  trigger.setAttribute("aria-expanded", "false");

  trigger.addEventListener("click", () => {
    const isOpen = prefs.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!prefs.contains(e.target) && prefs.classList.contains("open")) {
      prefs.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
})();


// === 공통: 다크모드(어떤 페이지든 .toggle-dark 있으면 동작) ===
(() => {
  const btn = document.querySelector(".toggle-dark");
  if (!btn) return;

  const body = document.body;
  const saved = localStorage.getItem("cc.theme") === "dark";
  const apply = (on) => {
    body.dataset.theme = on ? "dark" : "";
    btn.textContent = on ? "ON" : "OFF";
    btn.setAttribute("aria-pressed", String(on));
    localStorage.setItem("cc.theme", on ? "dark" : "");
  };

  apply(saved);
  btn.addEventListener("click", () => apply(!(body.dataset.theme === "dark")));
})();


/* ===================
   fic view
=================== */

// 페이지 스코프
(() => {
  const root = document.documentElement;
  const body = document.body;
  if (body.dataset.page !== "fic-view") return;

  // ---------- 환경설정 패널 ----------
/*const prefs   = document.querySelector(".prefs");
const trigger = document.querySelector(".prefs-trigger");
const panel   = document.getElementById("prefs-panel");

if (prefs && trigger && panel) {
   trigger.addEventListener("click", () => {
     const isOpen = prefs.classList.toggle("open");
     trigger.setAttribute("aria-expanㄴded", String(isOpen));
  });
   document.addEventListener("click", (e) => {
     if (!prefs.contains(e.target) && prefs.classList.contains("open")) {
       prefs.classList.remove("open");
       trigger.setAttribute("aria-expanded", "false");
     }
   });
 }*/

  /*// ---------- 다크 모드 ----------
  const darkBtn = document.querySelector(".toggle-dark");
  const applyDark = (on) => {
    body.dataset.theme = on ? "dark" : "";
    if (darkBtn) {
     darkBtn.textContent = on ? "ON" : "OFF";
     darkBtn.setAttribute("aria-pressed", String(on));
   }
  };
  if (darkBtn) {
   darkBtn.addEventListener("click", () => {
     applyDark(!(body.dataset.theme === "dark"));
   });
 }*/

  // ---------- 타이포 프리셋(모바일/데스크탑 × 폰트 × 단계) ----------
// 필요하면 숫자 자유롭게 바꿔. size=px, lh=unitless, track=em 단위로.
const typeSteps = {
  mobile: {
    a: [ // Pretendard
      { size: 14, lh: 1.74, track: "-0.005em" }, // 1
      { size: 15, lh: 1.74, track: "-0.005em" }, // 2
      { size: 16.5, lh: 1.74, track: "-0.005em" }, // 3
    ],
    b: [ // book
      { size: 14, lh: 2.05, track: "0em"     },
      { size: 15, lh: 2.00, track: "0em"     },
      { size: 16, lh: 2.00, track: "0em"     },
    ],
    c: [ // 1945
      { size: 14, lh: 1.90, track: "-0.02em" },
      { size: 15, lh: 1.90, track: "-0.02em" },
      { size: 16, lh: 1.90, track: "-0.02em" },
    ],
    d: [ // yes
      { size: 14, lh: 1.9, track: "-0.02em" },
      { size: 15, lh: 1.9, track: "-0.02em" },
      { size: 16, lh: 1.9, track: "-0.02em" },
    ],
    _default: [
      { size: 14, lh: 1.74, track: "-0.01em" },
      { size: 15, lh: 1.74, track: "-0.01em" },
      { size: 16, lh: 1.74, track: "-0.01em" },
    ],
  },
  desktop: {
    a: [
      { size: 15, lh: 1.74, track: "-0.01em" },
      { size: 16, lh: 1.74, track: "-0.01em" },
      { size: 17, lh: 1.74, track: "-0.01em" },
    ],
    b: [
      { size: 15, lh: 2.00, track: "0em"     },
      { size: 16, lh: 2.00, track: "0em"     },
      { size: 17, lh: 2.00, track: "0em"     },
    ],
    c: [
      { size: 15, lh: 1.90, track: "-0.02em" },
      { size: 16, lh: 1.90, track: "-0.02em" },
      { size: 17, lh: 1.90, track: "-0.02em" },
    ],
    d: [
      { size: 15, lh: 1.92, track: "-0.02em" },
      { size: 16, lh: 1.92, track: "-0.02em" },
      { size: 17, lh: 1.92, track: "-0.02em" },
    ],
    _default: [
      { size: 15, lh: 1.74, track: "-0.01em" },
      { size: 16, lh: 1.74, track: "-0.01em" },
      { size: 17, lh: 1.74, track: "-0.01em" },
    ],
  }
};

// ---------- 유틸 ----------
const reading = document.getElementById("reading");
const chips   = document.querySelectorAll(".font-chip");
const dec     = document.querySelector(".size-dec");
const inc     = document.querySelector(".size-inc");
const out     = document.querySelector(".size-state");

const isMobileMQ = () => matchMedia("(max-width: 572px)").matches;
const mode = () => (isMobileMQ() ? "mobile" : "desktop");

// 현재 상태(폰트/단계/테마) 기억하기
const loadState = () => ({
  font: localStorage.getItem("cc.font") || "a",
  step: Number(localStorage.getItem("cc.step") ?? (isMobileMQ() ? 0 : 1)), // mo=1단계, pc=2단계
});
let state = loadState();

// ---------- 폰트 패밀리 맵(가족만 담당; lh/track은 위 프리셋으로) ----------
const fontMap = {
  a: {
    content: '"Pretendard", system-ui, -apple-system, "Noto Sans KR", sans-serif',
    title:   '"Pretendard", system-ui, -apple-system, "Noto Sans KR", sans-serif',
    titleWeight: 700,
    titleTrack:  "-0.01em",
  },
  b: { // book
    content: '"book", system-ui, "Noto Serif KR", serif',
    title:   '"bookbd","book", system-ui, "Noto Serif KR", serif', 
    titleWeight: 700,
    titleTrack:  "-0.04em",
  },
  c: { // 1945
    content: '"1945", system-ui, "Noto Serif KR", serif',
    title:   '"1945bd","1945", system-ui, "Noto Serif KR", serif',
    titleWeight: 700,
    titleTrack:  "-0.04em",   
  },
  d: { // yes
    content: '"yes", system-ui, "Noto Serif KR", serif',
    title:   '"yesbd","yes", system-ui, "Noto Serif KR", serif',
    titleWeight: 500,
    titleTrack:  "-0.04em",   
  }
};

// ---------- 적용 함수 ----------
function applyType() {
if (!reading) return; // art-view에 #reading 없을 수도 있음
const sets = typeSteps[mode()][state.font] || typeSteps[mode()]._default;
  const idx  = Math.max(0, Math.min(state.step, sets.length - 1));
  const { size, lh, track } = sets[idx];

  // CSS 변수에만 주입(인라인 스타일로 직접 값 설정 X)
  reading.style.setProperty("--read-size",  size + "px");
  reading.style.setProperty("--read-lh",    lh);
  reading.style.setProperty("--read-track", track);

  // 상태 표시/버튼 디스에이블
  out.textContent  = String(idx + 1);
  dec.disabled = idx === 0;
  inc.disabled = idx === sets.length - 1;

  // 저장
  localStorage.setItem("cc.step", String(idx));
  state.step = idx;
}

function applyFont(key) {  const f = fontMap[key] || fontMap.a;

  // ✅ 본문/작가/제목 모두 연결
  root.style.setProperty("--content-font", f.content);
  root.style.setProperty("--title-font",   f.title);
  root.style.setProperty("--title-weight", String(f.titleWeight));
  root.style.setProperty("--title-track",  f.titleTrack);

  // UI 활성화 표시/상태 저장 등 기존 로직 유지
  chips.forEach(c => c.classList.toggle("is-active", c.dataset.font === key));
  localStorage.setItem("cc.font", key);
  state.font = key;

  // 본문 크기/행간/자간 프리셋 재적용
  applyType();
}

// ---------- 이벤트 바인딩 ----------
chips.forEach(c => c.addEventListener("click", () => applyFont(c.dataset.font)));

dec.addEventListener("click", () => {
  if (state.step > 0) { state.step -= 1; applyType(); }
});
inc.addEventListener("click", () => {
  const sets = typeSteps[mode()][state.font] || typeSteps[mode()]._default;
  if (state.step < sets.length - 1) { state.step += 1; applyType(); }
});

// 반응형 전환 시, 현재 단계/폰트로 해당 모드 프리셋 재적용
addEventListener("resize", () => applyType());

// 초기값 적용
applyFont(state.font);


 
})();

