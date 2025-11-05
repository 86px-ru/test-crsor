import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { createServerClient } from '../lib/supabase';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN не найден в .env файле!');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Функция проверки подписки
async function checkSubscription(telegramId: number): Promise<boolean> {
  try {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id, status, expires_at')
      .eq('telegram_id', telegramId)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return false;
    }

    // Проверяем срок действия подписки
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        // Подписка истекла, обновляем статус
        await supabase
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('id', data.id);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Subscription check error:', error);
    return false;
  }
}

// База данных йога поз
interface YogaPose {
  name: string;
  description: string;
  benefits: string[];
  duration: string;
  difficulty: 'Начинающий' | 'Средний' | 'Продвинутый';
}

const yogaPoses: { [key: string]: YogaPose } = {
  'поза-горы': {
    name: 'Тадасана (Поза Горы)',
    description: 'Базовая стоячая поза, основа всех асан',
    benefits: ['Улучшает осанку', 'Укрепляет ноги', 'Развивает равновесие', 'Успокаивает ум'],
    duration: '30-60 секунд',
    difficulty: 'Начинающий'
  },
  'поза-собаки': {
    name: 'Адхо Мукха Шванасана (Собака мордой вниз)',
    description: 'Классическая поза для растяжки всего тела',
    benefits: ['Растягивает заднюю поверхность ног', 'Укрепляет руки и плечи', 'Улучшает кровообращение', 'Снимает стресс'],
    duration: '30 секунд - 2 минуты',
    difficulty: 'Начинающий'
  },
  'поза-ребенка': {
    name: 'Баласана (Поза Ребенка)',
    description: 'Восстанавливающая поза для отдыха',
    benefits: ['Растягивает бедра и голени', 'Снимает напряжение в спине', 'Успокаивает нервную систему', 'Улучшает пищеварение'],
    duration: '1-3 минуты',
    difficulty: 'Начинающий'
  },
  'поза-воина': {
    name: 'Вирабхадрасана I (Поза Воина I)',
    description: 'Силовая поза для укрепления ног и корпуса',
    benefits: ['Укрепляет ноги', 'Растягивает бедра', 'Улучшает выносливость', 'Развивает концентрацию'],
    duration: '30 секунд - 1 минута на каждую сторону',
    difficulty: 'Средний'
  },
  'поза-дерева': {
    name: 'Врикшасана (Поза Дерева)',
    description: 'Поза равновесия стоя на одной ноге',
    benefits: ['Улучшает баланс', 'Укрепляет ноги', 'Растягивает бедра', 'Развивает концентрацию'],
    duration: '30 секунд - 1 минута на каждую сторону',
    difficulty: 'Средний'
  },
  'поза-кобры': {
    name: 'Бхуджангасана (Поза Кобры)',
    description: 'Прогиб назад для укрепления спины',
    benefits: ['Укрепляет мышцы спины', 'Растягивает переднюю часть тела', 'Улучшает осанку', 'Стимулирует органы брюшной полости'],
    duration: '15-30 секунд, 3-5 раз',
    difficulty: 'Начинающий'
  },
  'поза-кошки': {
    name: 'Марджариасана (Поза Кошка-Корова)',
    description: 'Динамичная поза для гибкости позвоночника',
    benefits: ['Улучшает гибкость позвоночника', 'Снимает напряжение в спине', 'Массажирует внутренние органы', 'Улучшает кровообращение'],
    duration: '10-15 повторений',
    difficulty: 'Начинающий'
  },
  'поза-лотоса': {
    name: 'Падмасана (Поза Лотоса)',
    description: 'Классическая медитативная поза',
    benefits: ['Улучшает осанку', 'Успокаивает ум', 'Растягивает бедра', 'Подходит для медитации'],
    duration: '5-30 минут',
    difficulty: 'Продвинутый'
  }
};

