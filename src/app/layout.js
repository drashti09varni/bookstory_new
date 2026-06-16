import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Aethera | Immersive Story Reader & Book Store",
  description: "Unlock a universe of rich, hand-crafted stories with our Access Pass. Try for ₹1 today to read science fiction, fantasy, and steampunk adventures in a customizable, distraction-free reader.",
  keywords: ["books", "stories", "reading app", "e-books", "scifi", "fantasy", "steampunk", "subscription"],
  authors: [{ name: "Aethera Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} suppressHydrationWarning>
        <AppProvider>
          <Navbar />
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {children}
          </main>
          <AuthModal />
        </AppProvider>
      </body>
    </html>
  );
}
