import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AgendaProvider } from "./_components/AgendaProvider";
import { AlertsProvider } from "./_components/AlertsProvider";
import { AuthProvider } from "./_components/AuthProvider";
import CommandPalette from "./_components/CommandPalette";
import { ComparatorProvider } from "./_components/ComparatorProvider";
import { FavoritesProvider } from "./_components/FavoritesProvider";
import { LeadsProvider } from "./_components/LeadsProvider";
import { NotesProvider } from "./_components/NotesProvider";
import { PropertyProvider } from "./_components/PropertyProvider";
import { ReviewsProvider } from "./_components/ReviewsProvider";
import { ThemeProvider } from "./_components/ThemeProvider";
import { ToastProvider } from "./_components/ToastProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M2Prop · Fichas inmobiliarias con tu marca",
  description:
    "Fichas web con tu marca, listas para WhatsApp e Instagram. Importá de ZonaProp o MercadoLibre en minutos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="bg-[var(--m2-bg)] text-[var(--m2-ink)] antialiased">
        <ThemeProvider>
          <AuthProvider>
            <PropertyProvider>
              <ReviewsProvider>
                <FavoritesProvider>
                  <ComparatorProvider>
                    <LeadsProvider>
                      <AlertsProvider>
                        <NotesProvider>
                          <AgendaProvider>
                            <ToastProvider>
                              {children}
                              <CommandPalette />
                            </ToastProvider>
                          </AgendaProvider>
                        </NotesProvider>
                      </AlertsProvider>
                    </LeadsProvider>
                  </ComparatorProvider>
                </FavoritesProvider>
              </ReviewsProvider>
            </PropertyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
