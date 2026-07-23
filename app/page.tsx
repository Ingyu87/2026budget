"use client";

import { useMemo, useState } from "react";

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
};

type Edutech = {
  name: string;
  schools: number;
  rate: number;
  group: string;
  colorGroup: string;
  insight: string;
  action: string;
  x: number;
  y: number;
  rotate: number;
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
  },
];

const edutech: Edutech[] = [
  { name: "패들렛", schools: 26, rate: 44.8, group: "협업·공유", colorGroup: "collab", insight: "결과물 수집과 공유를 빠르게 시작할 수 있는 유형에 선택이 모였습니다.", action: "게시판 수보다 학생 참여 방식과 결과물 활용 계획을 먼저 점검해 보세요.", x: 50, y: 48, rotate: 0 },
  { name: "북크리에이터", schools: 13, rate: 22.4, group: "콘텐츠 제작", colorGroup: "create", insight: "학생이 글·이미지·음성을 엮어 결과물을 만드는 도구가 두 번째로 많이 확인됐습니다.", action: "완성물의 평가 기준과 공유 대상을 수업 전에 정해 보세요.", x: 27, y: 27, rotate: -8 },
  { name: "매쓰홀릭", schools: 11, rate: 19.0, group: "수학·맞춤형 학습", colorGroup: "learn", insight: "교과 특화형 맞춤학습 도구에 대한 수요도 뚜렷합니다.", action: "진단 결과가 실제 보충·심화 활동으로 이어지는지 확인해 보세요.", x: 72, y: 29, rotate: 8 },
  { name: "ChatGPT", schools: 8, rate: 13.8, group: "생성형 AI", colorGroup: "ai", insight: "생성형 AI는 하나의 제품에 집중되기보다 여러 서비스로 나뉘어 선택됐습니다.", action: "개인정보, 계정, 결과 검증 원칙을 학교 공통으로 합의해 보세요.", x: 69, y: 66, rotate: -7 },
  { name: "Gemini", schools: 8, rate: 13.8, group: "생성형 AI", colorGroup: "ai", insight: "생성형 AI 선택이 분산되어 교사별 활용 목적을 먼저 확인할 필요가 있습니다.", action: "기존 학교 계정 체계와 연동되는지, 중복 구독은 없는지 살펴보세요.", x: 31, y: 68, rotate: 7 },
  { name: "ZEP·젭퀴즈", schools: 8, rate: 13.8, group: "퀴즈·평가·참여", colorGroup: "learn", insight: "놀이형 참여와 즉각적인 반응을 지원하는 도구가 꾸준히 선택됐습니다.", action: "재미뿐 아니라 어떤 학습 확인에 사용할지 질문을 설계해 보세요.", x: 49, y: 18, rotate: 5 },
  { name: "Claude", schools: 7, rate: 12.1, group: "생성형 AI", colorGroup: "ai", insight: "생성형 AI 도구가 복수로 선택되며 장문·자료 제작 수요가 함께 보입니다.", action: "도구별 장단점을 비교한 짧은 교사 사례를 공유해 보세요.", x: 51, y: 78, rotate: -8 },
  { name: "키위티", schools: 5, rate: 8.6, group: "퀴즈·평가·참여", colorGroup: "learn", insight: "수업 중 참여와 피드백을 간편하게 확인하려는 선택으로 볼 수 있습니다.", action: "수집한 반응을 다음 차시 수업에 어떻게 반영할지 정해 보세요.", x: 16, y: 50, rotate: -8 },
  { name: "띵커벨", schools: 5, rate: 8.6, group: "퀴즈·평가·참여", colorGroup: "learn", insight: "실시간 확인과 상호작용 도구가 여러 제품으로 나뉘어 선택됐습니다.", action: "비슷한 기능을 가진 도구의 중복 구독 여부를 점검해 보세요.", x: 83, y: 48, rotate: 8 },
  { name: "지니아튜터", schools: 4, rate: 6.9, group: "언어·문해", colorGroup: "create", insight: "언어·문해 지원은 전체에서 작은 비중이지만 교과 목적이 분명한 선택입니다.", action: "대상 학년과 향상시키려는 언어 기능을 구체화해 보세요.", x: 20, y: 78, rotate: 6 },
];

