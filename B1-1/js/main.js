// ── GitHub API로 프로젝트 카드 동적 생성 ──

const GITHUB_USERNAME = "PANDAGOM0901";

async function fetchProjects() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
    );
    const repos = await res.json();
    renderCards(repos);
  } catch (err) {
    console.error("GitHub API 오류:", err);
  }
}

function renderCards(repos) {
  const grid = document.querySelector(".projects__grid");
  grid.innerHTML = ""; // 기존 내용 초기화

  repos.forEach((repo) => {
    const card = document.createElement("div");
    card.classList.add("project-card");

    card.innerHTML = `
      <div class="project-card__image-wrap">
        <img
          class="project-card__image"
          src="https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}"
          alt="${repo.name}"
        />
        <div class="project-card__overlay">
          <a href="${repo.html_url}" target="_blank" class="overlay-btn">GitHub</a>
          ${repo.homepage
            ? `<a href="${repo.homepage}" target="_blank" class="overlay-btn">Demo</a>`
            : ""}
        </div>
      </div>
      <div class="project-card__body">
        <h3 class="project-card__title">${repo.name}</h3>
        <p class="project-card__description">
          ${repo.description || "설명이 없습니다."}
        </p>
        <div class="project-card__tags">
          ${repo.language
            ? `<span class="tag">${repo.language}</span>`
            : ""}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// 페이지 로드 시 실행
fetchProjects();

/* ── 타이핑 효과 ── */
const typingTarget = document.getElementById('typingText');
const texts = [
  'Frontend Developer',
  'UI/UX Enthusiast',
  'Open Source Contributor'
];

let textIndex = 0;   // 현재 문장 번호
let charIndex = 0;   // 현재 글자 번호
let isDeleting = false;

function type() {
  const current = texts[textIndex];

  if (isDeleting) {
    // 글자 지우기
    typingTarget.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    // 글자 추가
    typingTarget.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  // 다 썼으면 → 잠시 후 지우기 시작
  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; }, 1500);
  }

  // 다 지웠으면 → 다음 문장으로
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }

  // 속도 조절 (지울 때 더 빠르게)
  const speed = isDeleting ? 60 : 100;
  setTimeout(type, speed);
}

// 페이지 로드 후 시작
window.addEventListener('load', () => type());

/* ── 다크모드 토글 ── */
const themeToggle = document.getElementById('themeToggle');

// 저장된 테마 불러오기 (페이지 새로고침해도 유지)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

// 버튼 클릭 시 테마 전환
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');

  // 아이콘 변경
  themeToggle.textContent = isDark ? '☀️' : '🌙';

  // localStorage에 저장
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ── 네비게이션 스크롤 효과 ── */
const navbar = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── 활성 메뉴 하이라이트 ── */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===== 스크롤 애니메이션 =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1  // 요소가 10% 보이면 실행
});

// 애니메이션 적용할 요소들 선택
document.querySelectorAll('.fade-in').forEach((el) => {
  observer.observe(el);
});

// ===== 폼 유효성 검사 =====
const contactForm = document.getElementById('contactForm');

// 에러 표시 함수
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  input.classList.add('form__input--error');      // 빨간 테두리
  input.classList.remove('form__input--success'); // 초록 테두리 제거
  error.textContent = message;                    // 에러 메시지 표시
}

// 성공 표시 함수
function showSuccess(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  input.classList.remove('form__input--error');   // 빨간 테두리 제거
  input.classList.add('form__input--success');    // 초록 테두리
  error.textContent = '';                         // 에러 메시지 제거
}

// 이메일 형식 검사 함수
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 각 필드 유효성 검사 함수
function validateName() {
  const name = document.getElementById('name').value.trim();

  if (name === '') {
    showError('name', 'nameError', '이름을 입력해주세요.');
    return false;
  } else if (name.length < 2) {
    showError('name', 'nameError', '이름은 2글자 이상 입력해주세요.');
    return false;
  } else {
    showSuccess('name', 'nameError');
    return true;
  }
}

function validateEmail() {
  const email = document.getElementById('email').value.trim();

  if (email === '') {
    showError('email', 'emailError', '이메일을 입력해주세요.');
    return false;
  } else if (!isValidEmail(email)) {
    showError('email', 'emailError', '올바른 이메일 형식이 아닙니다. (예: abc@example.com)');
    return false;
  } else {
    showSuccess('email', 'emailError');
    return true;
  }
}

function validateMessage() {
  const message = document.getElementById('message').value.trim();

  if (message === '') {
    showError('message', 'messageError', '메시지를 입력해주세요.');
    return false;
  } else if (message.length < 10) {
    showError('message', 'messageError', '메시지는 10글자 이상 입력해주세요.');
    return false;
  } else {
    showSuccess('message', 'messageError');
    return true;
  }
}

// 실시간 유효성 검사 (입력할 때마다 검사)
document.getElementById('name').addEventListener('input', validateName);
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('message').addEventListener('input', validateMessage);

// 폼 제출 이벤트
contactForm.addEventListener('submit', function (e) {
  e.preventDefault(); // 기본 제출 동작 막기

  // 모든 필드 검사
  const isNameValid    = validateName();
  const isEmailValid   = validateEmail();
  const isMessageValid = validateMessage();

  // 모두 통과하면 성공 처리
  if (isNameValid && isEmailValid && isMessageValid) {
    // 성공 메시지 표시
    const formSuccess = document.getElementById('formSuccess');
    formSuccess.classList.add('form__success--visible');

    // 폼 초기화
    contactForm.reset();

    // 초록 테두리도 제거
    ['name', 'email', 'message'].forEach(id => {
      document.getElementById(id).classList.remove('form__input--success');
    });

    // 3초 후 성공 메시지 숨기기
    setTimeout(() => {
      formSuccess.classList.remove('form__success--visible');
    }, 3000);
  }
});

/* ===========================
   햄버거 메뉴
=========================== */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');

  // 접근성: aria-expanded 업데이트
  hamburger.setAttribute('aria-expanded', isOpen);

  // 햄버거 → X 아이콘 변환
  hamburger.classList.toggle('is-active', isOpen);
});

// 메뉴 링크 클릭 시 자동 닫기
navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    hamburger.classList.remove('is-active');
  });
});