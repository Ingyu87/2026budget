import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SOURCE_COMMIT = "9819ddad0288e65279803c8523d37fdc0ea0b0d4";
const SOURCE_URL = `https://raw.githubusercontent.com/shussamsujin/ai-cases/${SOURCE_COMMIT}/index.html`;
const OUTPUT = resolve(process.cwd(), "app", "edtech-data.ts");

const groupMeta = {
  "협업·공유": {
    color: "#18a7e0",
    text: "학생 결과물과 아이디어를 함께 모아 공유",
  },
  "언어·문해": {
    color: "#e39a20",
    text: "읽기·쓰기·영어 등 언어 학습을 지원",
  },
  "퀴즈·참여": {
    color: "#f06a4e",
    text: "수업 중 참여와 빠른 확인을 지원",
  },
  "교과·맞춤형": {
    color: "#7dbd35",
    text: "교과 진단과 개인별 연습을 수업에 연결",
  },
  "생성형 AI": {
    color: "#7b68d9",
    text: "교사의 자료 제작과 탐색·분석을 지원",
  },
  "콘텐츠 제작": {
    color: "#ef79b7",
    text: "글·이미지·영상·음악 결과물을 제작",
  },
  "학습관리": {
    color: "#9a6b32",
    text: "과제·진도·상담·학급 운영을 관리",
  },
  "코딩·컴퓨팅": {
    color: "#66829a",
    text: "코딩·컴퓨팅 사고와 디지털 제작을 지원",
  },
};

const product = (name, group, purpose, aliases = []) => ({
  name,
  group,
  purpose,
  aliases: [name, ...aliases],
});