// Программы тренировок
const routines = {
  'утренняя': {
    name: 'Утренняя разминка',
    description: 'Легкая программа для пробуждения',
    poses: [
      { pose: 'поза-горы', duration: 30 },
      { pose: 'поза-кошки', duration: 60 },
      { pose: 'поза-собаки', duration: 45 },
      { pose: 'поза-ребенка', duration: 60 },
      { pose: 'поза-горы', duration: 30 }
    ],
    totalTime: '5-7 минут'
  },
  'вечерняя': {
    name: 'Вечерняя релаксация',
    description: 'Успокаивающая программа перед сном',
    poses: [
      { pose: 'поза-ребенка', duration: 90 },
      { pose: 'поза-кошки', duration: 60 },
      { pose: 'поза-собаки', duration: 45 },
      { pose: 'поза-ребенка', duration: 120 }
    ],
    totalTime: '7-10 минут'
  },
  'для-начинающих': {
    name: 'Программа для начинающих',
    description: 'Базовые позы для новичков',
    poses: [
      { pose: 'поза-горы', duration: 30 },
      { pose: 'поза-кошки', duration: 60 },
      { pose: 'поза-собаки', duration: 45 },
      { pose: 'поза-ребенка', duration: 60 },
      { pose: 'поза-кобры', duration: 30 },
      { pose: 'поза-ребенка', duration: 60 }
    ],
    totalTime: '8-10 минут'
  },
  'силовая': {
    name: 'Силовая тренировка',
    description: 'Укрепляющая программа',
    poses: [
      { pose: 'поза-горы', duration: 30 },
      { pose: 'поза-собаки', duration: 45 },
      { pose: 'поза-воина', duration: 60 },
      { pose: 'поза-дерева', duration: 45 },
      { pose: 'поза-собаки', duration: 45 },
      { pose: 'поза-ребенка', duration: 60 }
    ],
    totalTime: '10-12 минут'
  }
};

// URL для Web App (замените на ваш домен в продакшене)
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://your-domain.com/webapp';

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🧘 *Добро пожаловать в Йога Бот!*

Я ваш персональный тренер по йоге. Я помогу вам:
• Изучить йога позы
• Выполнить тренировочные программы
• Использовать таймер для медитации
• Получить советы по практике

*Доступные команды:*
/help - Показать все команды
/poses - Список всех поз
/routines - Программы тренировок
/timer - Таймер для медитации
/pose <название> - Информация о позе
/routine <название> - Начать программу

