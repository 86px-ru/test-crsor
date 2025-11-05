# Настройка системы подписок

## 1. Создание базы данных в Supabase

1. Зайдите на [supabase.com](https://supabase.com) и создайте проект
2. Откройте SQL Editor в вашем проекте
3. Скопируйте и выполните SQL из файла `supabase-schema.sql`

## 2. Настройка переменных окружения

Добавьте в файл `.env` следующие переменные:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=ваш_токен_бота
WEB_APP_URL=https://ваш-домен.com/webapp
NEXT_PUBLIC_WEB_APP_URL=https://ваш-домен.com/webapp

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key

# Опционально: Payment Provider Token (для реальных платежей)
PAYMENT_PROVIDER_TOKEN=ваш_provider_token
```

## 3. Получение ключей Supabase

1. В проекте Supabase откройте **Settings** → **API**
2. Скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Настройка Telegram Payments

### Для тестирования:
- Можно использовать тестовый режим без `PAYMENT_PROVIDER_TOKEN`
- Telegram автоматически предложит тестовый платеж

### Для продакшена:
1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Настройте платежи через BotFather:
   - `/mybots` → Выберите вашего бота
   - Payments → Настройте платежного провайдера
3. Получите `PAYMENT_PROVIDER_TOKEN` от вашего платежного провайдера
4. Добавьте его в `.env`

## 5. Webhook для платежей (опционально)

Если хотите обрабатывать платежи через webhook:

1. В проекте Supabase создайте Edge Function или используйте API route
2. Настройте webhook URL в настройках платежного провайдера:
   ```
   https://ваш-домен.com/api/payments/webhook
   ```

## 6. Проверка работы

1. Запустите бота:
   ```bash
   npm run bot
   ```

2. Запустите Next.js приложение:
   ```bash
   npm run dev
   ```

3. Откройте бота в Telegram и попробуйте:
   - `/routine утренняя` - должна появиться проверка подписки
   - Откройте Web App и перейдите в раздел "Программы"
   - Попробуйте оформить подписку

## 7. Структура подписок

### Типы подписок:
- **monthly** - Месячная подписка (299 ₽)
- **yearly** - Годовая подписка (2990 ₽, экономия 30%)
- **lifetime** - Пожизненная подписка (1499 ₽)

### Статусы подписок:
- **active** - Активная подписка
- **expired** - Истекшая подписка
- **cancelled** - Отмененная подписка

## 8. Полезные SQL запросы

### Проверить активные подписки:
```sql
SELECT * FROM subscriptions 
WHERE status = 'active' 
  AND (expires_at IS NULL OR expires_at > NOW());
```

### Найти пользователя по telegram_id:
```sql
SELECT * FROM users WHERE telegram_id = 123456789;
```

### Проверить подписку пользователя:
```sql
SELECT * FROM subscriptions 
WHERE telegram_id = 123456789 
  AND status = 'active';
```

### Обновить истекшие подписки:
```sql
SELECT check_expired_subscriptions();
```

## 9. Troubleshooting

### Проблема: Подписка не проверяется
- Убедитесь, что SQL схема выполнена полностью
- Проверьте, что переменные окружения установлены правильно
- Проверьте логи бота и Next.js приложения

### Проблема: Платежи не обрабатываются
- Убедитесь, что webhook настроен правильно
- Проверьте, что `PAYMENT_PROVIDER_TOKEN` установлен (для реальных платежей)
- Для тестирования можно использовать тестовый режим Telegram

### Проблема: RLS блокирует запросы
- Если включили RLS, создайте соответствующие политики
- Или временно отключите RLS для тестирования:
  ```sql
  ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
  ```



