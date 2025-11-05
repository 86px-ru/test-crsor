import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()

    // Проверяем, что это pre_checkout_query (подтверждение перед оплатой)
    if (update.pre_checkout_query) {
      // Подтверждаем платеж (в продакшене здесь можно добавить дополнительную проверку)
      return NextResponse.json({
        ok: true,
        error_message: ''
      })
    }

    // Обрабатываем успешный платеж
    if (update.message?.successful_payment) {
      const payment = update.message.successful_payment
      let payload

      try {
        payload = JSON.parse(payment.invoice_payload)
      } catch (e) {
        console.error('Failed to parse invoice payload:', e)
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
      }

      const telegramId = payload.telegram_id
      const planType = payload.plan_type

      if (!telegramId || !planType) {
        return NextResponse.json({ error: 'Missing payload data' }, { status: 400 })
      }

      // Рассчитываем дату окончания подписки
      let expiresAt: Date | null = null
      if (planType === 'monthly') {
        expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      } else if (planType === 'yearly') {
        expiresAt = new Date()
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      }
      // lifetime - expiresAt остается null

      const supabase = createServerClient()

      // Сначала находим или создаем пользователя
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', telegramId)
        .single()

      let userId = user?.id

      if (!userId) {
        // Создаем пользователя если его нет
        const { data: newUser } = await supabase
          .from('users')
          .insert({
            telegram_id: telegramId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single()

        userId = newUser?.id
      }

      // Отменяем старые активные подписки (если есть)
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('telegram_id', telegramId)
        .eq('status', 'active')

      // Создаем новую подписку
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          telegram_id: telegramId,
          plan_type: planType,
          status: 'active',
          expires_at: expiresAt?.toISOString() || null,
          payment_provider: 'telegram',
          payment_id: payment.telegram_payment_charge_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Subscription creation error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, subscription })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}



