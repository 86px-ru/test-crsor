'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Portfolio() {
  return (
    <section id="portfolio" className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold tracking-tight">Портфолио</h2>
      <Tabs defaultValue="sites" className="mt-6">
        <TabsList>
          <TabsTrigger value="sites">Сайты</TabsTrigger>
          <TabsTrigger value="apps">Приложения</TabsTrigger>
        </TabsList>
        <TabsContent value="sites" className="mt-6 grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Лендинг #{i + 1}</CardTitle>
                <CardDescription>Конверсия +32%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-md bg-muted" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="apps" className="mt-6 grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Приложение #{i + 1}</CardTitle>
                <CardDescription>Скорость загрузки 98/100</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-md bg-muted" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  )
}

