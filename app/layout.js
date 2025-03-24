"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store, { persistor } from "@/store/store";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "next-themes";
import AuthGuard from "@/components/Auth/AuthGuard";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <AuthGuard>
                {children}
              </AuthGuard>
            </ThemeProvider>
          </PersistGate>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