const functionGroups = [
  { name: "협업·공유", schools: 28, rate: 48.3, color: "#18a7e0", text: "결과물을 모으고 나누는 쉬운 시작" },
  { name: "퀴즈·평가·참여", schools: 20, rate: 34.5, color: "#f06a4e", text: "수업 중 즉각적인 참여와 피드백" },
  { name: "콘텐츠 제작", schools: 16, rate: 27.6, color: "#ef79b7", text: "학생과 교사의 디지털 결과물 제작" },
  { name: "수학·맞춤형 학습", schools: 16, rate: 27.6, color: "#7dbd35", text: "교과 진단과 개인별 학습 지원" },
  { name: "생성형 AI", schools: 15, rate: 25.9, color: "#7b68d9", text: "여러 제품으로 나뉜 탐색과 활용" },
  { name: "언어·문해", schools: 9, rate: 15.5, color: "#e39a20", text: "목적이 분명한 교과 특화 활용" },
  { name: "코딩·컴퓨팅", schools: 5, rate: 8.6, color: "#66829a", text: "연수와 운영 여건을 함께 확인" },
];

const cloudFilters = [
  ["all", "전체"],
  ["collab", "협업·공유"],
  ["create", "제작·표현"],
  ["ai", "생성형 AI"],
  ["learn", "평가·맞춤학습"],
];

type TabKey = "overview" | "budget" | "diagnosis" | "edutech" | "preference" | "semester";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "한눈에" },
  { key: "budget", label: "예산 4스쿱" },
  { key: "diagnosis", label: "우리 학교 진단" },
  { key: "edutech", label: "에듀테크" },
  { key: "preference", label: "유형 인사이트" },
  { key: "semester", label: "2학기 운영" },
];

