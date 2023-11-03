import "./globals.css"

import { Inter } from "next/font/google"

import AuthProvider from "@/context/auth-provider"

import type { Metadata } from "next"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Github Stats",
    description: "Generate github statistics of any user",
    keywords:
        "github stats, gh stats, gh-stats, git statistics of developers, github statistics for developers, github contributions, github contributions statistics, github statistics",
    openGraph: {
        title: "Github Stats",
        description:
            "Bitcoin-dev and Lightning-dev mailing list summaries and discoveries",
        url: "https://ghstats.bitcoinsearch.xyz",
        type: "website",
        images: [
            {
                url: "https://ghstats.bitcoinsearch.xyz/images/bitcoin-dev-og.png"
            }
        ]
    },
    twitter: {
        card: "summary",
        creator: "@chaincodelabs",
        images: ["https://ghstats.bitcoinsearch.xyz/images/bitcoin-dev-og.png"]
    }
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <AuthProvider>
                <body className={inter.className}>{children}</body>
            </AuthProvider>
        </html>
    )
}