const catalog = [
  product("캔바", "콘텐츠 제작", "발표자료·이미지·영상·웹 콘텐츠를 함께 설계하고 제작하는 시각 저작 도구", ["Canva", "캔바 AI", "AI 캔바"]),
  product("Gemini", "생성형 AI", "텍스트·이미지·자료 분석과 생성을 지원하는 멀티모달 생성형 AI", ["제미나이", "구글 젬스", "Gemini Gems", "구글 GEMS", "Gems", "구글 AI Pro", "구글AI프로", "Google AI Pro"]),
  product("NotebookLM", "생성형 AI", "교사가 넣은 자료를 근거로 요약·질문·학습 자료 생성을 지원하는 AI 도구", ["노트북LM"]),
  product("ChatGPT", "생성형 AI", "대화형 자료 생성·분석·아이디어 탐색을 지원하는 생성형 AI", ["ChatGPT Codex", "Chat GPT", "ChatGPT Plus", "챗GPT", "챗지피티"]),
  product("Claude", "생성형 AI", "긴 문서 분석·글쓰기·아이디어 정리와 코딩을 지원하는 생성형 AI", ["클로드", "클로드 코드", "클로드(스킬)"]),
  product("SUNO", "콘텐츠 제작", "텍스트 지시로 노래와 배경음악을 만드는 생성형 음악 도구", ["Suno", "Suno AI", "수노AI", "수노 AI"]),
  product("뤼튼", "생성형 AI", "한국어 대화와 자료 생성을 지원하는 생성형 AI 서비스"),
  product("Manus", "생성형 AI", "조사·정리·콘텐츠 제작 과정을 수행하는 AI 에이전트"),
  product("E-GPT", "생성형 AI", "교사가 목적에 맞는 교육용 챗봇을 구성해 활용하는 AI 서비스"),
  product("마이클AI", "생성형 AI", "학교 문서와 수업·업무 자료 작성을 지원하는 교원 업무 특화 AI", ["마이클"]),
  product("아이쌤GPT", "생성형 AI", "교사의 수업 준비와 학교 업무를 지원하는 교육 특화 생성형 AI"),
  product("이음AI", "생성형 AI", "교수학습 자료 생성과 수업 설계를 지원하는 교육용 AI 서비스"),
  product("Elice AI", "생성형 AI", "AI 학습·실습과 교육 콘텐츠 운영을 지원하는 플랫폼"),
  product("QuillBot", "생성형 AI", "영문 문장 바꾸기·문법 확인·요약을 지원하는 글쓰기 보조 도구"),
  product("파파고", "언어·문해", "텍스트·이미지·음성 번역을 지원하는 다국어 번역 도구"),
  product("Veo3", "콘텐츠 제작", "텍스트와 이미지 지시를 바탕으로 영상을 생성하는 AI 도구"),
  product("Typecast", "콘텐츠 제작", "AI 음성과 가상 인물로 오디오·영상 콘텐츠를 만드는 제작 도구"),
  product("키네마스터", "콘텐츠 제작", "모바일에서 영상과 음향을 편집하는 콘텐츠 제작 도구"),
  product("캡컷", "콘텐츠 제작", "자막·효과·AI 기능을 갖춘 영상 편집과 숏폼 제작 도구"),
  product("VLLO", "콘텐츠 제작", "모바일에서 자막·효과·음악을 편집하는 쉬운 영상 제작 앱"),
  product("미리캔버스", "콘텐츠 제작", "발표자료·카드뉴스·학습자료를 만드는 웹 기반 디자인 도구"),
  product("Gamma", "콘텐츠 제작", "AI로 발표자료·문서·웹페이지 초안을 만드는 프레젠테이션 저작 도구", ["감마"]),
  product("YouTube Premium", "콘텐츠 제작", "광고 없이 교육 영상을 탐색·재생·저장하는 영상 콘텐츠 이용 서비스", ["유튜브 프리미엄", "유튜브프리미엄", "유튜브 구독"]),
  product("4K Video Downloader+", "콘텐츠 제작", "온라인 영상·음원을 내려받아 수업 자료로 관리하는 미디어 보조 도구"),
  product("ElevenLabs", "콘텐츠 제작", "텍스트를 자연스러운 음성으로 변환하고 보이스를 생성하는 AI 오디오 도구", ["Eleven Labs"]),
  product("Adobe Creative Cloud", "콘텐츠 제작", "이미지·영상·문서 제작에 필요한 Adobe 앱과 클라우드 서비스를 제공하는 창작 도구", ["어도비클라우드", "어도비 클라우드", "Adobe Cloud", "어도비 라이선스", "어도비 라이센스"]),
  product("투닝", "콘텐츠 제작", "웹툰·스토리·이미지 콘텐츠를 만드는 교육용 창작 도구", ["Tooning AI"]),
  product("픽스톤", "콘텐츠 제작", "캐릭터와 장면을 조합해 만화와 이야기를 만드는 디지털 스토리텔링 도구"),
  product("Skybox AI", "콘텐츠 제작", "텍스트 지시로 360도 배경과 가상 공간 이미지를 만드는 AI 도구"),
  product("Kuula", "콘텐츠 제작", "360도 사진을 연결해 가상 전시와 투어를 만드는 플랫폼"),
  product("Clip Studio Paint", "콘텐츠 제작", "일러스트·만화·애니메이션 제작을 지원하는 디지털 드로잉 도구"),
  product("키노트", "콘텐츠 제작", "애플 기기에서 발표자료와 시각 자료를 제작하는 프레젠테이션 도구"),
  product("북크리에이터", "콘텐츠 제작", "글·이미지·음성·영상을 엮어 전자책과 학습 결과물을 만드는 저작 도구"),
  product("아트봉봉", "콘텐츠 제작", "디지털 드로잉과 미술 활동 결과물 제작을 지원하는 예술교육 도구", ["아트봉봉스쿨"]),
  product("후크패드", "콘텐츠 제작", "코드 진행을 만들고 함께 작곡·편곡하는 웹 기반 음악 창작 도구"),
  product("패들렛", "협업·공유", "게시판과 캔버스에 자료·의견·결과물을 함께 모으는 실시간 협업 공간", ["Padlet", "페들렛", "패들릿"]),
  product("와우아이디어스", "협업·공유", "온라인 브레인스토밍으로 아이디어 생성·정리·평가·공유를 잇는 PBL 협업 도구", ["Wow ideas", "Wow Ideas", "WowIdeas"]),
  product("Zoom Pro", "협업·공유", "화상수업·회의·화면 공유·소그룹 활동을 지원하는 원격 협업 도구", ["Zoom", "zoom프로", "줌 프로", "줌Pro"]),
  product("Google Workspace", "협업·공유", "문서·슬라이드·시트·드라이브에서 공동 편집과 자료 공유를 지원하는 협업 도구", ["구글 워크스페이스", "구글 드라이브", "구글 문서", "구글 시트", "구글 스프레드시트", "구글 슬라이드"]),
  product("MS Teams", "협업·공유", "채팅·화상회의·과제·파일 공유를 한 공간에서 운영하는 협업 플랫폼"),
  product("MS OneNote", "협업·공유", "디지털 필기와 수업 자료 정리·공유를 지원하는 전자 노트"),
  product("노션", "협업·공유", "문서·데이터베이스·일정·업무를 함께 관리하는 협업 공간", ["Notion"]),
  product("빅카인즈", "협업·공유", "뉴스 빅데이터를 검색·분석해 사회 현상 탐구를 지원하는 공공 데이터 서비스"),
  product("통그라미", "협업·공유", "설문 설계와 통계 자료 분석을 지원하는 교육용 통계 도구"),
  product("KOSIS", "협업·공유", "국가 통계 자료를 검색하고 시각화해 탐구에 활용하는 공공 데이터 서비스"),
  product("구글 클래스룸", "학습관리", "과제 배부·제출·피드백과 수업 자료 관리를 지원하는 학습관리 플랫폼"),
  product("클래스팅 AI", "학습관리", "학급관리와 AI 기반 진단·맞춤 학습을 결합한 교육 플랫폼", ["클래스팅AI"]),
  product("클래스팅", "학습관리", "수업 자료·과제·공지와 학생 소통을 지원하는 학습관리 플랫폼"),
  product("우리반", "학습관리", "공지·기록·소통 등 담임의 학급 운영을 돕는 클래스 관리 도구"),
  product("원아워", "학습관리", "과제 배부·제출·피드백과 진도 확인을 지원하는 학습관리 도구"),
  product("리로스쿨", "학습관리", "학교 일정·진로·학습·학생 기록 업무를 통합 관리하는 학교 플랫폼"),
  product("클래스툴", "학습관리", "수업 활동과 학생 참여를 운영하는 교실 지원 도구"),
  product("Class1234", "학습관리", "학생 일기·보상·댓글을 활용해 학급 소통과 참여를 돕는 운영 도구"),
  product("온라인 교무실", "학습관리", "교직원 자료 공유와 학교 업무 협업을 위한 온라인 공간"),
  product("심스페이스", "학습관리", "학생의 감정과 관계 데이터를 살펴 상담과 사회정서학습을 돕는 플랫폼"),
  product("SEN스쿨", "학습관리", "서울교육 계정과 여러 교육 서비스를 연결해 수업·학급 운영을 지원하는 플랫폼", ["센스쿨", "SEN에듀", "sen스쿨", "sen에듀"]),
  product("임팩트스페이스", "학습관리", "학생 프로젝트와 활동 기록·공유를 지원하는 교육 플랫폼"),
  product("클래시파이", "학습관리", "학생 성향·관계 검사 결과로 상담과 생활지도를 돕는 학급관리 도구"),
  product("포커스팡", "학습관리", "학생의 디지털 학습 집중과 활동 관리를 지원하는 교실 도구"),
  product("채움AI", "학습관리", "학생 학습 데이터를 바탕으로 맞춤 지원과 피드백을 돕는 교육 서비스"),
  product("오르조 클래스", "학습관리", "문제 풀이와 학습 자료 배부·관리를 지원하는 학급용 학습 플랫폼"),
  product("플랭스쿨", "학습관리", "교과 학습 콘텐츠와 학생 진도·과제를 운영하는 학교용 학습 플랫폼"),
  product("문제G", "학습관리", "문항 제작·배부·채점과 학습 결과 관리를 돕는 평가 운영 도구"),
  product("초코클래스", "학습관리", "수업 콘텐츠·학생 활동·학습 데이터를 운영하는 교실 학습 플랫폼"),
  product("그라운드", "학습관리", "학생 학습 활동과 진도를 운영·확인하는 교육 플랫폼"),
  product("U클래스", "학습관리", "학생 계정·수업·과제·진도를 관리하는 교육용 클래스 플랫폼"),
  product("퍼플 경제교실", "학습관리", "학생 참여형 경제·금융 수업 콘텐츠와 활동을 제공하는 교과 플랫폼", ["퍼플 경제 교실", "퍼플 - 경제 교실"]),
  product("클리포", "퀴즈·참여", "수행평가 설계·AI 채점·맞춤 피드백·기록을 지원하는 평가 도구", ["Clipo AI"]),
  product("Snorkl", "퀴즈·참여", "학생이 말·글·그림으로 설명하면 AI 피드백을 제공하는 형성평가 플랫폼"),
  product("ZEP·젭퀴즈", "퀴즈·참여", "메타버스형 참여 공간과 게임형 퀴즈를 결합한 수업 참여 도구", ["ZEP", "젭퀴즈", "ZEP Quiz"]),
  product("블루킷", "퀴즈·참여", "문항 세트를 여러 게임 모드로 운영하는 실시간 퀴즈 플랫폼", ["Blooket", "Blooket Plus"]),
  product("띵커벨", "퀴즈·참여", "퀴즈·토론·설문·워드클라우드·보드를 제공하는 수업 상호작용 도구", ["띵커벨 보드"]),
  product("카훗", "퀴즈·참여", "실시간 퀴즈와 설문으로 이해도와 참여를 확인하는 게임형 평가 도구", ["Kahoot"]),
  product("멘티미터", "퀴즈·참여", "실시간 투표·설문·퀴즈·워드클라우드로 의견을 모으는 참여 도구"),
  product("슬라이도", "퀴즈·참여", "질문·투표·퀴즈·워드클라우드로 발표 참여를 높이는 상호작용 도구"),
  product("퀴즈앤", "퀴즈·참여", "실시간 퀴즈와 게임형 활동으로 수업 참여를 지원하는 도구"),
  product("왓퀴즈", "퀴즈·참여", "문항 제작과 실시간 퀴즈 운영을 지원하는 수업 참여 도구"),
  product("Redmenta", "퀴즈·참여", "디지털 활동지와 과제·평가를 제작하고 피드백하는 수업 도구", ["레드멘타"]),
  product("Brisk Teaching", "퀴즈·참여", "교사의 자료 제작과 학생 글 피드백·평가를 지원하는 AI 보조 도구", ["Brisk", "브리스크 티칭"]),
  product("Wordwall", "퀴즈·참여", "교사가 만든 문항을 게임·활동지 형태로 바꾸는 퀴즈 저작 도구", ["워드월"]),
  product("매쓰홀릭", "교과·맞춤형", "수학 문제은행과 진단·추천 학습을 제공하는 수학 AI 코스웨어", ["매쓰홀릭T", "매스홀릭"]),
  product("스쿨플랫", "교과·맞춤형", "문제은행·과제·성취 분석을 제공하는 학교 맞춤형 수학 코스웨어"),
  product("풀리수학", "교과·맞춤형", "AI 진단과 수준별 수학 문제 추천을 지원하는 코스웨어", ["풀리"]),
  product("똑똑수학탐험대", "교과·맞춤형", "초등 수학 개념과 연산을 놀이형 활동으로 익히는 학습 서비스"),
  product("알지오매스키즈", "교과·맞춤형", "초등 수학의 도형·측정·규칙 탐구를 지원하는 디지털 수학 도구"),
  product("알지오매쓰2D", "교과·맞춤형", "수학 개념을 작도·그래프·조작 활동으로 탐구하는 수학 도구"),
  product("AlgeoMath", "교과·맞춤형", "대수와 기하를 시각적으로 조작하며 탐구하는 수학 학습 도구"),
  product("데스모스", "교과·맞춤형", "그래프·수식·활동지를 활용해 수학 개념 탐구를 지원하는 도구"),
  product("수학 아레나", "교과·맞춤형", "게임형 문제 풀이로 수학 연습과 참여를 지원하는 학습 서비스"),
  product("일프로 연산", "교과·맞춤형", "학생 수준에 맞춘 수학 연산 연습을 제공하는 학습 서비스"),
  product("AI 아크수학", "교과·맞춤형", "학생 수준 진단과 맞춤형 수학 학습을 지원하는 AI 코스웨어", ["AI아크수학"]),
  product("AI마타수학", "교과·맞춤형", "진단 결과에 따라 개별 수학 문항과 학습 경로를 제공하는 AI 코스웨어"),
  product("지니아튜터", "교과·맞춤형", "국·영·수·사·과 과정과 AI 글쓰기 평가를 제공하는 교과 코스웨어"),
  product("체리팟", "교과·맞춤형", "교과 학습 활동과 학생별 과제·피드백을 지원하는 교육 플랫폼"),
  product("앰플리파이 클래스룸", "교과·맞춤형", "디지털 교과 콘텐츠와 활동을 활용해 교과 수업을 지원하는 플랫폼", ["앰플리파이", "엠플리파이 클래스룸"]),
  product("수학대왕", "교과·맞춤형", "AI 진단과 개인별 문제 추천을 제공하는 수학 맞춤 학습 플랫폼"),
  product("옥수수", "교과·맞춤형", "진단평가 후 학생별 학습을 추천하는 학교 전용 수학 AI 코스웨어"),
  product("토도한글", "언어·문해", "유아·초등 초기 문해의 한글 읽기와 쓰기를 돕는 단계형 학습 앱"),
  product("토도 시리즈", "언어·문해", "한글·수학·영어를 단계별 활동으로 연습하는 초기 학습 앱", ["토도한글·수학·영어"]),
  product("토도수학", "교과·맞춤형", "초등 수 개념과 연산을 단계별 활동으로 익히는 수학 학습 앱"),
  product("알공", "교과·맞춤형", "초등 영어·수학을 게임과 AI 맞춤 복습으로 지원하는 교과 코스웨어"),
  product("매쓰플랫", "교과·맞춤형", "수학 문제은행·오답 관리·개인별 추천을 제공하는 맞춤형 수학 플랫폼"),
  product("지학사 AIDT", "교과·맞춤형", "교과 학습·AI 튜터·학습 분석을 결합한 지학사 AI 디지털교과서", ["지학사AIDT"]),
  product("키위티", "언어·문해", "학생 글쓰기 제출과 AI 대화·피드백을 지원하는 AI 글쓰기 코스웨어"),
  product("클래스카드", "언어·문해", "영어 어휘·문장 세트를 게임과 반복 학습으로 익히는 언어 학습 도구"),
  product("리드포스쿨", "언어·문해", "시선추적과 AI 분석을 활용해 읽기 과정을 진단하는 문해력 코스웨어"),
  product("러니", "언어·문해", "읽기와 문해 활동을 지원하고 학습 과정을 관리하는 교육 서비스"),
  product("달달독해", "언어·문해", "초등 독해와 어휘를 단계적으로 연습하는 문해 학습 서비스"),
  product("리딩앤스쿨", "언어·문해", "학교 영어 읽기와 수준별 독서 활동을 지원하는 디지털 영어 서비스"),
  product("리딩오션스쿨", "언어·문해", "전자책 읽기와 독서 활동·학습 관리를 제공하는 디지털 독서 플랫폼", ["리딩오션"]),
  product("리틀팍스", "언어·문해", "애니메이션 영어동화와 단계별 읽기·듣기 콘텐츠를 제공하는 영어 학습 서비스"),
  product("이퓨처라이브러리", "언어·문해", "레벨별 영어 전자책과 듣기·읽기 활동을 제공하는 영어 도서관", ["e-Future e-Library", "e-future e-library"]),
  product("리딩게이트", "언어·문해", "레벨별 영어 원서 읽기와 독후 활동을 제공하는 영어 독서 프로그램"),
  product("매일국어·독도", "언어·문해", "국어 기초 학습과 독해·어휘 연습을 지원하는 교과 학습 콘텐츠", ["매일국어,독도", "매일 독도"]),
  product("EBS영어", "언어·문해", "EBS 영어 영상·음원·학습 콘텐츠를 활용하는 영어 학습 서비스"),
  product("Learney", "언어·문해", "성취기준 기반 국어·문해 학습과 AI 피드백·진도 분석을 제공하는 플랫폼"),
  product("그림한글받아쓰기", "언어·문해", "그림 단서와 받아쓰기로 초기 한글 쓰기를 연습하는 문해 학습 도구"),
  product("라포라포", "언어·문해", "학생의 읽기·쓰기 및 의사소통 활동을 지원하는 언어 학습 도구"),
  product("밀리의 서재", "언어·문해", "전자책·오디오북을 읽고 듣는 디지털 독서 구독 서비스"),
  product("스픽AI", "언어·문해", "AI 튜터와 대화하며 영어 말하기·발음을 연습하는 회화 학습 앱"),
  product("엘리프", "언어·문해", "양방향 수업과 예습·복습을 결합한 초등 영어 디지털 학습 솔루션"),
  product("초등문해력", "언어·문해", "초등 읽기 이해·어휘·독해를 단계적으로 연습하는 문해력 콘텐츠"),
  product("토도국어", "언어·문해", "초등 국어 읽기·쓰기·어휘를 단계별로 학습하는 교과 앱"),
  product("YBM AIDT", "언어·문해", "교과 콘텐츠·AI 튜터·학습 분석을 결합한 YBM AI 디지털교과서", ["YBMAIDT"]),
  product("아이글", "언어·문해", "학생 글쓰기와 피드백 과정을 지원하는 디지털 글쓰기 도구"),
  product("자작자작", "언어·문해", "학생의 글쓰기 과정과 교사 피드백을 연결하는 디지털 글쓰기 플랫폼"),
  product("Mizou", "언어·문해", "교사가 학습 목적의 대화형 챗봇을 구성해 언어 활동에 활용하는 도구", ["미조우"]),
  product("Read Along", "언어·문해", "소리 내어 읽기와 즉각적인 발음 피드백을 지원하는 읽기 학습 도구"),
  product("MS 리딩 프로그레스", "언어·문해", "학생의 소리 내어 읽기를 기록하고 읽기 유창성을 확인하는 도구"),
  product("다했니·다했어요", "학습관리", "과제 배부·제출·확인과 학급 활동 기록을 돕는 학급관리 플랫폼", ["다했니 다했어요", "다했니", "다했어요"]),
  product("Delightex", "코딩·컴퓨팅", "3D 공간을 만들고 코딩·VR·AR로 확장하는 실감형 창작 플랫폼", ["딜라이텍스"]),
  product("엔트리", "코딩·컴퓨팅", "블록 코딩과 AI·데이터 활동을 지원하는 교육용 프로그래밍 플랫폼"),
  product("틴커캐드", "코딩·컴퓨팅", "3D 설계와 전자회로·코딩 시뮬레이션을 지원하는 제작 도구"),
  product("마인크래프트", "코딩·컴퓨팅", "가상 세계에서 협력·설계·코딩 프로젝트를 수행하는 학습 플랫폼"),
  product("AICE", "코딩·컴퓨팅", "AI 개념과 데이터 활용 역량을 학습·평가하는 교육 프로그램"),
  product("코드모스", "코딩·컴퓨팅", "학교 수업용 단계형 SW·AI 학습 콘텐츠를 제공하는 코딩 코스웨어", ["코드모스 코딩"]),
  product("Lily's AI", "생성형 AI", "영상·문서·웹 자료를 요약하고 지식 노트로 정리하는 AI 학습 보조 도구", ["LilysAI", "Lily AI"]),
  product("OpenAI API", "생성형 AI", "생성형 AI 모델을 맞춤형 앱·자동화·수업 도구에 연결하는 개발 인터페이스", ["ChatGPT API"]),
  product("TBLT-Agent", "생성형 AI", "과업 중심 언어 수업 설계와 활동 생성을 지원하는 AI 에이전트"),
  product("젠스파크", "생성형 AI", "검색·자료 조사·문서와 프레젠테이션 생성을 수행하는 AI 에이전트", ["Genspark"]),
  product("큐리팟", "생성형 AI", "질문 생성과 탐구 활동 설계를 지원하는 교육용 AI 도구"),
];

