# 👟 Allbirds 클론코딩 웹 프로젝트 (allbirds-term-project)

> **[25-2 웹프로그래밍] 팀 프로젝트**  
> 친환경 신발 브랜드 'Allbirds' 공식 웹사이트의 핵심 기능(메인 레이아웃, 상품 관리, 가용 사이즈 변경, 회원 인증 및 파일 업로드 등)을 구현한 풀스택 클론코딩 프로젝트입니다.

---

## 🔗 Repository Notice
- **원본 팀 프로젝트:** [jinho-jinho/term-project](https://github.com/jinho-jinho/term-project)
- **본 리포지토리 안내:** 팀 프로젝트 수료 후, 개인 포트폴리오 정리 및 코드 구조 개선/리팩토링을 위해 Fork하여 관리하는 공간입니다.

---

## 👤 담당 역할 & 기여도

### 담당 기능 (My Contributions)
- **메인 레이아웃 및 UI 구축:**
  - 홈화면 전체 랜딩 페이지 UI 구성
  - 서비스 전반에 공통 적용되는 글로벌 헤더(Header) 및 푸터(Footer) 컴포넌트 구현
- **관리자 기능 (Admin Panel):**
  - 신규 상품 정보 등록 기능 및 데이터 처리
  - 상품별 가용 사이즈(재고 및 사이즈 옵션) 관리 및 상태 변경 기능 구현

---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![styled-components](https://img.shields.io/badge/styled--components-DB7093?style=flat-square&logo=styledcomponents&logoColor=white)

### Backend & Database
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)

---

## 📁 Directory Structure

```text
allbirds-term-project/
 ├── client/                  # React + Vite 기반 프론트엔드
 │    ├── public/             # 정적 데이터 및 파비콘 asset
 │    ├── src/                # UI 컴포넌트 및 페이지 로직
 │    └── vite.config.js      # Vite 설정 파일
 └── server/                  # Node.js + Express 기반 백엔드
      ├── public/img/         # 상품 및 서비스 업로드 이미지 자원
      ├── scripts/            # DB 시드 데이터 구축 스크립트 (seed.js)
      └── src/                # Express 서버 로직 및 Mongoose 모델 (server.js)
