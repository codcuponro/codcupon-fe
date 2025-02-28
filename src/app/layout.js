import Header from "@/components/header";
import "./globals.css";
import { Inter } from 'next/font/google'
import Footer from "@/components/footer";

// Slider imports 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Codcupon",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <NextTopLoader />
        <ToastProvider>
          <Header />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