const normalize = (value) =>
  value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("ko")
    .replace(/\s+/g, " ");

const normalizeSchoolName = (value) =>
  value
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/초등학교$/, "초")
    .replace(/중학교$/, "중")
    .replace(/고등학교$/, "고");

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const source = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === "\"" && source[index + 1] === "\"") {
        cell += "\"";
        index += 1;
      } else if (character === "\"") {
        quoted = false;
      } else {
        cell += character;
      }
    } else if (character === "\"") {
      quoted = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  return dataRows
    .filter((values) => values.some(Boolean))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
};

const aliasMap = new Map();
for (const item of catalog) {
  for (const alias of item.aliases) {
    const key = normalize(alias);
    const previous = aliasMap.get(key);
    if (previous && previous !== item.name) {
      throw new Error(`Alias collision: ${alias} -> ${previous}, ${item.name}`);
    }
    aliasMap.set(key, item.name);
  }
}

const response = await fetch(SOURCE_URL);
if (!response.ok) {
  throw new Error(`Failed to load source: ${response.status}`);
}
const html = await response.text();
const match = html.match(/const CASES\s*=\s*(\[[\s\S]*?\]);/);
if (!match) throw new Error("CASES array not found");
const cases = Function(`"use strict"; return (${match[1]});`)();