Начните с команды /help для получения подробной информации!
  `;
  
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Открыть Web App',
          web_app: { url: WEB_APP_URL }
        }
      ]
    ]
  };
  
  bot.sendMessage(chatId, welcomeMessage, { 
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
📖 *Доступные команды:*

/start - Начать работу с ботом
/help - Показать эту справку
/poses - Список всех доступных поз
/routines - Список программ тренировок
/timer <секунды> - Запустить таймер медитации
/pose <название> - Получить информацию о позе
/routine <название> - Начать программу тренировки

*Примеры:*
/pose поза-собаки
/routine утренняя
/timer 300

*Доступные программы:*
• утренняя - Утренняя разминка
• вечерняя - Вечерняя релаксация
• для-начинающих - Программа для новичков
• силовая - Силовая тренировка

💡 *Совет:* Используйте кнопку "Открыть Web App" для удобного интерфейса!
  `;
  
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Открыть Web App',
          web_app: { url: WEB_APP_URL }
        }
      ]
    ]
  };
  
  bot.sendMessage(chatId, helpMessage, { 
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Команда /poses - список всех поз
bot.onText(/\/poses/, (msg) => {
  const chatId = msg.chat.id;
  let posesList = '🧘 *Доступные йога позы:*\n\n';
  
  Object.keys(yogaPoses).forEach((key, index) => {
    const pose = yogaPoses[key];
    posesList += `${index + 1}. *${pose.name}*\n`;
    posesList += `   Уровень: ${pose.difficulty}\n`;
    posesList += `   Используйте: /pose ${key}\n\n`;
  });
  
  bot.sendMessage(chatId, posesList, { parse_mode: 'Markdown' });
});

// Команда /pose <название>
bot.onText(/\/pose (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  if (!match || !match[1]) {
    bot.sendMessage(chatId, '❌ Пожалуйста, укажите название позы. Например: /pose поза-собаки');
    return;
  }
  
  const poseKey = match[1].toLowerCase().trim();
  const pose = yogaPoses[poseKey];
  
  if (!pose) {
    bot.sendMessage(chatId, `❌ Поза "${match[1]}" не найдена. Используйте /poses для списка всех поз.`);
    return;
  }
  
  let message = `🧘 *${pose.name}*\n\n`;
  message += `📝 ${pose.description}\n\n`;
  message += `⏱ Продолжительность: ${pose.duration}\n`;
  message += `📊 Уровень сложности: ${pose.difficulty}\n\n`;
  message += `✨ *Польза:*\n`;
  pose.benefits.forEach(benefit => {
    message += `• ${benefit}\n`;
  });
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// Команда /routines - список программ
bot.onText(/\/routines/, (msg) => {
  const chatId = msg.chat.id;
  let routinesList = '📋 *Программы тренировок:*\n\n';
  
  Object.keys(routines).forEach((key, index) => {
    const routine = routines[key as keyof typeof routines];
    routinesList += `${index + 1}. *${routine.name}*\n`;
    routinesList += `   ${routine.description}\n`;
    routinesList += `   Время: ${routine.totalTime}\n`;
    routinesList += `   Используйте: /routine ${key}\n\n`;
  });
  
  bot.sendMessage(chatId, routinesList, { parse_mode: 'Markdown' });
});

// Команда /routine <название>
bot.onText(/\/routine (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from?.id;

  if (!telegramId) {
    return bot.sendMessage(chatId, '❌ Не удалось определить пользователя');
  }

  if (!match || !match[1]) {
    bot.sendMessage(chatId, '❌ Пожалуйста, укажите название программы. Например: /routine утренняя');
    return;
  }
  
  const routineKey = match[1].toLowerCase().trim();
  const routine = routines[routineKey as keyof typeof routines];
  
  if (!routine) {
    bot.sendMessage(chatId, `❌ Программа "${match[1]}" не найдена. Используйте /routines для списка всех программ.`);
    return;
  }

  // Проверяем подписку
  const hasAccess = await checkSubscription(telegramId);

  if (!hasAccess) {
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '💎 Оформить подписку',
            web_app: { url: `${WEB_APP_URL}/subscribe` }
          }
        ]
      ]
    };

    return bot.sendMessage(
      chatId,
      '🔒 *Для доступа к программам тренировок требуется подписка.*\n\n' +
      '✨ *Подписка дает доступ:*\n' +
      '• Ко всем программам тренировок\n' +
      '• К расширенным функциям\n' +
      '• К персональной статистике\n\n' +
      'Нажмите кнопку ниже, чтобы оформить подписку.',
      { 
        parse_mode: 'Markdown',
        reply_markup: keyboard 
      }
    );
  }
  
  let message = `🏃 *${routine.name}*\n\n`;
  message += `📝 ${routine.description}\n`;
  message += `⏱ Общее время: ${routine.totalTime}\n\n`;
  message += `*Начинаем через 3 секунды...*\n`;
  message += `Подготовьте коврик и начните в удобной позе.\n\n`;
  
  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  
  // Ожидание 3 секунды
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Отправка каждой позы с задержкой
  for (let i = 0; i < routine.poses.length; i++) {
    const { pose, duration } = routine.poses[i];
    const poseInfo = yogaPoses[pose];
    
    if (poseInfo) {
      let poseMessage = `\n${i + 1}/${routine.poses.length} *${poseInfo.name}*\n\n`;
      poseMessage += `⏱ Держите позу ${duration} секунд\n`;
      poseMessage += `📝 ${poseInfo.description}\n\n`;
      
      if (duration > 30) {
        poseMessage += `💡 *Совет:* Сделайте глубокий вдох и выдох. Дышите спокойно.\n`;
      }
      
      await bot.sendMessage(chatId, poseMessage, { parse_mode: 'Markdown' });
      
      // Отсчет времени для позы
      if (duration > 10) {
        let remainingTime = duration;
        
        // Отправляем уведомления каждые 10 секунд, но не чаще
        while (remainingTime > 10) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          remainingTime -= 10;
          
          if (remainingTime <= 10) {
            await bot.sendMessage(chatId, `⏰ Осталось 10 секунд...`);
          } else if (remainingTime <= duration / 2) {
            await bot.sendMessage(chatId, `⏰ Осталось ${remainingTime} секунд`);
          }
        }
        
        // Ожидаем оставшиеся секунды
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime * 1000));
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, duration * 1000));
      }
    }
  }
  
  const finishMessage = `\n🎉 *Программа завершена!*\n\n`;
  const finishMessageEnd = `Отлично выполненная работа! 🧘\n\n`;
  const finishMessageEnd2 = `Не забудьте сделать Шавасану (позу отдыха) на 2-3 минуты.\n\n`;
  const finishMessageEnd3 = `Используйте /routines для выбора другой программы.`;
  
  await bot.sendMessage(chatId, finishMessage + finishMessageEnd + finishMessageEnd2 + finishMessageEnd3, { parse_mode: 'Markdown' });
});

