# ⚡ Быстрое решение: "Unable to deploy stack"

## Шаг 1: Используйте минимальную конфигурацию

Скопируйте это содержимое в Portainer → Stacks → ваш stack → Editor:

```yaml
version: '3.8'

services:
  webapp:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: yoga-trainer-webapp
    restart: unless-stopped
    ports:
      - "3080:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NEXT_PUBLIC_WEB_APP_URL=${NEXT_PUBLIC_WEB_APP_URL}
      - WEB_APP_URL=${WEB_APP_URL}
    networks:
      - yoga-network

networks:
  yoga-network:
    driver: bridge
```

## Шаг 2: Убедитесь, что все переменные добавлены

В Portainer → Environment variables добавьте **ТОЧНО** эти переменные:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_WEB_APP_URL
WEB_APP_URL
```

**Важно:**
- Не добавляйте `PORT` - порт жестко задан как 3080
- Убедитесь, что значения начинаются с `http://` или `https://`
- Нет лишних пробелов в начале или конце значений

## Шаг 3: Удалите старые контейнеры

**В Portainer:**
1. Containers → найдите `yoga-trainer-webapp` → Remove
2. Containers → найдите `yoga-trainer-bot` → Remove (если есть)

**Или через терминал (если есть доступ):**
```bash
docker rm -f yoga-trainer-webapp yoga-trainer-bot 2>/dev/null || true
```

## Шаг 4: Проверьте синтаксис

1. Скопируйте ваш docker-compose из Portainer
2. Проверьте через https://www.yamllint.com/
3. Убедитесь, что:
   - Используются 2 пробела для отступов (не табуляция)
   - Нет лишних символов
   - Все кавычки закрыты

## Шаг 5: Попробуйте деплой

1. Portainer → Stacks → ваш stack → Editor
2. Вставьте минимальную конфигурацию выше
3. Проверьте Environment variables
4. Нажмите **Update the stack**

## Шаг 6: Проверьте логи

Если деплой не удался:
1. Portainer → Stacks → ваш stack → Logs
2. Скопируйте **ВСЕ** ошибки
3. Обратите внимание на:
   - Ошибки сборки (build errors)
   - Ошибки переменных окружения
   - Ошибки сети или портов

## Частые проблемы

### Проблема: "variable is not set"
**Решение:** Убедитесь, что переменная добавлена в Environment variables

### Проблема: "invalid port specification"
**Решение:** Используйте формат `"3080:3000"` (с кавычками)

### Проблема: "network not found"
**Решение:** Сеть создастся автоматически, но если ошибка - удалите старую:
```bash
docker network rm yoga-network 2>/dev/null || true
```

### Проблема: "build failed"
**Решение:** 
1. Проверьте, что `Dockerfile` существует
2. Проверьте логи сборки в Portainer
3. Убедитесь, что есть доступ к интернету для загрузки зависимостей

## Если ничего не помогает

1. **Полностью удалите Stack:**
   - Portainer → Stacks → ваш stack → Remove the stack
   
2. **Создайте новый Stack:**
   - Portainer → Stacks → Add stack
   - Название: `yoga-trainer`
   - Вставьте минимальную конфигурацию выше
   - Добавьте Environment variables
   - Deploy the stack

3. **Проверьте через Docker напрямую (если есть SSH):**
   ```bash
   cd /path/to/project
   docker-compose -f docker-compose.minimal.yml up -d --build
   docker-compose -f docker-compose.minimal.yml logs -f
   ```

