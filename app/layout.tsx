import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  "localhost:3000";
const deploymentOrigin = deploymentHost.startsWith("localhost")
  ? `http://${deploymentHost}`
  : `https://${deploymentHost}`;
const title = "2026 AI·디지털 활용 선도학교 운영 인사이트";
const description =
  "예산의 흐름과 배움·관계·학교문화 사례를 2학기 실행으로 연결하는 교사용 인사이트 웹앱";

export const metadata: Metadata = {
  metadataBase: new URL(deploymentOrigin),
  title,
  description,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og-insights.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-insights.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
