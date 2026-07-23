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
const title = "AI·디지털 선도학교 예산 레시피";
const description =
  "58개 선도학교의 익명 예산 흐름과 에듀테크 선택을 2학기 실행으로 연결하는 대시보드";

export const metadata: Metadata = {
  metadataBase: new URL(deploymentOrigin),
  title,
  description,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
