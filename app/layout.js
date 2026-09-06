import "./globals.css";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import { AuthProvider } from './provider';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Sunita Gemstones | Certified Astrological Gemstones & Jewellery",
  description: "Shop natural, lab-certified astrological gemstones & handcrafted jewellery. Vedic navratna stones energised before dispatch. Free astrologer consultation. Ships from Jaipur.",
  openGraph: {
    title: "Sunita Gemstones | Certified Astrological Gemstones & Jewellery",
    description: "Natural, lab-certified Vedic navratna gemstones. Personalised astrological consultation & handcrafted jewellery from Johari Bazaar, Jaipur.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunita Gemstones | Certified Astrological Gemstones & Jewellery",
    description: "Natural, lab-certified Vedic navratna gemstones. Free astrologer consultation.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "name": "Sunita Gemstones",
  "description": "Certified astrological gemstones and handcrafted jewellery from Johari Bazaar, Jaipur.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Johari Bazaar",
    "addressLocality": "Jaipur",
    "addressRegion": "Rajasthan",
    "postalCode": "302003",
    "addressCountry": "IN"
  },
  "telephone": "+91-141-0000000",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2566"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts — Cormorant Garamond (display) + Jost (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Header />
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
            theme="light"
            newestOnTop={false}
          />
          {children}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
