"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { caseTasks, type CasePattern, type CaseTask } from "./case-data";

type BudgetCategory = {
  name: string;
  short: string;
  plan: string;
  spent: string;
  rate: number;
  median: number;
  color: string;
  note: string;
  action: string;
  examples: string[];
  headline: string;
  interpretation: string;
  possibleReasons: string[];
  checks: string[];
  steps: string[];
  caution: string;
};

type Edutech = {
  name: string;
  schools: number;
  group: string;
  related: string[];
};

type SemesterRecipe = {
  number: string;
  title: string;
  summary: string;
  purpose: string;
  why: string;
  questions: string[];
  steps: string[];
  evidence: string[];
  caution: string;
};

const categories: BudgetCategory[] = [
  {
    name: "교원역량강화비",
    short: "교원역량",
    plan: "약 439만원",
    spent: "약 193만원",
    rate: 43.9,
    median: 14.4,
    color: "#ff7fb5",
    note: "평균과 가운데 수준의 차이가 가장 커요. 일부 학교의 큰 집행이 평균을 끌어올렸습니다.",
    action: "2학기 연수 일정·강사·공동연구 산출물을 먼저 확정해 보세요.",
    examples: ["교원 연수", "학습공동체", "연구용 구독", "도서·자료"],
    headline: "평균 집행 흐름과 가운데 학교의 차이가 가장 큰 영역",
    interpretation: "전체 계획액 대비 집행은 43.9%지만, 학교별 집행률의 가운데 수준은 14.4%입니다. 여러 학교가 비슷하게 집행한 모습이라기보다 일부 학교가 연수·연구 활동을 먼저 시작하면서 평균을 끌어올린 구조로 읽는 편이 안전합니다.",
    possibleReasons: [
      "2학기 연수나 공동연구 일정이 아직 확정되지 않았을 가능성",
      "강사 섭외·원고·계약·지급 시점이 서로 달라 집행이 늦게 잡힐 가능성",
      "개별 구독과 공동연구비 등 학교별 운영 방식의 차이",
    ],
    checks: ["연수 대상과 참여 인원", "강사·일정·장소 확정 여부", "연수 뒤 남길 공동 산출물", "계약과 지급 완료 예정일"],
    steps: ["8월 안에 핵심 연수 한 가지를 확정", "연수 전후 교사 적용 사례를 같은 양식으로 기록", "유사한 개인 구독이 중복되는지 점검"],
    caution: "집행률이 낮다고 교원 역량 활동이 부족하다고 단정할 수 없습니다. 2학기 일정과 계약 단계가 원자료에 모두 나타나지 않기 때문입니다.",
  },
  {
    name: "교육활동운영비",
    short: "교육활동",
    plan: "약 2,471만원",
    spent: "약 1,490만원",
    rate: 60.3,
    median: 61.1,
    color: "#8bd450",
    note: "가장 큰 예산 영역이며 학교들의 집행도 비교적 고르게 진행됐어요.",
    action: "구독 도구마다 수업 대상·활용 장면·결과물 계획을 연결해 보세요.",
    examples: ["에듀테크 구독", "AI 코스웨어", "수업 콘텐츠", "학생 캠프"],
    headline: "학교들이 가장 넓고 비교적 고르게 집행한 핵심 수업 영역",
    interpretation: "전체 계획액 대비 60.3%가 집행됐고 학교별 가운데 수준도 61.1%로 비슷합니다. 에듀테크 구독, AI 코스웨어, 수업 콘텐츠, 학생 캠프처럼 실제 교육활동에 바로 연결되는 항목이 상반기 집행을 이끈 것으로 볼 수 있습니다.",
    possibleReasons: [
      "학기 초부터 필요한 학생·교원 계정의 선구매",
      "학년·교과별 코스웨어와 콘텐츠의 학기 단위 계약",
      "방학 캠프나 공개수업을 위한 재료·운영 준비",
    ],
    checks: ["대상 학년·학생·교사 수", "실제 사용할 수업 차시", "라이선스 시작·종료일", "학생 결과물과 피드백 방식"],
    steps: ["도구마다 ‘누가·언제·무엇을’ 표로 정리", "비슷한 기능의 구독을 한 번 더 비교", "2학기 중간에 미사용 계정과 활용 장벽 점검"],
    caution: "구매가 빠르다는 사실만으로 수업 활용이나 교육적 효과가 높다고 볼 수 없습니다. 사용 장면과 학생 변화 증거를 따로 확인해야 합니다.",
  },
  {
    name: "환경지원비",
    short: "환경지원",
    plan: "약 260만원",
    spent: "약 141만원",
    rate: 54.2,
    median: 54.7,
    color: "#6ac8f2",
    note: "학교별 가운데 수준도 54.7%로, 평균 집행 흐름과 비슷하게 나타났어요.",
    action: "기기 수량보다 실제 수업 불편을 줄이는 부속품인지 다시 확인해 보세요.",
    examples: ["마우스·키보드", "헤드셋·이어폰", "터치펜", "기기 수리"],
    headline: "평균과 가운데 수준이 거의 같아 비교적 일정한 집행 흐름",
    interpretation: "전체 계획액 대비 집행은 54.2%, 학교별 가운데 수준은 54.7%로 매우 가깝습니다. 마우스·이어폰·터치펜·보호용품·수리처럼 수업 중 반복되는 불편을 해결하는 보조 장비 중심의 집행이 확인됩니다.",
    possibleReasons: [
      "1학기 기기 활용 뒤 드러난 실제 불편을 보완",
      "디벗·크롬북 등 기존 기기의 부속품과 보관 환경 지원",
      "수업 확대에 따른 충전·음향·입력 장치 수요",
    ],
    checks: ["수업 중 가장 자주 발생한 불편", "기존 보유 수량과 고장 수량", "기기 호환성과 보증 조건", "보관·대여·회수 담당 방식"],
    steps: ["교사 불편 사례를 우선순위로 정리", "소량 시험 사용 뒤 추가 구매 판단", "수리·분실·소모품 교체 기준 마련"],
    caution: "품목 수량만으로 환경 개선 정도를 평가할 수 없습니다. 실제 수업 중단 시간이나 접근성 개선 여부를 함께 봐야 합니다.",
  },
  {
    name: "사업추진경비",
    short: "사업추진",
    plan: "약 278만원",
    spent: "약 75만원",
    rate: 26.9,
    median: 23.1,
    color: "#ffc95b",
    note: "다른 영역보다 느리지만 2학기 협의회·성과공유 일정과 연결해 해석해야 해요.",
    action: "행사 날짜, 참여자, 공유할 결과를 먼저 정하고 필요한 경비를 역산하세요.",
    examples: ["운영 협의회", "성과공유회", "워크숍", "다과·간담회"],
    headline: "상반기 집행은 낮지만 2학기 일정과 연결해 판단해야 하는 영역",
    interpretation: "전체 계획액 대비 26.9%, 학교별 가운데 수준 23.1%로 네 영역 중 가장 낮습니다. 협의회·워크숍·성과공유회처럼 2학기에 집중되는 활동이 많아 7월 수치만으로 지연이나 부진을 단정하기 어렵습니다.",
    possibleReasons: [
      "성과공유회와 운영 협의회가 2학기에 예정됐을 가능성",
      "참여자·장소·행사 규모가 확정된 뒤 집행되는 구조",
      "교육활동 결과가 나온 다음 필요한 운영비가 결정되는 순서",
    ],
    checks: ["행사 목적과 날짜", "참여 대상과 예상 인원", "공유할 학생·교사 결과물", "필요 경비와 불필요한 관행성 지출"],
    steps: ["행사 목적을 한 문장으로 먼저 확정", "결과물·참여자·일정에서 비용을 역산", "성과공유 뒤 다음 운영에 남길 기록 정하기"],
    caution: "낮은 집행률 자체가 문제라는 뜻은 아닙니다. 다만 2학기 일정과 담당자가 아직 없다면 실행 지연 신호가 될 수 있습니다.",
  },
];