// Команда /timer <секунды>
bot.onText(/\/timer(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  let seconds = 300; // По умолчанию 5 минут
  
  if (match && match[1]) {
    const parsed = parseInt(match[1]);
    if (!isNaN(parsed) && parsed > 0) {
      seconds = parsed;
    } else {
      bot.sendMessage(chatId, '❌ Пожалуйста, укажите количество секунд. Например: /timer 300');
      return;
    }
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  let message = `🧘 *Таймер медитации*\n\n`;
  message += `⏱ Время: ${minutes} мин ${remainingSeconds} сек\n\n`;
  message += `Начинаем через 3 секунды...\n`;
  message += `Примите удобную позу, закройте глаза и начните дышать глубоко.`;
  
  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  
  // Ожидание 3 секунды
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Отсчет с уведомлениями
  let remaining = seconds;
  const intervals = [300, 180, 120, 60, 30, 15, 10, 5, 3, 2, 1];
  
  for (const interval of intervals) {
    if (remaining > interval) {
      await new Promise(resolve => setTimeout(resolve, (remaining - interval) * 1000));
      remaining = interval;
      
      if (interval >= 60) {
        const mins = Math.floor(interval / 60);
        await bot.sendMessage(chatId, `⏰ Осталось ${mins} мин`);
      } else if (interval > 10) {
        await bot.sendMessage(chatId, `⏰ Осталось ${interval} секунд`);
      } else if (interval > 1) {
        await bot.sendMessage(chatId, `⏰ ${interval}...`);
      }
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const finishMessage = `\n🔔 *Медитация завершена!*\n\n`;
  const finishMessageEnd = `Медленно откройте глаза и вернитесь в настоящий момент.\n\n`;
  const finishMessageEnd2 = `Используйте /timer <секунды> для новой медитации.`;
  
  await bot.sendMessage(chatId, finishMessage + finishMessageEnd + finishMessageEnd2, { parse_mode: 'Markdown' });
});

// Обработка предварительной проверки платежа
bot.on('pre_checkout_query', async (query) => {
  // Подтверждаем платеж (в продакшене здесь можно добавить дополнительную проверку)
  await bot.answerPreCheckoutQuery(query.id, true);
});

// Обработка успешного платежа
bot.on('successful_payment', async (msg) => {
  const chatId = msg.chat.id;
  const payment = msg.successful_payment;
  
  if (!payment) return;

  try {
    let payload;
    try {
      payload = JSON.parse(payment.invoice_payload);
    } catch (e) {
      console.error('Failed to parse invoice payload:', e);
      return;
    }

    const telegramId = payload.telegram_id;
    const planType = payload.plan_type;

    if (!telegramId || !planType) {
      return;
    }

    // Рассчитываем дату окончания подписки
    let expiresAt: Date | null = null;
    if (planType === 'monthly') {
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (planType === 'yearly') {
      expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    // lifetime - expiresAt остается null

    const supabase = createServerClient();

    // Находим или создаем пользователя
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', telegramId)
      .single();

    let userId = user?.id;

    if (!userId) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          telegram_id: telegramId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      userId = newUser?.id;
    }

    // Отменяем старые активные подписки
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('telegram_id', telegramId)
      .eq('status', 'active');

    // Создаем новую подписку
    await supabase
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
      });

    await bot.sendMessage(
      chatId,
      '✅ *Платеж успешно выполнен! Подписка активирована.*\n\n' +
      'Теперь у вас есть доступ ко всем программам тренировок! 🎉\n\n' +
      'Используйте /routines для начала тренировки.',
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Payment processing error:', error);
    await bot.sendMessage(
      chatId,
      '⚠️ Произошла ошибка при активации подписки. Пожалуйста, обратитесь в поддержку.'
    );
  }
});

// Обработка неизвестных команд
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Игнорируем команды, которые уже обработаны
  if (text && text.startsWith('/')) {
    const command = text.split(' ')[0];
    const knownCommands = ['/start', '/help', '/poses', '/pose', '/routines', '/routine', '/timer'];
    
    if (!knownCommands.some(cmd => text.startsWith(cmd))) {
      bot.sendMessage(chatId, `❓ Неизвестная команда. Используйте /help для списка доступных команд.`);
    }
  }
});

console.log('🤖 Йога бот запущен и готов к работе!');
console.log('📱 Ожидаю сообщений...');

