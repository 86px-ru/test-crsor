'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Testimonials() {
  return (
    <section id="testimonials" className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold tracking-tight">Отзывы</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {['Анна', 'Илья', 'Мария'].map((name, i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-center gap-3">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/120?img=${i + 1}`} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{name}</CardTitle>
                <CardDescription>Руководитель проекта</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Отличная коммуникация, быстрые сроки и продуманный UI. Рекомендуем!</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

