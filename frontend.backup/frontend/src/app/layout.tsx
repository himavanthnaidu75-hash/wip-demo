import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z.studio — Cinematic Interactive Demo Studio",
  description: "Explore high-end, cinematic interactive demos across multiple industries. Restaurant, Electronics, Hotel, and custom business showcases built with Next.js, Three.js, and Framer Motion.",
  keywords: ["demo studio", "interactive", "cinematic", "3D", "restaurant", "electronics", "hotel", "web design"],
  authors: [{ name: "Z.studio" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Z.studio — Cinematic Demo Studio",
    description: "High-end interactive demos for any business vertical.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased bg-cinematic-bg text-white`}>
        {children}
      </body>
    </html>
  );
}