const semesterRecipes: SemesterRecipe[] = [
  {
    number: "1",
    title: "목적 다시 보기",
    summary: "구매 품목보다 해결하려는 수업 문제를 한 문장으로 적기",
    purpose: "예산을 ‘무엇을 살까’가 아니라 ‘어떤 수업 문제를 줄일까’에서 출발하게 하는 단계입니다.",
    why: "같은 도구도 학교마다 필요한 이유가 다릅니다. 목적이 없으면 인기 도구를 따라 사거나 비슷한 기능을 중복 구독하기 쉽습니다.",
    questions: ["학생이 지금 가장 어려워하는 장면은 무엇인가요?", "교사가 반복해서 시간을 쓰는 일은 무엇인가요?", "이 구매가 없으면 어떤 수업이 어려운가요?"],
    steps: ["문제를 학생 행동 중심으로 한 문장 작성", "필요한 기능과 있으면 좋은 기능을 구분", "기존 도구로 해결 가능한지 먼저 확인"],
    evidence: ["해결하려는 문제 한 문장", "대상 학년·교과", "도구 선택 이유와 대안 비교"],
    caution: "제품명이 목적을 대신하지 않게 하세요. ‘패들렛 활용’보다 ‘모든 학생의 생각을 수집하고 서로 피드백하게 하기’가 목적에 가깝습니다.",
  },
  {
    number: "2",
    title: "일정 연결하기",
    summary: "계약·연수·수업·성과공유 날짜를 하나의 달력에 놓기",
    purpose: "예산 집행과 실제 수업 적용 사이의 빈틈을 줄이는 단계입니다.",
    why: "계약만 끝나고 교사 연수가 늦어지거나, 수업이 끝난 뒤 성과공유 일정을 잡으면 활용 증거를 놓치기 쉽습니다.",
    questions: ["라이선스가 시작되는 날과 첫 수업 날짜가 맞물리나요?", "교사 사전 체험 시간은 확보됐나요?", "결과를 나눌 날짜가 수업 전에 정해졌나요?"],
    steps: ["계약·연수·첫 수업·중간 점검·공유 날짜 표시", "각 일정의 담당자 한 명 지정", "지연될 때 줄이거나 미룰 범위를 미리 결정"],
    evidence: ["2학기 통합 일정표", "단계별 담당자", "중간 점검일과 변경 기록"],
    caution: "집행 완료일만 관리하면 실제 활용이 뒤로 밀릴 수 있습니다. 계약 이후의 수업 일정을 같은 수준으로 관리하세요.",
  },
  {
    number: "3",
    title: "사용 장면 정하기",
    summary: "대상 학년, 수업 차시, 교사 역할과 학생 결과물 정하기",
    purpose: "구독한 도구가 실제 어느 수업에서 어떻게 쓰일지 구체화하는 단계입니다.",
    why: "‘전교생 활용’처럼 범위가 넓으면 책임과 수업 장면이 흐려집니다. 작은 학년·단원에서 시작하면 교사 지원과 개선이 쉬워집니다.",
    questions: ["어느 학년·교과·단원에서 시작하나요?", "교사는 무엇을 설명하고 학생은 무엇을 만드나요?", "도구 사용 뒤 다음 차시가 어떻게 달라지나요?"],
    steps: ["첫 적용 학년과 2~3개 차시 선정", "교사 안내·학생 활동·결과물 형식 작성", "접속 실패와 기기 문제의 대안 활동 준비"],
    evidence: ["간단한 수업 설계안", "학생 결과물 예시", "접근성·개인정보 점검표"],
    caution: "활용 횟수를 늘리는 것보다 도구가 필요한 수업 장면을 정확히 고르는 것이 우선입니다.",
  },
  {
    number: "4",
    title: "작은 증거 남기기",
    summary: "활용 횟수보다 학생 반응과 다음 개선점을 짧게 기록하기",
    purpose: "예산 사용을 다음 학기 의사결정에 활용할 수 있는 작은 근거로 바꾸는 단계입니다.",
    why: "로그인 수나 사용 횟수만으로는 학습 변화를 설명하기 어렵습니다. 교사의 관찰과 학생 결과물을 함께 남겨야 계속·확대·중단 판단이 가능합니다.",
    questions: ["학생의 참여나 결과물이 이전과 어떻게 달라졌나요?", "도구 때문에 새로 생긴 어려움은 무엇인가요?", "다음 수업에서 유지·수정·중단할 것은 무엇인가요?"],
    steps: ["수업 직후 3문장 관찰 기록", "학생 결과물 전후 예시 1개씩 보관", "월 1회 교사 사례를 짧게 공유"],
    evidence: ["학생 반응 한 줄", "결과물 전후 사례", "유지·개선·중단 판단과 이유"],
    caution: "좋은 사례만 모으면 판단이 왜곡됩니다. 실패·미사용·접근 어려움도 같은 양식으로 기록하세요.",
  },
];

const edutech: Edutech[] = [
  { name: "패들렛", schools: 28, group: "협업·공유", related: ["북크리에이터", "매쓰홀릭", "Gemini"] },
  { name: "북크리에이터", schools: 13, group: "콘텐츠 제작", related: ["패들렛", "ZEP·젭퀴즈", "블루킷"] },
  { name: "Gemini", schools: 11, group: "생성형 AI", related: ["패들렛", "Claude", "SUNO"] },
  { name: "매쓰홀릭", schools: 11, group: "교과·맞춤형", related: ["패들렛", "북크리에이터", "ChatGPT"] },
  { name: "Claude", schools: 10, group: "생성형 AI", related: ["패들렛", "ChatGPT", "Gemini"] },
  { name: "ZEP·젭퀴즈", schools: 10, group: "퀴즈·참여", related: ["북크리에이터", "패들렛", "블루킷"] },
  { name: "블루킷", schools: 8, group: "퀴즈·참여", related: ["패들렛", "북크리에이터", "ZEP·젭퀴즈"] },
  { name: "ChatGPT", schools: 7, group: "생성형 AI", related: ["패들렛", "Claude", "Gemini"] },
  { name: "SUNO", schools: 6, group: "콘텐츠 제작", related: ["Gemini", "북크리에이터", "패들렛"] },
  { name: "카훗", schools: 6, group: "퀴즈·참여", related: ["패들렛", "북크리에이터", "Gemini"] },
  { name: "띵커벨", schools: 5, group: "퀴즈·참여", related: ["패들렛", "북크리에이터", "ChatGPT"] },
  { name: "알공", schools: 5, group: "교과·맞춤형", related: ["토도한글", "패들렛", "ZEP·젭퀴즈"] },
  { name: "키위티", schools: 5, group: "언어·문해", related: ["패들렛", "북크리에이터", "Claude"] },
  { name: "스쿨플랫", schools: 4, group: "교과·맞춤형", related: ["패들렛", "키위티", "ChatGPT"] },
  { name: "지니아튜터", schools: 4, group: "교과·맞춤형", related: ["북크리에이터", "패들렛", "ChatGPT"] },
  { name: "토도한글", schools: 4, group: "언어·문해", related: ["알공", "패들렛", "AI 아크수학"] },
  { name: "YouTube Premium", schools: 3, group: "콘텐츠 제작", related: ["Claude", "Gemini", "북크리에이터"] },
  { name: "Zoom Pro", schools: 3, group: "협업·공유", related: ["북크리에이터", "패들렛", "Claude"] },
  { name: "다했니·다했어요", schools: 3, group: "학습관리", related: ["북크리에이터", "패들렛", "ChatGPT"] },
  { name: "리드포스쿨", schools: 3, group: "언어·문해", related: ["AI마타수학", "Gemini", "VLLO"] },
  { name: "캡컷", schools: 3, group: "콘텐츠 제작", related: ["ChatGPT", "Claude", "패들렛"] },
  { name: "코드모스", schools: 3, group: "코딩·컴퓨팅", related: ["띵커벨", "북크리에이터", "아이쌤GPT"] },
  { name: "클래스카드", schools: 3, group: "언어·문해", related: ["Gemini", "SUNO", "Snorkl"] },
  { name: "클래스팅 AI", schools: 3, group: "학습관리", related: ["패들렛", "Claude", "Gemini"] },
  { name: "클래시파이", schools: 3, group: "학습관리", related: ["Claude", "YouTube Premium", "띵커벨"] },
  { name: "AI 아크수학", schools: 2, group: "교과·맞춤형", related: ["패들렛", "ZEP·젭퀴즈", "그라운드"] },
  { name: "AI마타수학", schools: 2, group: "교과·맞춤형", related: ["VLLO", "YBM AIDT", "리드포스쿨"] },
  { name: "Delightex", schools: 2, group: "코딩·컴퓨팅", related: ["ChatGPT", "Claude", "SUNO"] },
  { name: "Snorkl", schools: 2, group: "퀴즈·참여", related: ["Gemini", "클래스카드", "키위티"] },
  { name: "Wordwall", schools: 2, group: "퀴즈·참여", related: ["SUNO", "ElevenLabs", "Gemini"] },
  { name: "리딩게이트", schools: 2, group: "언어·문해", related: ["U클래스"] },
  { name: "리딩오션", schools: 2, group: "언어·문해", related: ["AI마타수학", "Gemini", "VLLO"] },
  { name: "마이클", schools: 2, group: "생성형 AI", related: ["패들렛", "Claude", "스쿨플랫"] },
  { name: "매일국어·독도", schools: 2, group: "언어·문해", related: ["ZEP·젭퀴즈", "그림한글받아쓰기", "라포라포"] },
  { name: "멘티미터", schools: 2, group: "퀴즈·참여", related: ["ChatGPT", "Claude", "Delightex"] },
  { name: "미리캔버스", schools: 2, group: "콘텐츠 제작", related: ["ChatGPT", "Claude", "Delightex"] },
  { name: "아이쌤GPT", schools: 2, group: "생성형 AI", related: ["띵커벨", "코드모스", "Zoom Pro"] },
  { name: "와우아이디어스", schools: 2, group: "협업·공유", related: ["북크리에이터", "ZEP·젭퀴즈", "다했니·다했어요"] },
  { name: "초코클래스", schools: 2, group: "학습관리", related: ["카훗", "패들렛", "AI마타수학"] },
  { name: "토도수학", schools: 2, group: "교과·맞춤형", related: ["알공", "Gemini", "리딩오션"] },
  { name: "투닝", schools: 2, group: "콘텐츠 제작", related: ["Gemini", "Snorkl", "북크리에이터"] },
  { name: "4K Video Downloader+", schools: 1, group: "콘텐츠 제작", related: ["Claude", "Lily's AI", "OpenAI API"] },
  { name: "EBS영어", schools: 1, group: "언어·문해", related: ["Gemini", "초코클래스", "카훗"] },
  { name: "ElevenLabs", schools: 1, group: "콘텐츠 제작", related: ["Learney", "SUNO", "Wordwall"] },
  { name: "Learney", schools: 1, group: "언어·문해", related: ["ElevenLabs", "SUNO", "Wordwall"] },
  { name: "Lily's AI", schools: 1, group: "생성형 AI", related: ["4K Video Downloader+", "Claude", "OpenAI API"] },
  { name: "OpenAI API", schools: 1, group: "생성형 AI", related: ["4K Video Downloader+", "Claude", "Lily's AI"] },
  { name: "TBLT-Agent", schools: 1, group: "생성형 AI", related: ["4K Video Downloader+", "Claude", "Lily's AI"] },
  { name: "U클래스", schools: 1, group: "학습관리", related: ["리딩게이트"] },
  { name: "VLLO", schools: 1, group: "콘텐츠 제작", related: ["AI마타수학", "리드포스쿨", "리딩오션"] },
  { name: "YBM AIDT", schools: 1, group: "언어·문해", related: ["AI마타수학", "북크리에이터", "블루킷"] },
  { name: "e-Future e-Library", schools: 1, group: "언어·문해", related: ["ElevenLabs", "Learney", "SUNO"] },
  { name: "감마", schools: 1, group: "콘텐츠 제작", related: ["ChatGPT", "Claude", "Delightex"] },
  { name: "그라운드", schools: 1, group: "학습관리", related: ["AI 아크수학", "ZEP·젭퀴즈", "띵커벨"] },
  { name: "그림한글받아쓰기", schools: 1, group: "언어·문해", related: ["ZEP·젭퀴즈", "라포라포", "리드포스쿨"] },
  { name: "노션", schools: 1, group: "협업·공유", related: ["ZEP·젭퀴즈", "매쓰홀릭", "북크리에이터"] },
  { name: "라포라포", schools: 1, group: "언어·문해", related: ["ZEP·젭퀴즈", "그림한글받아쓰기", "리드포스쿨"] },
  { name: "리틀팍스", schools: 1, group: "언어·문해", related: ["Gemini", "리딩오션", "스쿨플랫"] },
  { name: "매쓰플랫", schools: 1, group: "교과·맞춤형", related: ["패들렛"] },
  { name: "문제G", schools: 1, group: "학습관리", related: ["ElevenLabs", "Learney", "SUNO"] },
  { name: "밀리의 서재", schools: 1, group: "언어·문해", related: ["패들렛"] },
  { name: "수학대왕", schools: 1, group: "교과·맞춤형", related: ["Gemini", "리드포스쿨", "패들렛"] },
  { name: "스픽AI", schools: 1, group: "언어·문해", related: ["ChatGPT", "Claude", "Delightex"] },
  { name: "슬라이도", schools: 1, group: "퀴즈·참여", related: ["Claude", "Gemini", "YouTube Premium"] },
  { name: "아트봉봉", schools: 1, group: "콘텐츠 제작", related: ["ZEP·젭퀴즈", "그림한글받아쓰기", "라포라포"] },
  { name: "엘리프", schools: 1, group: "언어·문해", related: ["ChatGPT", "패들렛", "퍼플 경제교실"] },
  { name: "옥수수", schools: 1, group: "교과·맞춤형", related: [] },
  { name: "우리반", schools: 1, group: "학습관리", related: ["매쓰홀릭", "패들렛"] },
  { name: "원아워", schools: 1, group: "학습관리", related: ["Zoom Pro", "띵커벨", "매쓰홀릭"] },
  { name: "젠스파크", schools: 1, group: "생성형 AI", related: ["ChatGPT", "Claude", "ZEP·젭퀴즈"] },
  { name: "지학사 AIDT", schools: 1, group: "교과·맞춤형", related: ["Zoom Pro", "띵커벨", "매쓰홀릭"] },
  { name: "초등문해력", schools: 1, group: "언어·문해", related: ["Gemini", "리딩오션", "리틀팍스"] },
  { name: "큐리팟", schools: 1, group: "생성형 AI", related: ["ChatGPT", "Claude", "ZEP·젭퀴즈"] },
  { name: "클리포", schools: 1, group: "퀴즈·참여", related: ["ChatGPT", "Claude", "ZEP·젭퀴즈"] },
  { name: "토도국어", schools: 1, group: "언어·문해", related: ["매일국어·독도", "알공", "클래스카드"] },
  { name: "퍼플 경제교실", schools: 1, group: "학습관리", related: ["ChatGPT", "엘리프", "패들렛"] },
  { name: "플랭스쿨", schools: 1, group: "학습관리", related: ["AI마타수학", "YBM AIDT", "북크리에이터"] },
  { name: "후크패드", schools: 1, group: "콘텐츠 제작", related: ["ElevenLabs", "Learney", "SUNO"] },
];

