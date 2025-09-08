<!-- 헤더 배너 -->
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=28&pause=1200&center=true&vCenter=true&width=800&lines=%F0%9F%9A%80+Uptime+Monitor+Frontend;Next.js+%7C+Tailwind+%7C+Recharts" alt="Typing SVG" />
</p>

<h1 align="center">📊 Uptime Monitor Frontend</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-0F172A?logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-0EA5E9?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-2563EB?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-22c55e" />
  <img src="https://img.shields.io/badge/Auth-JWT-334155" />
</p>

---

## 🚀 소개
이 프로젝트는 **웹 서비스의 가용성과 성능을 실시간 모니터링**하기 위해 만든 프론트엔드 대시보드입니다.  
백엔드(Spring Boot)와 연동하여 다음을 제공합니다:

- ✅ 헬스체크 결과 조회 (성공/실패, HTTP 상태, 응답 지연)
- ✅ Uptime/Latency 요약 통계 (1h / 24h)
- ✅ 실시간 자동 새로고침 (백오프 기반)
- ✅ URL 관리 (추가/수정/삭제/토글)
- ✅ JWT 기반 로그인 & 사용자별 대상 관리

---

## 🖼️ 스크린샷

<p align="center">
  <img src="docs/screenshot-dashboard.png" width="700" alt="Dashboard Screenshot"/>
</p>

---

## 🛠️ 기술 스택

### Frontend
<p>
  <img src="https://img.shields.io/badge/Next.js-0F172A?logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-0EA5E9?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-2563EB?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-22c55e" />
  <img src="https://img.shields.io/badge/LucideIcons-black?logo=lucide&logoColor=white" />
</p>

### Auth & API
<p>
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/REST%20API-2563EB?logo=postman&logoColor=white" />
</p>

---

## ⚙️ 설치 및 실행

```bash
# 1. 레포지토리 클론
git clone https://github.com/doomallang/uptime.git
cd uptime/uptime-front

# 2. 의존성 설치
npm install   # 또는 yarn install

# 3. 환경 변수 설정 (.env.local)
NEXT_PUBLIC_API_BASE=http://localhost:8080/api/v1

# 4. 개발 서버 실행
npm run dev   # http://localhost:3000 접속
```

## 주요 폴더 구조
```bash
uptime-front/
 ├── app/                 # Next.js App Router
 │   ├── uptime/          # Dashboard 메인 페이지
 │   ├── login/           # 로그인 페이지
 │   ├── signup/          # 회원가입 페이지
 ├── components/          # UI 컴포넌트
 │   ├── dashboard/       # 대시보드 관련 (StatCard, StatusBadge 등)
 │   └── AuthProvider.tsx # JWT Auth 전역 컨텍스트
 ├── lib/                 # API, 유틸
 ├── public/              # 정적 리소스
 └── ...
```

📫 Contact
<p> <a href="mailto:doo_style@naver.com"><img src="https://img.shields.io/badge/Email-doo__style%40naver.com-0ea5e9?logo=gmail&logoColor=white" /></a>
  <a href="https://many.tistory.com"><img src="https://img.shields.io/badge/Blog-many.tistory.com-ff5f2e?logo=tistory&logoColor=white" /></a>
  <a href="https://portfolio-t7fthjnfn-doomoles-projects.vercel.app"><img src="https://img.shields.io/badge/Portfolio-Live-22c55e?logo=vercel&logoColor=white" /></a> </p>
