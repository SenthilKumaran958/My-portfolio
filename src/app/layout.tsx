import type { Metadata } from "next";
import { Cinzel, Inter, Spectral } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const siteName = "Senthil Kumaran — Game Developer & Environment Artist";
const siteDescription =
  "Senthil Kumaran is an independent game developer and aspiring environment artist building atmospheric game worlds, gameplay systems, and immersive 3D environments. Featured project: Shadow Blade, a 2D action-platformer built in Godot Engine.";
const siteUrl = "https://senthilkumaran.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s — Senthil Kumaran",
  },
  description: siteDescription,
  keywords: [
    "Game Developer",
    "Environment Artist",
    "Level Designer",
    "Godot Engine",
    "GDScript",
    "2D Action Platformer",
    "Shadow Blade",
    "Blender",
    "Unreal Engine 5",
    "Indie Games",
    "Senthil Kumaran",
  ],
  authors: [{ name: "Senthil Kumaran" }],
  creator: "Senthil Kumaran",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: "Senthil Kumaran Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Senthil Kumaran — Game Developer & Environment Artist",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${inter.variable} ${spectral.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
