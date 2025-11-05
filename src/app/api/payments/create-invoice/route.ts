import { NextRequest, NextResponse } from 'next/server'
import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

dotenv.config()

const botToken = process.env.TELEGRAM_BOT_TOKEN

if (!botToken) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found')
}

const bot = botToken ? new TelegramBot(botToken, { polling: false }) : null

const PRICES = {
  monthly: {
    label: 'Месячная подписка',
    amount: 29900, // 299 рублей в копейках
    description: 'Доступ ко всем тренировкам на 1 месяц'
  },
  yearly: {
    label: 'Годовая подписка',
    amount: 299000, // 2990 рублей в копейках
    description: 'Доступ ко всем тренировкам на 1 год (экономия 30%)'
  },
  lifetime: {
    label: 'Пожизненная подписка',
    amount: 149900, // 1499 рублей в копейках
    description: 'Пожизненный доступ ко всем тренировкам'
  }
}

export async function POST(req: NextRequest) {
  try {
    const { telegramId, planType } = await req.json()

    if (!telegramId || !planType) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    if (!bot) {
      return NextResponse.json({ error: 'Bot not configured' }, { status: 500 })
    }

    const price = PRICES[planType as keyof typeof PRICES]
    if (!price) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    // Создаем инвойс в Telegram
    // Метод createInvoiceLink принимает параметры отдельно, а не объект
    const invoice = await bot.createInvoiceLink(
      price.label,
      price.description,
      JSON.stringify({
        telegram_id: telegramId,
        plan_type: planType
      }),
      process.env.PAYMENT_PROVIDER_TOKEN || '', // Для тестов можно оставить пустым
      'RUB',
      [{
        label: price.label,
        amount: price.amount
      }]
    )

    return NextResponse.json({ invoiceUrl: invoice })

  } catch (error) {
    console.error('Create invoice error:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}