const toolPurposes: Record<string, string> = {
  "패들렛": "게시판·캔버스에 자료와 의견을 함께 모으는 실시간 협업 공간",
  "북크리에이터": "글·이미지·음성·영상을 엮어 전자책과 학습 결과물을 만드는 저작 도구",
  "Gemini": "텍스트·이미지·자료 분석과 생성을 지원하는 범용 멀티모달 생성형 AI",
  "매쓰홀릭": "수학 문제은행과 진단·추천 학습을 제공하는 수학 AI 코스웨어",
  "Claude": "긴 문서 분석·글쓰기·아이디어 정리를 지원하는 범용 생성형 AI",
  "ZEP·젭퀴즈": "메타버스형 참여 공간과 게임형 퀴즈를 결합한 수업 참여 도구",
  "블루킷": "문항 세트를 여러 게임 모드로 운영하는 실시간 퀴즈 플랫폼",
  "ChatGPT": "대화형 자료 생성·분석·아이디어 탐색을 지원하는 범용 생성형 AI",
  "SUNO": "텍스트 지시로 노래·배경음악을 만드는 생성형 음악 도구",
  "카훗": "실시간 퀴즈·설문으로 이해도와 참여를 확인하는 게임형 평가 도구",
  "띵커벨": "퀴즈·토론·설문·워드클라우드·보드를 제공하는 수업 상호작용 도구",
  "알공": "초등 영어·수학을 게임과 AI 맞춤 복습으로 지원하는 교과 코스웨어",
  "키위티": "학생 글쓰기 제출과 AI 대화·피드백을 지원하는 AI 글쓰기 코스웨어",
  "스쿨플랫": "문제은행·과제·성취 분석을 제공하는 학교 맞춤형 수학 AI 코스웨어",
  "지니아튜터": "국·영·수·사·과 과정과 AI 글쓰기 평가를 제공하는 교과 코스웨어",
  "토도한글": "유아·초등 초기 문해의 한글 읽기와 쓰기를 돕는 단계형 학습 앱",
  "YouTube Premium": "광고 없이 교육 영상을 탐색·재생·저장하는 영상 콘텐츠 이용 서비스",
  "Zoom Pro": "화상수업·회의·화면 공유·소그룹 활동을 지원하는 원격 협업 도구",
  "다했니·다했어요": "과제 배부·제출·확인과 학급 활동 기록을 돕는 학급관리 플랫폼",
  "리드포스쿨": "시선추적과 AI 분석을 활용해 읽기 과정을 진단하는 문해력 코스웨어",
  "캡컷": "자막·효과·AI 기능을 갖춘 영상 편집 및 숏폼 제작 도구",
  "코드모스": "학교 수업용 단계형 SW·AI 학습 콘텐츠를 제공하는 코딩 코스웨어",
  "클래스카드": "영어 어휘·문장 세트를 게임과 반복 학습으로 익히는 언어 학습 도구",
  "클래스팅 AI": "학급관리와 AI 기반 진단·맞춤 학습을 결합한 교육 플랫폼",
  "클래시파이": "학생 성향·관계 심리검사 결과로 상담과 생활지도를 돕는 학급관리 도구",
  "AI 아크수학": "학생 수준 진단과 맞춤형 수학 학습을 지원하는 AI 수학 코스웨어",
  "AI마타수학": "진단 결과에 따라 개별 수학 문항과 학습 경로를 제공하는 AI 코스웨어",
  "Delightex": "3D 공간을 만들고 코딩·VR·AR로 확장하는 실감형 창작 플랫폼",
  "Snorkl": "학생이 말·글·그림으로 설명하면 즉시 AI 피드백하는 형성평가 플랫폼",
  "Wordwall": "교사가 만든 문항을 게임·활동지 형태로 바꾸는 퀴즈 저작 도구",
  "리딩게이트": "레벨별 영어 원서 읽기와 독후 활동을 제공하는 영어 독서 프로그램",
  "리딩오션": "전자책 읽기와 독서 활동·학습 관리를 제공하는 디지털 독서 플랫폼",
  "마이클": "학교 문서·수업 자료·상담 기록을 생성하는 교원 업무 특화 AI",
  "매일국어·독도": "국어 기초 학습과 독해·어휘 연습을 지원하는 교과 학습 콘텐츠",
  "멘티미터": "실시간 투표·설문·퀴즈·워드클라우드로 의견을 모으는 참여 도구",
  "미리캔버스": "프레젠테이션·카드뉴스·학습자료를 만드는 웹 기반 디자인 도구",
  "아이쌤GPT": "교사의 수업 준비와 학교 업무를 지원하는 교육 특화 생성형 AI",
  "와우아이디어스": "온라인 브레인스토밍으로 아이디어 생성·정리·평가·공유를 잇는 PBL 협업 도구",
  "초코클래스": "수업 콘텐츠·학생 활동·학습 데이터를 운영하는 교실 학습 플랫폼",
  "토도수학": "초등 수 개념과 연산을 단계별 활동으로 익히는 수학 학습 앱",
  "투닝": "안전한 AI 기능으로 웹툰·스토리·이미지 콘텐츠를 만드는 교육용 창작 도구",
  "4K Video Downloader+": "온라인 영상·음원을 내려받아 수업 자료로 관리하는 미디어 보조 도구",
  "EBS영어": "EBS 영어 영상·음원·학습 콘텐츠를 활용하는 영어 학습 서비스",
  "ElevenLabs": "텍스트를 자연스러운 음성으로 변환하고 보이스를 생성하는 AI 오디오 도구",
  "Learney": "성취기준 기반 국어·문해 학습과 AI 피드백·진도 분석을 제공하는 플랫폼",
  "Lily's AI": "영상·문서·웹 자료를 요약하고 지식 노트로 정리하는 AI 학습 보조 도구",
  "OpenAI API": "생성형 AI 모델을 맞춤형 앱·자동화·수업 도구에 연결하는 개발 인터페이스",
  "TBLT-Agent": "과업 중심 언어 수업 설계와 활동 생성을 지원하는 AI 에이전트",
  "U클래스": "학생 계정·수업·과제·진도를 관리하는 교육용 클래스 플랫폼",
  "VLLO": "모바일에서 자막·효과·음악을 편집하는 쉬운 영상 제작 앱",
  "YBM AIDT": "교과 콘텐츠·AI 튜터·학습 분석을 결합한 YBM AI 디지털교과서",
  "e-Future e-Library": "레벨별 영어 전자책과 듣기·읽기 활동을 제공하는 영어 도서관",
  "감마": "AI로 발표자료·문서·웹페이지 초안을 만드는 프레젠테이션 저작 도구",
  "그라운드": "학생 학습 활동과 진도를 운영·확인하는 교육 플랫폼",
  "그림한글받아쓰기": "그림 단서와 받아쓰기로 초기 한글 쓰기를 연습하는 문해 학습 도구",
  "노션": "문서·데이터베이스·일정·업무를 함께 관리하는 협업 워크스페이스",
  "라포라포": "학생의 읽기·쓰기 및 의사소통 활동을 지원하는 언어 학습 도구",
  "리틀팍스": "애니메이션 영어동화와 단계별 읽기·듣기 콘텐츠를 제공하는 영어 학습 서비스",
  "매쓰플랫": "수학 문제은행·오답 관리·개인별 추천을 제공하는 맞춤형 수학 플랫폼",
  "문제G": "문항 제작·배부·채점과 학습 결과 관리를 돕는 평가 운영 도구",
  "밀리의 서재": "전자책·오디오북을 읽고 듣는 디지털 독서 구독 서비스",
  "수학대왕": "AI 진단과 개인별 문제 추천을 제공하는 수학 맞춤 학습 플랫폼",
  "스픽AI": "AI 튜터와 대화하며 영어 말하기·발음을 연습하는 회화 학습 앱",
  "슬라이도": "질문·투표·퀴즈·워드클라우드로 발표 참여를 높이는 상호작용 도구",
  "아트봉봉": "디지털 드로잉과 미술 활동 결과물 제작을 지원하는 예술교육 도구",
  "엘리프": "양방향 수업과 예습·복습을 결합한 초등 영어 디지털 학습 솔루션",
  "옥수수": "진단평가 후 학생별 학습을 추천하는 학교 전용 수학 AI 코스웨어",
  "우리반": "공지·기록·소통 등 담임의 학급 운영을 돕는 클래스 관리 도구",
  "원아워": "과제 배부·제출·피드백과 진도 확인을 지원하는 학습관리 도구",
  "젠스파크": "검색·자료 조사·문서와 프레젠테이션 생성을 수행하는 AI 에이전트",
  "지학사 AIDT": "교과 학습·AI 튜터·학습 분석을 결합한 지학사 AI 디지털교과서",
  "초등문해력": "초등 읽기 이해·어휘·독해를 단계적으로 연습하는 문해력 콘텐츠",
  "큐리팟": "질문 생성과 탐구 활동 설계를 지원하는 교육용 AI 도구",
  "클리포": "수행평가 설계·AI 자동채점·맞춤 피드백·기록을 지원하는 평가 코스웨어",
  "토도국어": "초등 국어 읽기·쓰기·어휘를 단계별로 학습하는 교과 앱",
  "퍼플 경제교실": "학생 참여형 경제·금융 수업 콘텐츠와 활동을 제공하는 교과 플랫폼",
  "플랭스쿨": "교과 학습 콘텐츠와 학생 진도·과제를 운영하는 학교용 학습 플랫폼",
  "후크패드": "코드 진행을 만들고 함께 작곡·편곡하는 웹 기반 음악 창작 도구",
};

