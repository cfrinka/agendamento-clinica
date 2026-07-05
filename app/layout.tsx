import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agendamento Clínica",
  description: "Sistema de agendamento para clínicas médicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-screen overflow-hidden bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 pt-6 pb-12">
              <Topbar />
              <div className="mt-2 animate-fade-in">{children}</div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
