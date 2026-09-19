import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarNav } from "@/components/sidebar-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestão Financeira",
  description: "Plataforma de inteligência financeira.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <div className="flex min-h-screen w-full bg-background">
          <div className="hidden md:block">
            <SidebarNav />
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}