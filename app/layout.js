import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import { RepoProvider } from "@/lib/RepoContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Repo Viewer",
  description: "A repository viewer for app stores",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RepoProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
            <Toaster />
          </RepoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
