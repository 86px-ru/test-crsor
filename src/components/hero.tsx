'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function Hero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Делаю современные сайты и интерфейсы</h1>
          <p className="mt-4 text-muted-foreground md:text-lg">Помогаю бизнесам запускать быстрые и красивый веб‑проекты: лендинги, дашборды, e‑commerce, внутренние системы.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="#contact">Обсудить проект</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#portfolio">Смотреть работы</Link>
            </Button>
          </div>
        </div>
        <Card className="order-first overflow-hidden md:order-none rounded-lg">
          <CardContent className="p-0">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-amber-200 via-orange-300 to-pink-400">
              {!imageError ? (
                <Image
                  src="/hero-image.png"
                  alt="Портфолио фрилансера"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() => setImageError(true)}
                />
              ) : null}
              {/* Fallback градиент если изображение не найдено */}
              <div className={`absolute inset-0 bg-gradient-to-br from-amber-200/90 via-orange-300/90 to-pink-400/90 flex items-center justify-center ${imageError ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                <div className="text-center p-8">
                  <p className="text-lg font-medium text-gray-700 mb-2">✨ Портфолио</p>
                  <p className="text-sm text-gray-600">Изображение не найдено</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

