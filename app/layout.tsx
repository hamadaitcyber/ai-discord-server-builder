import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata={title:"DiscordBuilder — AI Discord Server Builder",description:"Build Discord servers with AI."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>}