const usageCategoryLabels = {
  automation: "업무·수업 자동화",
  courseware: "맞춤형 학습",
  feedback: "평가·피드백",
  genai: "생성형 AI 활용",
  inclusive: "포용·특수교육",
  literacy: "디지털·AI 소양",
  project: "프로젝트·창작",
  school: "학교 운영",
  sel: "사회정서학습",
};

const sourceSchoolNames = [...new Set(cases.map((item) => item.school).filter(Boolean))]
  .sort((left, right) => right.length - left.length);

const anonymizeCaseText = (value) => {
  let result = String(value ?? "");
  for (const schoolName of sourceSchoolNames) {
    result = result.split(schoolName).join("한 학교");
  }
  return result.trim();
};

const levelKey = (value) => {
  if (value === "초등") return "elementary";
  if (value === "중등") return "middle";
  if (value === "고등") return "high";
  throw new Error(`Unknown school level: ${value}`);
};

const catalogByName = new Map(catalog.map((item) => [item.name, item]));
const toolSchools = new Map();
const groupSchools = new Map();
const cooccurrence = new Map();
const unmapped = new Map();
const schoolRecords = new Map();
const usageCases = [];
let usageCandidateLinks = 0;
let usageVerifiedLinks = 0;

const createLevelSets = () => ({
  all: new Set(),
  elementary: new Set(),
  middle: new Set(),
  high: new Set(),
});

