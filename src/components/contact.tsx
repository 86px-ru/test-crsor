'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function Contact() {
  return (
    <section id="contact" className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold tracking-tight">Свяжитесь со мной</h2>
      <p className="mt-2 text-muted-foreground">Опишите задачу — отвечу в течение дня.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Форма заявки</CardTitle>
            <CardDescription>Заполните поля ниже</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="name">Имя</label>
              <Input id="name" placeholder="Иван" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="you@email.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="msg">Сообщение</label>
              <Textarea id="msg" rows={4} placeholder="Кратко опишите проект" />
            </div>
            <Button className="w-full">Отправить</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Контакты</CardTitle>
            <CardDescription>Открыт к предложениям</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="font-medium">Email:</span> hello@example.com</p>
            <p><span className="font-medium">Telegram:</span> @yourhandle</p>
            <p><span className="font-medium">Город:</span> Москва / удалённо</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