const functionGroups = [
  { name: "협업·공유", schools: 29, rate: 50.0, color: "#18a7e0", text: "결과물·아이디어를 함께 모으고 나누는 쉬운 시작" },
  { name: "교과·맞춤형", schools: 27, rate: 46.6, color: "#7dbd35", text: "교과 진단과 개인별 연습을 수업에 연결" },
  { name: "언어·문해", schools: 24, rate: 41.4, color: "#e39a20", text: "읽기·쓰기·영어 등 언어 기능이 분명한 선택" },
  { name: "퀴즈·참여", schools: 23, rate: 39.7, color: "#f06a4e", text: "수업 중 참여·형성평가·피드백" },
  { name: "생성형 AI", schools: 22, rate: 37.9, color: "#7b68d9", text: "여러 제품을 비교하며 교원 활용을 탐색" },
  { name: "콘텐츠 제작", schools: 21, rate: 36.2, color: "#ef79b7", text: "학생과 교사의 디지털 결과물 제작" },
  { name: "학습관리", schools: 16, rate: 27.6, color: "#9a6b32", text: "과제·진도·상담·학급 운영을 한 흐름으로 관리" },
  { name: "코딩·컴퓨팅", schools: 5, rate: 8.6, color: "#66829a", text: "연수와 운영 여건을 함께 확인" },
];

const cloudFilters = [
  ["all", "전체"],
  ["협업·공유", "협업·공유"],
  ["언어·문해", "언어·문해"],
  ["퀴즈·참여", "퀴즈·참여"],
  ["교과·맞춤형", "교과·맞춤형"],
  ["생성형 AI", "생성형 AI"],
  ["콘텐츠 제작", "콘텐츠 제작"],
  ["학습관리", "학습관리"],
  ["코딩·컴퓨팅", "코딩·컴퓨팅"],
];

const groupMeta: Record<string, {
  className: string;
  demand: string;
  question: string;
  actions: string[];
}> = {
  "협업·공유": {
    className: "collab",
    demand: "학생 결과물을 한곳에 모으고 서로 보고 반응하게 하는, 진입 장벽이 낮은 수업 흐름에 수요가 큽니다.",
    question: "게시 공간을 만든 뒤 학생의 읽기·댓글·수정 활동까지 설계되어 있나요?",
    actions: ["공개 범위와 개인정보 기준 정하기", "결과물에 반응하는 규칙 만들기", "학기 말 포트폴리오 활용 여부 점검하기"],
  },
  "퀴즈·참여": {
    className: "quiz",
    demand: "즉시 참여와 빠른 확인을 원하는 선택입니다. 비슷한 기능의 제품이 많아 목적 없이 늘리면 중복 구독이 되기 쉽습니다.",
    question: "정답률을 보는 데서 끝나지 않고 다음 설명·모둠 활동을 바꾸는 데 쓰고 있나요?",
    actions: ["확인하려는 학습 목표 한 가지 정하기", "오답 뒤 재설명 방식을 함께 설계하기", "유사 퀴즈 도구와 기능 겹침 점검하기"],
  },
  "생성형 AI": {
    className: "ai",
    demand: "한 제품 독점보다 여러 생성형 AI를 비교·탐색하는 흐름입니다. 구매보다 공통 활용 원칙이 먼저 필요한 유형입니다.",
    question: "교사의 자료 제작, 학생 탐구, 업무 지원 중 어떤 장면을 위해 구독했나요?",
    actions: ["개인정보·저작권·검증 원칙 합의하기", "도구별 강점을 한 장으로 비교하기", "좋은 활용 사례와 실패 사례를 함께 기록하기"],
  },
  "교과·맞춤형": {
    className: "math",
    demand: "수학뿐 아니라 국어·영어 등 교과 진단과 개인별 연습을 지원하는 코스웨어 수요입니다. 이용량보다 결과가 보충·심화 수업으로 이어지는지가 중요합니다.",
    question: "진단·추천 결과가 교사의 다음 차시 판단과 실제 개별 지원으로 연결되고 있나요?",
    actions: ["대상 학년·교과·단원을 좁혀 적용하기", "진단 뒤 교사 개입 장면 정하기", "학생별 변화 사례를 짧게 남기기"],
  },
  "언어·문해": {
    className: "literacy",
    demand: "읽기·쓰기·영어 등 구체적인 교과 문제를 해결하려는 선택입니다. 제품 수가 많아 학년별로 흩어질 가능성도 큽니다.",
    question: "어휘·읽기 유창성·이해·쓰기 중 실제로 개선하려는 기능이 분명한가요?",
    actions: ["대상 학생과 언어 기능 명시하기", "교사 관찰 기록과 도구 결과 함께 보기", "학년 간 중복 구독과 연계성 점검하기"],
  },
  "콘텐츠 제작": {
    className: "create",
    demand: "글·이미지·영상·음악을 결합한 결과물 제작 수요입니다. 완성도보다 학습 내용을 설명하고 수정하는 과정이 핵심입니다.",
    question: "예쁜 결과물보다 학생의 생각과 수정 과정이 보이도록 과제가 설계됐나요?",
    actions: ["결과물 평가 기준을 먼저 공유하기", "초안·피드백·수정 흔적 남기기", "저작권과 출처 표시 확인하기"],
  },
  "학습관리": {
    className: "manage",
    demand: "과제 배부, 진도 확인, 학급 운영을 한 흐름으로 묶으려는 선택입니다. 기존 플랫폼과 역할이 겹치는지 확인해야 합니다.",
    question: "교사와 학생의 어떤 반복 업무가 실제로 줄었는지 설명할 수 있나요?",
    actions: ["기존 LMS와 기능 중복 확인하기", "학생 로그인·접근 불편 점검하기", "사용 전후 교사 업무 변화를 기록하기"],
  },
  "코딩·컴퓨팅": {
    className: "coding",
    demand: "코딩 활동과 컴퓨팅 사고를 지원하는 선택입니다. 도구만 구매하기보다 수업 차시와 교사 지원이 함께 필요합니다.",
    question: "체험 한 번이 아니라 문제 해결 과정을 반복할 수 있는 수업 흐름이 있나요?",
    actions: ["교사 사전 체험 시간 확보하기", "단계별 산출물과 도움 기준 정하기", "기기·네트워크 여건 사전 점검하기"],
  },
};

