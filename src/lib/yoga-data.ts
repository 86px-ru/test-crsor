// Общие данные для бота и веб-приложения
export interface YogaPose {
  name: string;
  description: string;
  benefits: string[];
  duration: string;
  difficulty: 'Начинающий' | 'Средний' | 'Продвинутый';
}

export interface RoutinePose {
  pose: string;
  duration: number;
}

export interface Routine {
  name: string;
  description: string;
  poses: RoutinePose[];
  totalTime: string;
}

export const yogaPoses: { [key: string]: YogaPose } = {
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
   'поза-собаки 2': {
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

export const routines: { [key: string]: Routine } = {
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

export function getPoseKey(poseName: string): string | null {
  for (const [key, pose] of Object.entries(yogaPoses)) {
    if (pose.name === poseName || key === poseName) {
      return key;
    }
  }
  return null;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Начинающий':
      return 'bg-green-100 text-green-800';
    case 'Средний':
      return 'bg-yellow-100 text-yellow-800';
    case 'Продвинутый':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}





