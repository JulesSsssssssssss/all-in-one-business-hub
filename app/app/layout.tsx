import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "App",
  description: "Full-Stack App with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
