# 🐳 Деплой через Docker и Portainer

## Быстрый старт

### 1. Подготовка файлов

Убедитесь, что у вас есть:
- `Dockerfile` - для сборки Next.js приложения
- `Dockerfile.bot` - для сборки Telegram бота
- `docker-compose.yml` - для локальной разработки
- `docker-compose.portainer.yml` - для деплоя через Portainer
- `.env` - файл с переменными окружения

### 2. Настройка переменных окружения

Создайте файл `.env` или используйте переменные в Portainer:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key

# Telegram Bot
TELEGRAM_BOT_TOKEN=ваш_токен_бота
WEB_APP_URL=https://ваш-домен.com/webapp
NEXT_PUBLIC_WEB_APP_URL=https://ваш-домен.com/webapp

# Payment Provider (опционально)
PAYMENT_PROVIDER_TOKEN=ваш_provider_token
```

### 3. Деплой через Portainer

#### Вариант A: Использование готовых образов

1. **Соберите образы локально:**
   ```bash
   docker build -t yoga-trainer-webapp:latest .
   docker build -f Dockerfile.bot -t yoga-trainer-bot:latest .
   ```

2. **Загрузите образы в реестр или используйте Portainer:**
   - В Portainer перейдите в **Images**
   - Загрузите образы или используйте **Build image from Dockerfile**

3. **Создайте Stack в Portainer:**
   - Перейдите в **Stacks** → **Add stack**
   - Вставьте содержимое `docker-compose.portainer.yml`
   - Настройте переменные окружения в разделе **Environment variables**

#### Вариант B: Сборка через Portainer

1. **Создайте Stack:**
   - Перейдите в **Stacks** → **Add stack**
   - Вставьте содержимое `docker-compose.yml`
   - Portainer автоматически соберет образы из Dockerfile

2. **Настройте переменные окружения (ОБЯЗАТЕЛЬНО!):**
   - В разделе **Environment variables** добавьте все переменные вручную:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `TELEGRAM_BOT_TOKEN`
     - `WEB_APP_URL`
     - `NEXT_PUBLIC_WEB_APP_URL`
     - `PAYMENT_PROVIDER_TOKEN` (опционально)
   - ⚠️ **Важно**: Файл `.env` не используется в Portainer, все переменные настраиваются через UI

3. **Запустите Stack:**
   - Нажмите **Deploy the stack**

### 4. Настройка сети

Убедитесь, что:
- Порты открыты: `3000` для Web App
- Если используете reverse proxy (Nginx/Traefik), настройте проксирование
- Web App доступен по HTTPS (обязательно для Telegram Web App)

### 5. Настройка Nginx (опционально)

Если используете Nginx как reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Проверка работы

1. **Проверьте Web App:**
   - Откройте `https://your-domain.com/webapp`
   - Должна открыться страница приложения

2. **Проверьте бота:**
   - Откройте бота в Telegram
   - Отправьте `/start`
   - Бот должен ответить

3. **Проверьте логи:**
   ```bash
   docker logs yoga-trainer-webapp
   docker logs yoga-trainer-bot
   ```

## Структура сервисов

### Web App (webapp)
- **Порт**: 3000
- **Healthcheck**: `http://localhost:3000`
- **Перезапуск**: автоматически при падении

### Telegram Bot (bot)
- **Зависит от**: webapp
- **Перезапуск**: автоматически при падении
- **Healthcheck**: проверка процесса Node.js

## Обновление

Для обновления приложения:

1. **Обновите код:**
   ```bash
   git pull origin main
   ```

2. **Пересоберите образы:**
   ```bash
   docker-compose build
   ```

3. **Перезапустите Stack в Portainer:**
   - Или используйте `docker-compose up -d --build`

## Troubleshooting

### Проблема: Web App не запускается
- Проверьте логи: `docker logs yoga-trainer-webapp`
- Убедитесь, что порт 3000 свободен
- Проверьте переменные окружения

### Проблема: Бот не работает
- Проверьте `TELEGRAM_BOT_TOKEN`
- Проверьте логи: `docker logs yoga-trainer-bot`
- Убедитесь, что `WEB_APP_URL` правильный

### Проблема: Ошибки подключения к Supabase
- Проверьте `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Убедитесь, что Supabase проект активен

## Безопасность

⚠️ **Важно:**
- Не коммитьте `.env` файл в Git
- Используйте секреты Portainer для хранения токенов
- Настройте firewall для ограничения доступа
- Используйте HTTPS для Web App

