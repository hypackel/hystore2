import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import { RepoProvider } from "@/lib/RepoContext";
import { SettingsProvider } from "@/lib/SettingsContext";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import SettingsModal from "@/components/SettingsModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Repo Viewer",
  description: "A repository viewer for app stores and sideloading apps",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Repo Viewer"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: "Repo Viewer",
    title: "Repo Viewer",
    description: "A repository viewer for app stores and sideloading apps"
  },
  twitter: {
    card: "summary",
    title: "Repo Viewer",
    description: "A repository viewer for app stores and sideloading apps"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Repo Viewer" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#18181b" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SettingsProvider>
            <RepoProvider>
              <div className="min-h-screen bg-background">
                <Navigation />
                <main className="container mx-auto px-4 py-8">
                  {children}
                </main>
              </div>
              <Toaster />
              <SettingsModal />
              <ServiceWorkerRegistration />
            </RepoProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
