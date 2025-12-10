// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f6f0' },
    { media: '(prefers-color-scheme: dark)', color: '#401268' }
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://geekcreations.com'),
  title: {
    default: 'Geeks Creation - Nigerian Geek Culture Store | Anime, Tech & Afro-Geek Merch',
    template: '%s | Geeks Creation'
  },
  description: 'Premium Nigerian print-on-demand store for nerds, artists & dreamers. Shop exclusive anime, tech, and Afro-geek designs on T-shirts, hoodies, mugs & more. Pay with crypto (USDC/SOL) or Naira.',
  keywords: [
    'Nigerian geek store',
    'anime merchandise Nigeria',
    'tech clothing Lagos',
    'Afro-geek fashion',
    'print on demand Nigeria',
    'custom T-shirts Lagos',
    'crypto payment store',
    'USDC payment Nigeria',
    'Solana payment',
    'geek culture Africa'
  ],
  authors: [{ name: 'Geeks Creation', url: 'https://geekcreations.com' }],
  creator: 'CodeOven Technologies',
  publisher: 'Geeks Creation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://geekcreations.com',
    siteName: 'Geeks Creation',
    title: 'Geeks Creation - Nigerian Geek Culture Store',
    description: 'Where Nigerian nerds, artists & dreamers turn wild ideas into wearable legends. Shop anime, tech & Afro-geek designs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Geeks Creation - Nigerian Geek Store',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geeks Creation - Nigerian Geek Culture Store',
    description: 'Premium anime, tech & Afro-geek merch. Pay with crypto or Naira. Made in Nigeria.',
    images: ['/twitter-image.png'],
    creator: '@geekcreations',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  alternates: {
    canonical: 'https://geekcreations.com',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data (JSON-LD) */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'Geeks Creation',
              description: 'Premium Nigerian print-on-demand store for geek culture',
              url: 'https://geekcreations.com',
              logo: 'https://geekcreations.com/logo.png',
              image: 'https://geekcreations.com/og-image.png',
              priceRange: '₦5,000 - ₦50,000',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'NG',
                addressLocality: 'Lagos',
              },
              paymentAccepted: ['Cash', 'Credit Card', 'Cryptocurrency'],
              currenciesAccepted: 'NGN, USDC, SOL',
              openingHours: 'Mo-Su 00:00-23:59',
              telephone: '+234-XXX-XXX-XXXX',
              email: 'hello@geekcreations.com',
              sameAs: [
                'https://instagram.com/geekcreations',
                'https://twitter.com/geekcreations',
              ],
            }),
          }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_FACEBOOK_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}