'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Services() {
  return (
    <section 
      id="services" 
      className="container mx-auto px-4 py-16 select-none"
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <h2 className="text-3xl font-semibold tracking-tight">Услуги</h2>
      <p className="mt-2 text-muted-foreground">Гибко подхожу к задачам — от идеи до релиза.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { title: 'Лендинги', desc: 'Конверсионные посадочные под рекламу и запуск.' },
          { title: 'Веб‑приложения', desc: 'React, TypeScript, UI/UX и производительность.' },
          { title: 'Интерфейсы', desc: 'Дашборды, админки, внутренние инструменты.' }
        ].map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Адаптивно • SEO • Анимации</li>
                <li>Интеграции и формы</li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