function diagnose(value: number, median: number) {
  if (value === 0) return "아직 입력 전";
  if (value < median - 15) return "가운데 수준보다 낮은 편 · 일정과 계약 단계를 확인해 보세요.";
  if (value > median + 15) return "가운데 수준보다 높은 편 · 실제 활용과 결과 기록을 함께 점검하세요.";
  return "동료학교의 가운데 수준과 비슷해요 · 남은 일정과 활용 계획을 이어가세요.";
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [selectedTool, setSelectedTool] = useState(edutech[0]);
  const [filter, setFilter] = useState("all");
  const [diagnosis, setDiagnosis] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const visibleTools = useMemo(
    () => edutech.filter((tool) => filter === "all" || tool.colorGroup === filter),
    [filter],
  );

  const toggleCheck = (key: string) =>
    setChecked((current) => ({ ...current, [key]: !current[key] }));

  const selectTab = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => selectTab("overview")} aria-label="한눈에 화면으로">
          <span className="brand-mark">AI</span>
          <span>선도학교 예산 레시피</span>
        </button>
        <nav className="tab-navigation" aria-label="주요 화면" role="tablist">
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
        <span className="date-chip">2026. 7. 1. 기준</span>
      </header>

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
        <div className="hero-art" aria-label="네 가지 예산 영역을 표현한 아이스크림 일러스트">
          <div className="sparkle s1">✦</div>
          <div className="sparkle s2">●</div>
          <div className="sparkle s3">✦</div>
          <div className="scoops">
            <div className="scoop scoop-pink">연수</div>
            <div className="scoop scoop-green">수업</div>
            <div className="scoop scoop-blue">환경</div>
            <div className="scoop scoop-yellow">운영</div>
          </div>
          <div className="cone"><span>2학기<br />레시피</span></div>
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
            <article className="budget-card" key={category.name} style={{ "--accent": category.color } as React.CSSProperties}>
              <div className="budget-card-top">
                <span className="scoop-icon">{index + 1}</span>
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
              <div className="tag-list">{category.examples.map((item) => <span key={item}>{item}</span>)}</div>
              <div className="action-box"><b>2학기 한 걸음</b><p>{category.action}</p></div>
            </article>
          ))}
        </div>
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
          <h2 id="edutech-title">글자가 클수록 더 많은 학교에서 확인됐어요</h2>
          <p>단어를 가리키거나 선택하면 정확한 비율과 2학기 활용 질문을 볼 수 있습니다.</p>
        </div>
        <div className="cloud-filters" aria-label="에듀테크 기능 필터">
          {cloudFilters.map(([key, label]) => (
            <button key={key} className={filter === key ? "active" : ""} onClick={() => setFilter(key)}>{label}</button>
          ))}
        </div>
        <div className="edutech-layout">
          <div className="cloud-card">
            <div className="cloud-legend" aria-label="색상 범례">
              <span className="collab">협업·공유</span>
              <span className="create">제작·표현</span>
              <span className="ai">생성형 AI</span>
              <span className="learn">평가·맞춤학습</span>
            </div>
            <div className="word-cloud">
              {visibleTools.map((tool) => {
                const size = 18 + Math.sqrt(tool.schools / 26) * 38;
                return (
                  <button
                    key={tool.name}
                    className={`cloud-word ${tool.colorGroup} ${selectedTool.name === tool.name ? "selected" : ""}`}
                    style={{
                      "--word-size": `${size}px`,
                      "--word-rotate": `${tool.rotate}deg`,
                    } as React.CSSProperties}
                    onMouseEnter={() => setSelectedTool(tool)}
                    onFocus={() => setSelectedTool(tool)}
                    onClick={() => setSelectedTool(tool)}
                    aria-label={`${tool.name}, ${tool.schools}개교, ${tool.rate}%, ${tool.group}`}
                  >
                    {tool.name}
                  </button>
                );
              })}
            </div>
          </div>
          <aside className="tool-detail" aria-live="polite">
            <span className={`tool-group ${selectedTool.colorGroup}`}>{selectedTool.group}</span>
            <h3>{selectedTool.name}</h3>
            <div className="tool-stat"><b>{selectedTool.schools}</b><span>개교</span><i /><b>{selectedTool.rate}%</b></div>
            <p className="tool-base">58개교 중 {selectedTool.schools}개교의 지출내용에서 확인</p>
            <div className="detail-block">
              <b>데이터에서 보이는 점</b>
              <p>{selectedTool.insight}</p>
            </div>
            <div className="detail-block mint">
              <b>2학기에 확인할 일</b>
              <p>{selectedTool.action}</p>
            </div>
            <small>구매·지출내용에 등장한 빈도이며 실제 활용도, 만족도, 교육효과를 뜻하지 않습니다.</small>
          </aside>
        </div>

        <details className="exact-list">
          <summary>정확한 수치 보기 <span>Top 10</span></summary>
          <div className="table-wrap">
            <table>
              <thead><tr><th>순위</th><th>도구</th><th>학교 수</th><th>비율</th><th>기능</th></tr></thead>
              <tbody>{edutech.map((tool, index) => (
                <tr key={tool.name}><td>{index + 1}</td><th>{tool.name}</th><td>{tool.schools}개교</td><td>{tool.rate}%</td><td>{tool.group}</td></tr>
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
            <h3>선택은 ‘쉽게 연결하고<br />바로 반응받는 도구’에 집중</h3>
            <p>협업·공유형이 48.3%로 가장 넓게 확인됐고, 퀴즈·평가·참여형이 34.5%로 뒤를 이었습니다.</p>
            <p>생성형 AI는 25.9%지만 여러 제품으로 나뉩니다. 특정 제품 일괄 구매보다 공통 활용원칙과 사례 공유가 먼저입니다.</p>
            <small>이는 지출내용의 선택 경향이며 실제 선호 이유를 직접 조사한 결과는 아닙니다.</small>
          </article>
        </div>
      </section>

      <section className="semester-section tab-panel" id="semester" hidden={activeTab !== "semester"} aria-labelledby="semester-title">
        <div className="section-heading light">
          <span className="section-kicker">2학기 운영 레시피</span>
          <h2 id="semester-title">예산을 수업 변화로 연결하는 네 단계</h2>
          <p>우리 학교에 필요한 항목을 체크해 보세요. 체크 상태는 서버로 전송되지 않습니다.</p>
        </div>
        <div className="recipe-grid">
          {[
            ["1", "목적 다시 보기", "구매 품목보다 해결하려는 수업 문제를 한 문장으로 적기"],
            ["2", "일정 연결하기", "계약·연수·수업·성과공유 날짜를 하나의 달력에 놓기"],
            ["3", "사용 장면 정하기", "대상 학년, 수업 차시, 교사 역할과 학생 결과물 정하기"],
            ["4", "작은 증거 남기기", "활용 횟수보다 학생 반응과 다음 개선점을 짧게 기록하기"],
          ].map(([number, title, text]) => (
            <button
              key={number}
              className={`recipe-card ${checked[number] ? "done" : ""}`}
              onClick={() => toggleCheck(number)}
              aria-pressed={Boolean(checked[number])}
            >
              <span>{checked[number] ? "✓" : number}</span>
              <div><b>{title}</b><p>{text}</p></div>
            </button>
          ))}
        </div>
        <div className="closing-card">
          <div className="mini-icecream" aria-hidden="true"><i /><i /><i /><b /></div>
          <div>
            <span>7월의 숫자는 중간 점검표입니다</span>
            <h3>빨리 쓰기보다, 수업과 연결해 잘 쓰기</h3>
            <p>낮은 집행률을 실패로 보지 말고 아직 남아 있는 계획·계약·활용 단계를 확인하세요.</p>
          </div>
        </div>
      </section>

      <footer>
        <div>
          <b>AI·디지털 선도학교 예산 레시피</b>
          <p>2026년 7월 1일 기준</p>
          <p>© 2026 서울가동초 백인규. All rights reserved.</p>
        </div>
        <p>학교명과 학교별 원문·금액은 공개 데이터에 포함하지 않았습니다.</p>
      </footer>
    </main>
  );
}
