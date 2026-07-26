export type SchoolLevel = "all" | "elementary" | "middle" | "high";

export type EdtechGroup =
  | "협업·공유"
  | "언어·문해"
  | "퀴즈·참여"
  | "교과·맞춤형"
  | "생성형 AI"
  | "콘텐츠 제작"
  | "학습관리"
  | "코딩·컴퓨팅";

export type LevelMetric = Record<SchoolLevel, number>;

export type EdtechUsageCase = {
  id: string;
  title: string;
  summary: string;
  level: Exclude<SchoolLevel, "all">;
  subject: string;
  category: string;
  tools: string[];
};

export type EdtechTool = {
  id: string;
  name: string;
  group: EdtechGroup;
  purpose: string;
  counts: LevelMetric;
  rates: LevelMetric;
  ranks: LevelMetric;
  related: Record<SchoolLevel, string[]>;
};

export type EdtechGroupSummary = {
  name: EdtechGroup;
  counts: LevelMetric;
  rates: LevelMetric;
  color: string;
  text: string;
};

export type EdtechSnapshot = {
  asOf: string;
  sourceCommit: string;
  denominators: LevelMetric;
  tools: EdtechTool[];
  groups: EdtechGroupSummary[];
  usageCases: EdtechUsageCase[];
};

export type TeacherWebAppExample = {
  title: string;
  description: string;
  level: Exclude<SchoolLevel, "all">;
  purpose: string;
};

export type TeacherWebAppSummary = {
  counts: LevelMetric;
  examples: TeacherWebAppExample[];
  purposes: {
    name: string;
    description: string;
  }[];
  insights: Record<SchoolLevel, {
    headline: string;
    detail: string;
    question: string;
  }>;
};
