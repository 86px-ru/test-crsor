'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function SubscribePageContent() {
  const [loading, setLoading] = useState(false)
  const [telegramId, setTelegramId] = useState<number | null>(null)
  const [WebApp, setWebApp] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    import('@twa-dev/sdk').then((module) => {
      const webApp = module.default
      setWebApp(webApp)
      webApp.ready()
      webApp.expand()
      
      const user = webApp.initDataUnsafe?.user
      if (user) {
        setTelegramId(user.id)
      }
    }).catch(() => {
      console.warn('Telegram WebApp SDK не загружен')
    })
  }, [])

  const handleSubscribe = async (planType: 'monthly' | 'yearly' | 'lifetime') => {
    if (!telegramId) {
      alert('Ошибка: не удалось определить пользователя')
      return
    }

    setLoading(true)

    try {
      // Получаем ссылку на платеж
      const response = await fetch('/api/payments/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId,
          planType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create invoice')
      }

      const { invoiceUrl } = await response.json()

      if (!invoiceUrl) {
        throw new Error('No invoice URL received')
      }

      if (!WebApp) {
        throw new Error('WebApp not initialized')
      }

      // Открываем платежную форму Telegram
      WebApp.openInvoice(invoiceUrl, (status: string) => {
        setLoading(false)
        if (status === 'paid') {
          alert('✅ Подписка активирована!')
          // Перенаправляем на главную страницу
          setTimeout(() => {
            window.location.href = '/webapp'
          }, 1000)
        } else if (status === 'failed') {
          alert('❌ Ошибка при оплате. Попробуйте еще раз.')
        }
      })

    } catch (error) {
      console.error('Subscription error:', error)
      alert('Ошибка при оформлении подписки. Попробуйте еще раз.')
      setLoading(false)
    }
  }

  const plans = [
    {
      type: 'monthly' as const,
      name: 'Месячная',
      price: '299 ₽',
      period: 'в месяц',
      features: ['Доступ ко всем тренировкам', 'Безлимитное использование', 'Новые программы']
    },
    {
      type: 'yearly' as const,
      name: 'Годовая',
      price: '2990 ₽',
      period: 'в год',
      discount: 'Экономия 30%',
      popular: true,
      features: ['Доступ ко всем тренировкам', 'Безлимитное использование', 'Новые программы', 'Лучшее предложение']
    },
    {
      type: 'lifetime' as const,
      name: 'Пожизненная',
      price: '1499 ₽',
      period: 'одноразово',
      features: ['Пожизненный доступ', 'Все будущие обновления', 'Приоритетная поддержка']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4 relative" suppressHydrationWarning>
      <div className="max-w-md mx-auto relative z-10">
        <div className="mb-4">
          <Button
            onClick={() => {
              if (WebApp) {
                WebApp.openLink('/webapp')
              } else {
                window.location.href = '/webapp'
              }
            }}
            variant="ghost"
            className="text-gray-700 hover:text-white hover:bg-indigo-600"
          >
            ← Назад
          </Button>
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">💎 Подписка</h1>
          <p className="text-gray-700">Выберите подходящий план</p>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <Card
              key={plan.type}
              className={plan.popular ? 'border-2 border-indigo-500 bg-white' : 'bg-white'}
              suppressHydrationWarning
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-gray-900">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-700">{plan.period}</CardDescription>
                  </div>
                  {plan.popular && (
                    <Badge className="bg-indigo-600 text-white">Популярно</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.discount && (
                    <span className="ml-2 text-sm text-green-600 font-semibold">{plan.discount}</span>
                  )}
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-800">
                      <span className="mr-2 text-green-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.type)}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {loading ? 'Обработка...' : 'Оформить подписку'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💳 Оплата безопасна через Telegram</p>
          <p className="mt-2">После оплаты подписка активируется автоматически</p>
        </div>
      </div>
    </div>
  )
}



