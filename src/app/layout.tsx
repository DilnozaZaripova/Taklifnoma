import type { Metadata } from "next";
import { Playfair_Display, Inter, Great_Vibes, Cinzel, Bodoni_Moda, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-cursive",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-royal",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-modern",
  subsets: ["latin"],
});

const lato = Lato({
  weight: ["300", "400", "700"],
  variable: "--font-neutral",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inviter.uz - Raqamli To'y Taklifnomalari",
  description: "To'y va marosimlar uchun zamonaviy raqamli taklifnomalar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body
        className={`${playfair.variable} ${inter.variable} ${greatVibes.variable} ${cinzel.variable} ${bodoni.variable} ${lato.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