const getRate = (schools: number) => Number(((schools / 58) * 100).toFixed(1));

const getWordSize = (schools: number) => {
  if (schools >= 20) return 66;
  if (schools >= 12) return 50;
  if (schools >= 8) return 42;
  if (schools >= 5) return 34;
  if (schools >= 3) return 28;
  if (schools >= 2) return 23;
  return 17;
};

type TabKey = "overview" | "budget" | "diagnosis" | "edutech" | "preference" | "semester";
type AppMode = "home" | "budget" | "cases";
type CaseTabKey = "case-overview" | CaseTask["key"] | "case-semester";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "한눈에" },
  { key: "budget", label: "예산 4스쿱" },
  { key: "diagnosis", label: "우리 학교 진단" },
  { key: "edutech", label: "에듀테크" },
  { key: "preference", label: "유형 인사이트" },
  { key: "semester", label: "2학기 운영" },
];

const caseTabs: { key: CaseTabKey; label: string }[] = [
  { key: "case-overview", label: "사례 한눈에" },
  { key: "required1", label: "필수 1 · 배움" },
  { key: "required2", label: "필수 2 · 관계" },
  { key: "required3", label: "필수 3 · 문화" },
  { key: "optional", label: "선택과제" },
  { key: "case-semester", label: "2학기 설계" },
];