const createLevelMaps = () => ({
  all: new Map(),
  elementary: new Map(),
  middle: new Map(),
  high: new Map(),
});

const compactForEvidence = (value) =>
  normalize(String(value ?? ""))
    .replace(/[\s·•"'()[\]{}:,/_-]+/g, "");

const mentionsCatalogItem = (value, meta) => {
  const compactText = compactForEvidence(value);
  return meta.aliases
    .map(compactForEvidence)
    .filter((alias) => alias.length >= 2)
    .some((alias) => compactText.includes(alias));
};

const splitCaseSentences = (value) =>
  String(value ?? "")
    .split(/(?<=[.!?])\s+|[\r\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const findToolEvidence = (item, canonicalName) => {
  const meta = catalogByName.get(canonicalName);
  const summarySentences = splitCaseSentences(item.summary);
  const directSentences = summarySentences.filter((sentence) => mentionsCatalogItem(sentence, meta));

  if (directSentences.length > 0) {
    return anonymizeCaseText(directSentences.slice(0, 2).join(" "));
  }

  if (mentionsCatalogItem(item.title, meta)) {
    const title = anonymizeCaseText(item.title);
    const context = anonymizeCaseText(summarySentences[0] ?? "");
    return context ? `${title}. ${context}` : title;
  }

  return "";
};

for (const [caseIndex, item] of cases.entries()) {
  const school = normalizeSchoolName(item.school);
  const level = levelKey(item.level);
  const canonicalTools = new Set();

  for (const rawTool of item.tools) {
    const canonical = aliasMap.get(normalize(rawTool));
    if (!canonical) {
      unmapped.set(rawTool, (unmapped.get(rawTool) ?? 0) + 1);
      continue;
    }
    canonicalTools.add(canonical);
  }

  if (item.cat !== "vibecoding" && canonicalTools.size > 0) {
    usageCandidateLinks += canonicalTools.size;
    const evidenceEntries = [...canonicalTools]
      .map((canonicalName) => [canonicalName, findToolEvidence(item, canonicalName)])
      .filter(([, evidence]) => evidence);
    const verifiedTools = evidenceEntries.map(([canonicalName]) => canonicalName);
    usageVerifiedLinks += verifiedTools.length;

    if (verifiedTools.length === 0) {
      schoolRecords.set(school, { level, tools: canonicalTools });
      continue;
    }

    usageCases.push({
      id: `edtech-usage-${String(caseIndex + 1).padStart(3, "0")}`,
      title: anonymizeCaseText(item.title),
      summary: anonymizeCaseText(item.summary),
      level,
      subject: anonymizeCaseText(item.subject) || "교과 융합",
      category: usageCategoryLabels[item.cat] ?? "수업 활용",
      tools: verifiedTools.sort((left, right) => left.localeCompare(right, "ko")),
      evidence: Object.fromEntries(evidenceEntries),
    });
  }

  schoolRecords.set(school, { level, tools: canonicalTools });
}

const budgetOutputDirectory = resolve(process.cwd(), "..", "outputs");
if (!existsSync(budgetOutputDirectory)) {
  throw new Error(`Budget output directory not found: ${budgetOutputDirectory}`);
}
const budgetDetailFile = readdirSync(budgetOutputDirectory)
  .find((name) => name.includes("항목별_세부집행내역") && name.endsWith(".csv"));
if (!budgetDetailFile) {
  throw new Error("Budget detail CSV not found");
}

const budgetDetails = parseCsv(readFileSync(resolve(budgetOutputDirectory, budgetDetailFile), "utf8"));
const searchableAliases = [...aliasMap.entries()]
  .filter(([alias]) => alias.length >= 2)
  .sort((left, right) => right[0].length - left[0].length);

for (const row of budgetDetails) {
  const school = normalizeSchoolName(row["학교명"]);
  const record = schoolRecords.get(school) ?? { level: "elementary", tools: new Set() };
  let unmatchedExpenseText = normalize(`${row["지출내용 상세"]} ${row["산출근거 상세"]}`);

  for (const [alias, canonical] of searchableAliases) {
    if (!unmatchedExpenseText.includes(alias)) continue;
    record.tools.add(canonical);
    unmatchedExpenseText = unmatchedExpenseText.split(alias).join(" ".repeat(alias.length));
  }

  schoolRecords.set(school, record);
}

const denominators = {
  all: schoolRecords.size,
  elementary: [...schoolRecords.values()].filter((item) => item.level === "elementary").length,
  middle: [...schoolRecords.values()].filter((item) => item.level === "middle").length,
  high: [...schoolRecords.values()].filter((item) => item.level === "high").length,
};

if (
  denominators.all !== 177
  || denominators.elementary !== 89
  || denominators.middle !== 51
  || denominators.high !== 37
) {
  throw new Error(`Unexpected merged population: ${JSON.stringify(denominators)}`);
}

for (const [school, record] of schoolRecords) {
  const { level, tools: canonicalTools } = record;

  for (const toolName of canonicalTools) {
    const meta = catalogByName.get(toolName);
    const toolLevelSets = toolSchools.get(toolName) ?? createLevelSets();
    toolLevelSets.all.add(school);
    toolLevelSets[level].add(school);
    toolSchools.set(toolName, toolLevelSets);

    const groupLevelSets = groupSchools.get(meta.group) ?? createLevelSets();
    groupLevelSets.all.add(school);
    groupLevelSets[level].add(school);
    groupSchools.set(meta.group, groupLevelSets);
  }

  const names = [...canonicalTools];
  for (const left of names) {
    const related = cooccurrence.get(left) ?? createLevelMaps();
    for (const right of names) {
      if (left === right) continue;
      related.all.set(right, (related.all.get(right) ?? 0) + 1);
      related[level].set(right, (related[level].get(right) ?? 0) + 1);
    }
    cooccurrence.set(left, related);
  }
}

const round1 = (value) => Math.round(value * 10) / 10;
const levels = ["all", "elementary", "middle", "high"];

const tools = [...toolSchools.entries()]
  .map(([name, sets]) => {
    const meta = catalogByName.get(name);
    const counts = Object.fromEntries(levels.map((level) => [level, sets[level].size]));
    const rates = Object.fromEntries(levels.map((level) => [level, round1((counts[level] / denominators[level]) * 100)]));
    const relatedMaps = cooccurrence.get(name) ?? createLevelMaps();
    const related = Object.fromEntries(levels.map((level) => [
      level,
      [...relatedMaps[level].entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"))
        .slice(0, 5)
        .map(([relatedName]) => relatedName),
    ]));
    return {
      id: normalize(name).replace(/[^a-z0-9가-힣]+/g, "-"),
      name,
      group: meta.group,
      purpose: meta.purpose,
      counts,
      rates,
      ranks: { all: 0, elementary: 0, middle: 0, high: 0 },
      related,
    };
  });

for (const level of levels) {
  [...tools]
    .sort((a, b) => b.counts[level] - a.counts[level] || a.name.localeCompare(b.name, "ko"))
    .forEach((tool, index) => {
      tool.ranks[level] = index + 1;
    });
}

tools.sort((a, b) => a.ranks.all - b.ranks.all);

const groups = Object.keys(groupMeta).map((name) => {
  const sets = groupSchools.get(name) ?? createLevelSets();
  const counts = Object.fromEntries(levels.map((level) => [level, sets[level].size]));
  const rates = Object.fromEntries(levels.map((level) => [level, round1((counts[level] / denominators[level]) * 100)]));
  return {
    name,
    counts,
    rates,
    ...groupMeta[name],
  };
});

const teacherWebApps = {
  counts: {
    all: 24,
    elementary: 8,
    middle: 12,
    high: 4,
  },
  purposes: [
    {
      name: "수업 활동",
      description: "글쓰기·토의·교과 탐구처럼 수업 흐름에 맞춘 활동 도구",
    },
    {
      name: "평가·피드백",
      description: "결과 조회·자동 채점·서술형 피드백과 학습 데이터 확인",
    },
    {
      name: "학급 운영",
      description: "자리·역할 선택, 과제와 프로젝트 진행 상황 관리",
    },
    {
      name: "탐구·시뮬레이션",
      description: "전기회로·지진 등 직접 조작하며 개념을 확인하는 웹 도구",
    },
  ],
  examples: [
    {
      title: "과학 실험 데이터 시각화",
      description: "실험 결과를 입력하고 그래프로 비교해 탐구와 설명을 돕는 웹앱",
      level: "middle",
      purpose: "수업 활동",
    },
    {
      title: "서술형 피드백 도구",
      description: "평가기준을 바탕으로 학생 글을 검토하고 다음 수정 방향을 안내하는 웹앱",
      level: "middle",
      purpose: "평가·피드백",
    },
    {
      title: "학급 운영 프로그램",
      description: "자리와 역할 선택처럼 반복되는 학급 운영을 간단히 처리하는 웹 프로그램",
      level: "elementary",
      purpose: "학급 운영",
    },
    {
      title: "문해력 맞춤 학습 도구",
      description: "학습 데이터를 바탕으로 읽기 수준과 다음 활동을 연결하는 자체 도구",
      level: "elementary",
      purpose: "수업 활동",
    },
    {
      title: "전기회로·지진 탐구 시뮬레이터",
      description: "조건을 직접 바꾸며 과학 개념과 결과의 변화를 확인하는 웹 기반 실험 도구",
      level: "middle",
      purpose: "탐구·시뮬레이션",
    },
    {
      title: "프로젝트 진행 관리",
      description: "팀별 진행 상황과 제출물을 확인해 필요한 피드백을 빠르게 제공하는 웹앱",
      level: "high",
      purpose: "학급 운영",
    },
    {
      title: "기초학력 수업 도입 도구",
      description: "학생이 수업에 들어가기 전 핵심 개념과 준비 상태를 확인하는 웹앱",
      level: "high",
      purpose: "수업 활동",
    },
  ],
  insights: {
    all: {
      headline: "기성 도구를 구매·구독하는 데서 나아가, 교사가 수업에 필요한 기능을 직접 구현한 사례도 확인됐습니다.",
      detail: "수업·평가·학급 운영에서 반복되는 불편을 작게 해결하는 웹앱이 많았습니다. 완성도보다 실제 수업에서 바로 고쳐 쓰고 동료와 공유하는 방식이 두드러집니다.",
      question: "학교 안에서 계속 사용할 사람, 수정할 사람, 학생 정보 처리 기준을 함께 정했나요?",
    },
    elementary: {
      headline: "초등에서는 학급 운영과 문해·맞춤 학습을 돕는 작은 도구가 눈에 띕니다.",
      detail: "자리·역할 선택, 읽기 진단, 학급별 학습관리처럼 담임교사의 반복 업무와 학생별 지원을 연결한 사례가 확인됩니다.",
      question: "학생이 혼자 계정을 만들지 않아도 교사가 수업 안에서 안전하게 운영할 수 있나요?",
    },
    middle: {
      headline: "중등에서는 교과 평가와 탐구를 수업에 맞게 바꾼 웹앱이 가장 다양합니다.",
      detail: "과학 시뮬레이션, 글쓰기 피드백, 수행평가 조회, 체육 자동채점처럼 교과의 구체적인 평가 장면을 해결하려는 개발이 많았습니다.",
      question: "자동 결과를 교사의 관찰과 피드백으로 다시 확인하는 절차가 있나요?",
    },
    high: {
      headline: "고등에서는 프로젝트 관리와 교과 전문 활동을 지원하는 도구가 나타납니다.",
      detail: "온라인 저지, 팀 프로젝트 진행 관리, 기초학력 지원처럼 교과와 진로 활동의 복잡한 운영을 줄이려는 사례가 확인됩니다.",
      question: "담당 교사가 바뀌어도 유지할 수 있도록 사용법과 수정 기록을 남기고 있나요?",
    },
  },
};

const snapshot = {
  asOf: "2026-07-24",
  sourceCommit: SOURCE_COMMIT,
  denominators,
  tools,
  groups,
  usageCases,
};

for (const usageCase of usageCases) {
  for (const toolName of usageCase.tools) {
    const evidence = usageCase.evidence[toolName];
    const meta = catalogByName.get(toolName);
    if (!evidence || !mentionsCatalogItem(evidence, meta)) {
      throw new Error(`Usage evidence mismatch: ${usageCase.id} -> ${toolName}`);
    }
  }
}

const output = `// Generated by scripts/build-edtech-data.mjs. Do not edit manually.\n`
  + `import type { EdtechSnapshot, TeacherWebAppSummary } from "./edtech-types";\n\n`
  + `export const edtechSnapshot: EdtechSnapshot = ${JSON.stringify(snapshot, null, 2)};\n\n`
  + `export const teacherWebAppSummary: TeacherWebAppSummary = ${JSON.stringify(teacherWebApps, null, 2)};\n`;

writeFileSync(OUTPUT, output, "utf8");

const unmappedSorted = [...unmapped.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"));
console.log(`Generated ${tools.length} tools from ${denominators.all} merged schools.`);
console.log(
  `Verified ${usageVerifiedLinks}/${usageCandidateLinks} usage-case links; `
  + `excluded ${usageCandidateLinks - usageVerifiedLinks} links without direct title/body evidence.`,
);
console.log(`Unmapped labels (${unmappedSorted.length}):`);
for (const [name, count] of unmappedSorted) {
  console.log(`${count}\t${name}`);
}
