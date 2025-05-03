import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Glow Up Diaries",
  description: "Connect young ambitious people to opportunities, events, and free resources.",
  generator: 'v0.dev',
  icons: {
    icon: '/images/logo-icon-transparent (2).png',
    shortcut: '/images/logo-icon-transparent (2).png',
    apple: '/images/logo-icon-transparent (2).png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <Analytics />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-center" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