function diagnose(value: number, median: number) {
  if (value === 0) return "아직 입력 전";
  if (value < median - 15) return "가운데 수준보다 낮은 편 · 일정과 계약 단계를 확인해 보세요.";
  if (value > median + 15) return "가운데 수준보다 높은 편 · 실제 활용과 결과 기록을 함께 점검하세요.";
  return "동료학교의 가운데 수준과 비슷해요 · 남은 일정과 활용 계획을 이어가세요.";
}

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>("home");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [activeCaseTab, setActiveCaseTab] = useState<CaseTabKey>("case-overview");
  const [caseDetail, setCaseDetail] = useState<{ taskKey: CaseTask["key"]; patternId: string } | null>(null);
  const [selectedTool, setSelectedTool] = useState(edutech[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedRecipeNumber, setSelectedRecipeNumber] = useState("1");
  const [filter, setFilter] = useState("all");
  const [toolQuery, setToolQuery] = useState("");
  const [cloudPage, setCloudPage] = useState(0);
  const [diagnosis, setDiagnosis] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const visibleTools = useMemo(
    () => edutech.filter((tool) =>
      (filter === "all" || tool.group === filter)
      && tool.name.toLocaleLowerCase("ko").includes(toolQuery.trim().toLocaleLowerCase("ko")),
    ),
    [filter, toolQuery],
  );
  const cloudPageSize = 16;
  const cloudPageCount = Math.max(1, Math.ceil(visibleTools.length / cloudPageSize));
  const safeCloudPage = Math.min(cloudPage, cloudPageCount - 1);
  const cloudTools = visibleTools.slice(
    safeCloudPage * cloudPageSize,
    safeCloudPage * cloudPageSize + cloudPageSize,
  );
  const selectedMeta = groupMeta[selectedTool.group];
  const selectedRecipe = semesterRecipes.find((recipe) => recipe.number === selectedRecipeNumber) ?? semesterRecipes[0];
  const selectedRank = edutech.findIndex((tool) => tool.name === selectedTool.name) + 1;
  const selectedRate = getRate(selectedTool.schools);
  const selectionSignal = selectedTool.schools >= 8
    ? "여러 학교에서 반복 확인된 공통 선택"
    : selectedTool.schools >= 2
      ? "소수 학교에서 반복 확인된 선택"
      : "한 학교에서 확인된 실험적 선택";
  const detailTask = caseDetail ? caseTasks.find((task) => task.key === caseDetail.taskKey) : undefined;
  const detailPattern = detailTask?.patterns.find((pattern) => pattern.id === caseDetail?.patternId);

  const toggleCheck = (key: string) =>
    setChecked((current) => ({ ...current, [key]: !current[key] }));

  const selectTab = (tab: TabKey) => {
    setAppMode("budget");
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectCaseTab = (tab: CaseTabKey) => {
    setAppMode("cases");
    setActiveCaseTab(tab);
    setCaseDetail(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setAppMode("home");
    setCaseDetail(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showCaseDetail = (task: CaseTask, pattern: CasePattern) => {
    setCaseDetail({ taskKey: task.key, patternId: pattern.id });
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCaseDetail(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const revealDetail = (id: string) => {
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const showBudgetDetail = (category: BudgetCategory) => {
    setSelectedCategory(category);
    revealDetail("budget-detail");
  };

  const showRecipeDetail = (number: string) => {
    setSelectedRecipeNumber(number);
    revealDetail("recipe-detail");
  };

  return (
    <main>
      <header className="site-header">
        <button className="brand" type="button" onClick={goHome} aria-label="분석 선택 화면으로">
          <span className="brand-mark">AI</span>
          <span>AI·디지털 활용 선도학교 운영 인사이트</span>
        </button>
        {appMode === "budget" && (
          <nav className="tab-navigation" aria-label="예산 분석 주요 화면" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={activeTab === tab.key ? "active" : ""}
                onClick={() => selectTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
        {appMode === "cases" && (
          <nav className="tab-navigation case-tabs" aria-label="과제 사례 분석 주요 화면" role="tablist">
            {caseTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeCaseTab === tab.key}
                className={activeCaseTab === tab.key ? "active" : ""}
                onClick={() => selectCaseTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
        {appMode === "home" && (
          <nav className="mode-navigation" aria-label="분석 선택">
            <button
              type="button"
              onClick={() => selectTab("overview")}
            >
              예산 분석
            </button>
            <button type="button" onClick={() => selectCaseTab("case-overview")}>과제 사례</button>
          </nav>
        )}
        <span className="date-chip">
          {appMode === "budget" ? "2026. 7. 1. 기준" : appMode === "cases" ? "1학기 사례 기반" : "2026 운영 인사이트"}
        </span>
      </header>

      <section className="portal-section" hidden={appMode !== "home"} aria-labelledby="portal-title">
        <div className="portal-copy">
          <span className="eyebrow">AI·디지털 활용 선도학교</span>
          <h1 id="portal-title">
            숫자와 사례를
            <br />
            <em>2학기 실행</em>으로 바꿔요
          </h1>
          <p>
            예산의 흐름과 수업·관계·학교문화의 변화를 한곳에서 살펴보세요.
            학교명 없이, 일반 교사가 바로 적용할 수 있는 판단과 질문에 집중했습니다.
          </p>
        </div>
        <div className="portal-visual" aria-hidden="true">
          <Image
            src="/insight-cones.png"
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 900px) 100vw, 52vw"
          />
        </div>
        <div className="portal-choice-grid">
          <button className="portal-choice budget-choice" type="button" onClick={() => selectTab("overview")}>
            <span className="choice-number">01</span>
            <div className="choice-scoops" aria-hidden="true"><i /><i /><i /><i /></div>
            <small>예산의 흐름에서 다음 행동 찾기</small>
            <h2>예산 데이터 분석</h2>
            <p>네 영역의 평균 계획·집행 흐름, 에듀테크 선택과 2학기 운영 레시피를 살펴봅니다.</p>
            <em>예산 분석 들어가기 →</em>
          </button>
          <button className="portal-choice case-choice" type="button" onClick={() => selectCaseTab("case-overview")}>
            <span className="choice-number">02</span>
            <div className="choice-scoops" aria-hidden="true"><i /><i /><i /><i /></div>
            <small>반복된 사례에서 수업의 변화 읽기</small>
            <h2>과제 사례 분석</h2>
            <p>배움·관계·학교문화·선택과제를 사례 흐름, 인사이트, 2학기 생각거리로 해석합니다.</p>
            <em>사례 분석 들어가기 →</em>
          </button>
        </div>
      </section>

      <div className="budget-app" hidden={appMode !== "budget"}>
      <section className="hero tab-panel" id="top" hidden={activeTab !== "overview"}>
        <div className="hero-copy">
          <h1>
            예산 숫자를
            <br />
            <em>2학기 실행</em>으로 바꿔요
          </h1>
          <p>
            총액보다 지금 필요한 판단에 집중했습니다. 비슷한 학교의 흐름을 보고,
            네 영역의 다음 행동과 많이 선택한 에듀테크를 가볍게 살펴보세요.
          </p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={() => selectTab("budget")}>4개 영역 살펴보기</button>
            <button className="button secondary" type="button" onClick={() => selectTab("diagnosis")}>우리 학교 진단하기</button>
          </div>
        </div>
        <div className="hero-art" aria-label="교원역량, 교육활동, 환경지원, 사업추진 네 영역을 표현한 아이스크림">
          <Image
            src="/hero-icecream.png"
            alt="교원역량, 교육활동, 환경지원, 사업추진 네 스쿱 아이스크림"
            fill
            priority
            unoptimized
            sizes="(max-width: 720px) 100vw, 48vw"
          />
        </div>
      </section>

      <section className="flow-section tab-panel" hidden={activeTab !== "overview"} aria-labelledby="flow-title">
        <div className="section-heading">
          <span className="section-kicker">동료학교 운영 흐름</span>
          <h2 id="flow-title">비슷한 학교들은 지금 어디쯤일까요?</h2>
          <p>학교들을 집행률 순으로 놓았을 때 가운데 학교는 약 57%입니다.</p>
        </div>
        <div className="flow-grid">
          <article className="flow-main">
            <div className="big-number">57.0<span>%</span></div>
            <strong>학교별 전체 집행률 가운데 수준</strong>
            <p>가운데 절반의 학교는 약 40.3%에서 74.3% 사이에 있어요.</p>
          </article>
          <article className="band-card">
            <div className="band-row"><span>50% 미만</span><div><i style={{ width: "36.2%" }} /></div><b>21개교</b></div>
            <div className="band-row"><span>50~70%</span><div><i style={{ width: "36.2%" }} /></div><b>21개교</b></div>
            <div className="band-row"><span>70% 이상</span><div><i style={{ width: "27.6%" }} /></div><b>16개교</b></div>
            <p className="chart-note">집행률은 성과 점수가 아닙니다. 계약·지급 시점과 2학기 일정을 함께 보세요.</p>
          </article>
        </div>
        <div className="insight-strip">
          <div><span>01</span><p><b>교육활동운영비</b>가 전체 실행 흐름을 이끌고 있어요.</p></div>
          <div><span>02</span><p><b>교원역량강화비</b>는 학교마다 시작 시점의 차이가 커요.</p></div>
          <div><span>03</span><p><b>사업추진경비</b>는 2학기 행사 일정과 함께 봐야 해요.</p></div>
        </div>
      </section>

      <section className="budget-section tab-panel" id="budget" hidden={activeTab !== "budget"} aria-labelledby="budget-title">
        <div className="section-heading light">
          <span className="section-kicker">예산 4스쿱</span>
          <h2 id="budget-title">영역마다 다른 속도, 같은 눈금으로 보기</h2>
          <p>평균 계획액과 7월 1일까지의 평균 집행액을 학교당 금액으로 비교했습니다.</p>
        </div>
        <div className="budget-grid">
          {categories.map((category, index) => (
            <button
              type="button"
              className={`budget-card ${selectedCategory.name === category.name ? "selected" : ""}`}
              key={category.name}
              style={{ "--accent": category.color } as React.CSSProperties}
              onClick={() => showBudgetDetail(category)}
              aria-pressed={selectedCategory.name === category.name}
              aria-label={`${category.name} 상세 분석 보기`}
            >
              <div className="budget-card-top">
                <span className="scoop-icon">{index + 1}</span>
                <span className="open-detail">상세 분석 ↗</span>
              </div>
              <h3>{category.name}</h3>
              <div className="money-pair">
                <div><span>평균 계획</span><b>{category.plan}</b></div>
                <span>→</span>
                <div><span>평균 집행</span><b>{category.spent}</b></div>
              </div>
              <div className="rate-line"><span>전체 계획액 대비 집행</span><b>{category.rate}%</b></div>
              <div className="progress"><i style={{ width: `${category.rate}%` }} /></div>
              <p className="median">학교별 가운데 수준 <b>{category.median}%</b></p>
              <p>{category.note}</p>
            </button>
          ))}
        </div>
        <article
          id="budget-detail"
          className="budget-detail-panel"
          style={{ "--accent": selectedCategory.color } as React.CSSProperties}
          aria-live="polite"
        >
          <div className="detail-panel-title">
            <div>
              <span>{selectedCategory.name} 상세 분석</span>
              <h3>{selectedCategory.headline}</h3>
            </div>
            <div className="detail-rate">
              <small>계획액 대비 집행</small>
              <b>{selectedCategory.rate}%</b>
              <span>학교별 가운데 {selectedCategory.median}%</span>
            </div>
          </div>
          <p className="detail-lead">{selectedCategory.interpretation}</p>
          <div className="budget-detail-grid">
            <section>
              <b>왜 이런 흐름일까요?</b>
              <p className="detail-caption">원자료와 운영 시점을 바탕으로 확인할 가능성입니다.</p>
              <ul>{selectedCategory.possibleReasons.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <b>우리 학교에서 확인할 것</b>
              <ul>{selectedCategory.checks.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <b>2학기 실행 순서</b>
              <ol>{selectedCategory.steps.map((item) => <li key={item}>{item}</li>)}</ol>
            </section>
          </div>
          <div className="detail-footer">
            <div><b>주요 지출 예시</b>{selectedCategory.examples.map((item) => <span key={item}>{item}</span>)}</div>
            <p><b>해석할 때 주의</b>{selectedCategory.caution}</p>
          </div>
        </article>
      </section>

      <section className="diagnosis-section tab-panel" id="diagnosis" hidden={activeTab !== "diagnosis"} aria-labelledby="diagnosis-title">
        <div className="section-heading">
          <span className="section-kicker">우리 학교 스쿱 진단</span>
          <h2 id="diagnosis-title">학교명 없이, 우리 진행률만 비교해 보세요</h2>
          <p>입력값은 이 브라우저 안에서만 계산되며 저장하거나 전송하지 않습니다.</p>
        </div>
        <div className="diagnosis-grid">
          {categories.map((category) => {
            const value = Number(diagnosis[category.short] || 0);
            return (
              <label className="diagnosis-card" key={category.name}>
                <span>{category.name}</span>
                <div className="input-wrap">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    inputMode="decimal"
                    value={diagnosis[category.short] ?? ""}
                    onChange={(event) => setDiagnosis({ ...diagnosis, [category.short]: event.target.value })}
                    placeholder="0"
                    aria-label={`${category.name} 집행률`}
                  />
                  <b>%</b>
                </div>
                <small>{diagnose(value, category.median)}</small>
              </label>
            );
          })}
        </div>
      </section>

      <section className="edutech-section tab-panel" id="edutech" hidden={activeTab !== "edutech"} aria-labelledby="edutech-title">
        <div className="section-heading">
          <span className="section-kicker">에듀테크 토핑</span>
          <h2 id="edutech-title">상위 10개부터 롱테일까지, 78종을 모두 펼쳤어요</h2>
          <p>공식 제품 소개와 교육부·교육청 활용자료로 핵심 기능을 다시 대조했습니다. 글자 크기는 확인 학교 수를 7단계로 구분하며, 클릭하면 비율·실제 기능·상세 해석이 바뀝니다.</p>
        </div>
        <div className="edutech-summary" aria-label="에듀테크 재집계 요약">
          <div><b>78</b><span>제품명이 확인된 도구</span></div>
          <div><b>41</b><span>2개교 이상 반복 선택</span></div>
          <div><b>37</b><span>1개교 롱테일 선택</span></div>
          <div><b>48.3%</b><span>1위 패들렛 확인 비율</span></div>
        </div>
        <div className="tool-toolbar">
          <div className="cloud-filters" aria-label="에듀테크 기능 필터">
            {cloudFilters.map(([key, label]) => (
              <button key={key} type="button" className={filter === key ? "active" : ""} onClick={() => {
                setFilter(key);
                setCloudPage(0);
              }}>{label}</button>
            ))}
          </div>
          <label className="tool-search">
            <span>도구 찾기</span>
            <input
              type="search"
              value={toolQuery}
              onChange={(event) => {
                setToolQuery(event.target.value);
                setCloudPage(0);
              }}
              placeholder="예: 수학, 패들렛, AI"
            />
          </label>
        </div>
        <div className="edutech-layout">
          <div className="cloud-card">
            <div className="cloud-legend" aria-label="색상 범례">
              <span className="collab">협업·공유</span>
              <span className="literacy">언어·문해</span>
              <span className="quiz">퀴즈·참여</span>
              <span className="math">교과·맞춤형</span>
              <span className="ai">생성형 AI</span>
              <span className="create">콘텐츠 제작</span>
              <span className="manage">학습관리</span>
              <span className="coding">코딩·컴퓨팅</span>
            </div>
            <p className="cloud-guide">
              <b>크기:</b> 선택 학교 수에 비례 · <b>현재:</b> {visibleTools.length}종
              {visibleTools.length > 0 && <> · {safeCloudPage * cloudPageSize + 1}–{Math.min((safeCloudPage + 1) * cloudPageSize, visibleTools.length)}번째 표시</>}
            </p>
            <div className={`word-cloud ${visibleTools.length <= 10 ? "compact" : ""}`} aria-label={`에듀테크 워드클라우드, 현재 ${visibleTools.length}종`}>
              {cloudTools.map((tool, index) => {
                const rate = getRate(tool.schools);
                const className = groupMeta[tool.group].className;
                return (
                  <button
                    key={tool.name}
                    type="button"
                    className={`cloud-word ${className} ${selectedTool.name === tool.name ? "selected" : ""}`}
                    style={{
                      "--word-size": `${getWordSize(tool.schools)}px`,
                      "--word-rotate": `${tool.schools > 1 ? [-4, 0, 4, 0][index % 4] : 0}deg`,
                    } as React.CSSProperties}
                    onMouseEnter={() => setSelectedTool(tool)}
                    onFocus={() => setSelectedTool(tool)}
                    onClick={() => setSelectedTool(tool)}
                    aria-pressed={selectedTool.name === tool.name}
                    aria-label={`${tool.name}, ${tool.schools}개교, ${rate}%, ${tool.group}`}
                  >
                    <span>{tool.name}</span>
                    {selectedTool.name === tool.name && <em>{rate}%</em>}
                  </button>
                );
              })}
              {visibleTools.length === 0 && <p className="empty-cloud">조건에 맞는 도구가 없습니다. 검색어나 기능 필터를 바꿔 보세요.</p>}
            </div>
            {visibleTools.length > cloudPageSize && (
              <div className="cloud-pagination" aria-label="워드클라우드 페이지">
                <button type="button" onClick={() => setCloudPage((page) => Math.max(0, page - 1))} disabled={safeCloudPage === 0}>이전</button>
                <span><b>{safeCloudPage + 1}</b> / {cloudPageCount}</span>
                <button type="button" onClick={() => setCloudPage((page) => Math.min(cloudPageCount - 1, page + 1))} disabled={safeCloudPage === cloudPageCount - 1}>다음</button>
              </div>
            )}
          </div>
          <aside className="tool-detail" aria-live="polite">
            <div className="tool-detail-head">
              <span className={`tool-group ${selectedMeta.className}`}>{selectedTool.group}</span>
              <span className="rank-chip">전체 {selectedRank}위</span>
            </div>
            <h3>{selectedTool.name}</h3>
            <div className="tool-purpose">
              <span>실제 핵심 기능</span>
              <p>{toolPurposes[selectedTool.name]}</p>
            </div>
            <div className="tool-share">
              <span>선택 학교 비율</span>
              <b>{selectedRate}%</b>
              <small>{selectedTool.schools}개교 / 58개교</small>
            </div>
            <p className="signal-chip">{selectionSignal}</p>
            <div className="detail-block">
              <b>이 선택이 보여주는 수업 수요</b>
              <p>{selectedMeta.demand}</p>
            </div>
            <div className="detail-block lilac">
              <b>같은 학교 지출내역에서 함께 확인된 도구</b>
              {selectedTool.related.length > 0
                ? <div className="related-tools">{selectedTool.related.map((name) => <button type="button" key={name} onClick={() => {
                  const target = edutech.find((tool) => tool.name === name);
                  if (target) setSelectedTool(target);
                }}>{name}</button>)}</div>
                : <p>함께 확인된 다른 제품명이 없습니다.</p>}
              <small>동시 등장 순이며, 함께 사용했거나 효과가 있다는 뜻은 아닙니다.</small>
            </div>
            <div className="detail-block mint">
              <b>2학기 점검 질문</b>
              <p>{selectedMeta.question}</p>
              <ul>{selectedMeta.actions.map((action) => <li key={action}>{action}</li>)}</ul>
            </div>
            <div className="reading-note">
              <b>이 숫자를 읽는 법</b>
              <p>구매·지출내용에서 제품명이 확인된 학교의 비율입니다. 1개교(1.7%) 도구는 ‘낮은 선호’로 단정하지 않고 새 시도 후보로 보세요. 실제 사용량·만족도·교육효과는 별도 확인이 필요합니다.</p>
            </div>
          </aside>
        </div>

        <details className="exact-list">
          <summary>전체 순위와 정확한 수치 보기 <span>{visibleTools.length}종 표시</span></summary>
          <div className="table-wrap">
            <table>
              <thead><tr><th>순위</th><th>도구</th><th>학교 수</th><th>비율</th><th>대표 유형</th><th>실제 핵심 기능</th></tr></thead>
              <tbody>{visibleTools.map((tool) => (
                <tr key={tool.name}>
                  <td>{edutech.findIndex((item) => item.name === tool.name) + 1}</td>
                  <th><button type="button" onClick={() => setSelectedTool(tool)}>{tool.name}</button></th>
                  <td>{tool.schools}개교</td>
                  <td>{getRate(tool.schools)}%</td>
                  <td>{tool.group}</td>
                  <td>{toolPurposes[tool.name]}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </details>
      </section>

      <section className="preference-section tab-panel" hidden={activeTab !== "preference"} aria-labelledby="preference-title">
        <div className="section-heading">
          <span className="section-kicker">교사 선택 유형</span>
          <h2 id="preference-title">어떤 기능에 선택이 모였을까요?</h2>
          <p>한 학교가 여러 유형에 포함될 수 있어 비율의 합은 100%가 아닙니다.</p>
        </div>
        <div className="preference-layout">
          <div className="preference-chart">
            {functionGroups.map((group) => (
              <div className="preference-row" key={group.name}>
                <div><b>{group.name}</b><span>{group.schools}개교 · {group.rate}%</span></div>
                <div className="preference-track"><i style={{ width: `${group.rate * 2}%`, background: group.color }} /></div>
                <p>{group.text}</p>
              </div>
            ))}
          </div>
          <article className="preference-insight">
            <span className="mini-sprinkle">● ✦ ●</span>
            <h3>공유 플랫폼은 넓게,<br />교과 도구는 다양하게</h3>
            <p>공식 기능 기준으로 다시 묶으면 협업·공유형이 50.0%로 가장 넓고, 교과·맞춤형 코스웨어도 46.6%로 여러 학년·교과에 확산됐습니다.</p>
            <p>공식 기능을 다시 대조하면 협업·공유가 50.0%로 가장 넓고, 교과·맞춤형 코스웨어가 46.6%로 뒤를 잇습니다. 언어·문해 41.4%, 퀴즈·참여 39.7%도 고르게 나타나므로 제품 수보다 해결하려는 수업 문제를 먼저 비교해야 합니다.</p>
            <small>이는 지출내용의 선택 경향이며 실제 선호 이유를 직접 조사한 결과는 아닙니다.</small>
          </article>
        </div>
      </section>

      <section className="semester-section tab-panel" id="semester" hidden={activeTab !== "semester"} aria-labelledby="semester-title">
        <div className="section-heading light">
          <span className="section-kicker">2학기 운영 레시피</span>
          <h2 id="semester-title">예산을 수업 변화로 연결하는 네 단계</h2>
          <p>카드를 누르면 실행 이유·질문·세부 순서·남길 증거가 열립니다. 완료 체크는 서버로 전송되지 않습니다.</p>
        </div>
        <div className="recipe-grid">
          {semesterRecipes.map((recipe) => (
            <button
              type="button"
              key={recipe.number}
              className={`recipe-card ${checked[recipe.number] ? "done" : ""} ${selectedRecipeNumber === recipe.number ? "selected" : ""}`}
              onClick={() => showRecipeDetail(recipe.number)}
              aria-pressed={selectedRecipeNumber === recipe.number}
              aria-label={`${recipe.title} 상세 안내 보기`}
            >
              <span>{checked[recipe.number] ? "✓" : recipe.number}</span>
              <div>
                <small>{checked[recipe.number] ? "실행 체크 완료" : `${recipe.number}단계`}</small>
                <b>{recipe.title}</b>
                <p>{recipe.summary}</p>
                <em>상세 안내 보기 →</em>
              </div>
            </button>
          ))}
        </div>
        <article id="recipe-detail" className="recipe-detail-panel" aria-live="polite">
          <div className="recipe-detail-head">
            <div>
              <span>{selectedRecipe.number}단계 상세 안내</span>
              <h3>{selectedRecipe.title}</h3>
              <p>{selectedRecipe.purpose}</p>
            </div>
            <button
              type="button"
              className={checked[selectedRecipe.number] ? "checked" : ""}
              onClick={() => toggleCheck(selectedRecipe.number)}
              aria-pressed={Boolean(checked[selectedRecipe.number])}
            >
              {checked[selectedRecipe.number] ? "✓ 실행 체크 완료" : "○ 이 단계 실행 체크"}
            </button>
          </div>
          <div className="recipe-why"><b>왜 필요한가요?</b><p>{selectedRecipe.why}</p></div>
          <div className="recipe-detail-grid">
            <section>
              <b>운영교사가 함께 물어볼 질문</b>
              <ul>{selectedRecipe.questions.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <b>실행 순서</b>
              <ol>{selectedRecipe.steps.map((item) => <li key={item}>{item}</li>)}</ol>
            </section>
            <section>
              <b>남겨둘 작은 증거</b>
              <ul>{selectedRecipe.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>
          <p className="recipe-caution"><b>주의할 점</b>{selectedRecipe.caution}</p>
        </article>
        <div className="closing-card">
          <div className="mini-icecream" aria-hidden="true"><i /><i /><i /><b /></div>
          <div>
            <span>7월의 숫자는 중간 점검표입니다</span>
            <h3>빨리 쓰기보다, 수업과 연결해 잘 쓰기</h3>
            <p>낮은 집행률을 실패로 보지 말고 아직 남아 있는 계획·계약·활용 단계를 확인하세요.</p>
          </div>
        </div>
      </section>
      </div>

      <div className="case-app" hidden={appMode !== "cases"}>
        <section
          className="case-overview-section tab-panel"
          hidden={activeCaseTab !== "case-overview"}
          aria-labelledby="case-overview-title"
        >
          <div className="section-heading">
            <span className="section-kicker">과제 사례 분석</span>
            <h2 id="case-overview-title">몇 곳이 했는지보다, 어떻게 바꾸었는지</h2>
            <p>
              과제 제출 여부를 세지 않았습니다. 여러 사례에서 반복된 수업 장면을
              ‘사례 흐름–인사이트–2학기 생각거리’로 다시 읽었습니다.
            </p>
          </div>
          <div className="case-scoop-grid">
            {caseTasks.map((task, index) => (
              <button
                type="button"
                className="case-scoop-card"
                key={task.key}
                style={{ "--case-accent": task.color } as React.CSSProperties}
                onClick={() => selectCaseTab(task.key)}
              >
                <div className="case-scoop-top">
                  <span>{index + 1}</span>
                  <em>사례 읽기 ↗</em>
                </div>
                <small>{task.label}</small>
                <h3>{task.short}</h3>
                <p>{task.essentialQuestion}</p>
                <div className="case-preview-chips">
                  {task.patterns.slice(0, 3).map((pattern) => <i key={pattern.id}>{pattern.title}</i>)}
                </div>
              </button>
            ))}
          </div>
          <div className="case-reading-guide">
            <div>
              <span>01</span>
              <b>사례 흐름</b>
              <p>도구 이름보다 수업이 어떤 순서로 바뀌었는지 봅니다.</p>
            </div>
            <div>
              <span>02</span>
              <b>인사이트</b>
              <p>반복되는 장면이 교사의 판단에 어떤 의미인지 해석합니다.</p>
            </div>
            <div>
              <span>03</span>
              <b>2학기 생각거리</b>
              <p>그대로 복사하기보다 우리 학교에 맞게 바꿀 질문을 제시합니다.</p>
            </div>
          </div>
          <div className="anonymous-note">
            <b>학교명은 표시하지 않습니다.</b>
            <p>사례는 학교를 특정할 수 있는 표현을 덜어내고, 공통 운영 방식 중심으로 재서술했습니다.</p>
          </div>
        </section>

        {caseTasks.map((task) => (
          <section
            className="case-task-section tab-panel"
            key={task.key}
            hidden={activeCaseTab !== task.key}
            style={{ "--case-accent": task.color } as React.CSSProperties}
            aria-labelledby={`${task.key}-title`}
          >
            <div className="case-task-hero">
              <div>
                <span className="section-kicker">{task.label} · {task.short}</span>
                <h2 id={`${task.key}-title`}>{task.headline}</h2>
                <p>{task.intro}</p>
              </div>
              <aside>
                <small>이 과제를 읽는 핵심 질문</small>
                <strong>{task.essentialQuestion}</strong>
              </aside>
            </div>

            <div className="case-section-title">
              <span>반복 사례에서 찾은 흐름</span>
              <h3>교실과 학교에서 자주 나타난 장면</h3>
              <p>카드를 누르면 실행 순서, 인사이트, 주의점과 2학기 적용 질문이 바로 열립니다.</p>
            </div>
            <div className="case-pattern-grid">
              {task.patterns.map((pattern, index) => (
                <button
                  type="button"
                  className="case-pattern-card"
                  key={pattern.id}
                  onClick={() => showCaseDetail(task, pattern)}
                  aria-label={`${pattern.title} 상세 사례 분석 보기`}
                >
                  <div>
                    <span className={`case-signal ${
                      pattern.signal === "가장 두드러짐"
                        ? "signal-strong"
                        : pattern.signal === "반복적으로 확인"
                          ? "signal-repeat"
                          : "signal-new"
                    }`}>{pattern.signal}</span>
                    <b>0{index + 1}</b>
                  </div>
                  <h4>{pattern.title}</h4>
                  <p>{pattern.summary}</p>
                  <em>상세 사례 분석 보기 →</em>
                </button>
              ))}
            </div>

            <div className="case-meaning-grid">
              <article>
                <span>이 과제에서 읽은 인사이트</span>
                <h3>도구가 아니라 변화의 구조를 봅니다</h3>
                <ul>{task.insights.map((insight) => <li key={insight}>{insight}</li>)}</ul>
              </article>
              <article>
                <span>2학기 운영 초점</span>
                <h3>작게 시작해 증거를 남깁니다</h3>
                <ol>{task.semesterFocus.map((focus) => <li key={focus}>{focus}</li>)}</ol>
                <button type="button" onClick={() => selectCaseTab("case-semester")}>통합 2학기 설계 보기 →</button>
              </article>
            </div>
          </section>
        ))}

        <section
          className="case-semester-section tab-panel"
          hidden={activeCaseTab !== "case-semester"}
          aria-labelledby="case-semester-title"
        >
          <div className="section-heading light">
            <span className="section-kicker">과제 사례 기반 2학기 설계</span>
            <h2 id="case-semester-title">네 과제를 따로 하지 말고, 하나의 변화로</h2>
            <p>
              배움–관계–교사문화–학교특색은 서로 연결됩니다. 한 번에 크게 벌이기보다
              한 수업의 변화가 동료와 학교에 이어지도록 순서를 잡아보세요.
            </p>
          </div>
          <div className="case-semester-flow">
            {caseTasks.map((task, index) => (
              <article key={task.key} style={{ "--case-accent": task.color } as React.CSSProperties}>
                <span>{index + 1}</span>
                <small>{task.label}</small>
                <h3>{task.short}</h3>
                <p>{task.semesterFocus[0]}</p>
                <ul>{task.semesterFocus.slice(1).map((focus) => <li key={focus}>{focus}</li>)}</ul>
                <button type="button" onClick={() => selectCaseTab(task.key)}>관련 사례 보기 →</button>
              </article>
            ))}
          </div>
          <div className="case-semester-recipe">
            <div>
              <span>1주차</span>
              <b>문제 한 문장</b>
              <p>학생과 교사가 지금 가장 바꾸고 싶은 수업 장면을 한 문장으로 정합니다.</p>
            </div>
            <div>
              <span>2~4주차</span>
              <b>작은 실행</b>
              <p>한 학년·한 단원에서 역할, 피드백, 재수행이 보이는 수업을 시험합니다.</p>
            </div>
            <div>
              <span>5주차</span>
              <b>증거와 성찰</b>
              <p>학생 반응, 수정 전후 결과물, 교사의 다음 판단을 짧게 남깁니다.</p>
            </div>
            <div>
              <span>그다음</span>
              <b>동료와 재설계</b>
              <p>잘된 점보다 바꿀 점을 먼저 나누고, 다음 교사가 다시 쓸 수 있게 정리합니다.</p>
            </div>
          </div>
        </section>
      </div>

      {detailTask && detailPattern && (
        <div className="case-dialog-backdrop" role="presentation" onMouseDown={() => setCaseDetail(null)}>
          <aside
            className="case-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-dialog-title"
            style={{ "--case-accent": detailTask.color } as React.CSSProperties}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="case-dialog-head">
              <div>
                <span>{detailTask.label} · {detailTask.short}</span>
                <small className={`case-signal ${
                  detailPattern.signal === "가장 두드러짐"
                    ? "signal-strong"
                    : detailPattern.signal === "반복적으로 확인"
                      ? "signal-repeat"
                      : "signal-new"
                }`}>{detailPattern.signal}</small>
              </div>
              <button type="button" onClick={() => setCaseDetail(null)} aria-label="상세 분석 닫기">×</button>
            </div>
            <h2 id="case-dialog-title">{detailPattern.title}</h2>
            <p className="case-dialog-summary">{detailPattern.summary}</p>

            <section className="case-flow-detail">
              <b>사례에서 반복된 운영 흐름</b>
              <ol>{detailPattern.scene.map((scene) => <li key={scene}>{scene}</li>)}</ol>
            </section>
            <section className="case-dialog-insight">
              <span>인사이트</span>
              <p>{detailPattern.insight}</p>
            </section>
            <section className="case-dialog-semester">
              <span>2학기 운영 시 생각해볼 사안</span>
              <p>{detailPattern.semester}</p>
              <ul>{detailPattern.questions.map((question) => <li key={question}>{question}</li>)}</ul>
            </section>
            <section className="case-dialog-actions">
              <span>작게 시작하는 순서</span>
              <ol>{detailPattern.actionSteps.map((step) => <li key={step}>{step}</li>)}</ol>
            </section>
            <p className="case-dialog-watch"><b>주의할 점</b>{detailPattern.watch}</p>
            <div className="case-dialog-footer">
              <span>학교명 없이 공통 운영 방식으로 재서술한 사례입니다.</span>
              <button type="button" onClick={() => setCaseDetail(null)}>확인했어요</button>
            </div>
          </aside>
        </div>
      )}

      <footer>
        <div>
          <b>AI·디지털 활용 선도학교 운영 인사이트</b>
          <p>예산 데이터와 1학기 과제 사례 기반</p>
          <p>© 2026 서울가동초 백인규. All rights reserved.</p>
        </div>
        <p>학교명과 학교별 원문·금액은 공개 데이터에 포함하지 않았습니다.</p>
      </footer>
    </main>
  );
}
