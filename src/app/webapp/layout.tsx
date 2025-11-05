import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import DelicateAsciiDots from '@/components/ui/delicate-ascii-dots'

export const metadata: Metadata = {
  title: 'Йога Тренер - Web App',
  description: 'Ваш персональный тренер по йоге',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}

export default function WebAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="lazyOnload" />
      </head>
      <body className="m-0 p-0 relative" suppressHydrationWarning>
        <div className="fixed inset-0 z-0 w-full h-full">
          <DelicateAsciiDots
            backgroundColor="transparent"
            textColor="129, 140, 248"
            density={1.0}
            animationSpeed={0.75}
            removeWaveLine={true}
          />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}

