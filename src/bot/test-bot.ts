// Тестовый файл для проверки логики бота
import dotenv from 'dotenv';

dotenv.config();

// Импортируем типы и данные
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
  }
};

const routines = {
  'утренняя': {
    name: 'Утренняя разминка',
    description: 'Легкая программа для пробуждения',
    poses: [
      { pose: 'поза-горы', duration: 30 },
      { pose: 'поза-кошки', duration: 60 }
    ],
    totalTime: '5-7 минут'
  }
};

// Тесты логики
function testPoseLookup() {
  console.log('🧪 Тест 1: Поиск позы');
  const poseKey = 'поза-горы';
  const pose = yogaPoses[poseKey];
  
  if (!pose) {
    console.error('❌ Поза не найдена');
    return false;
  }
  
  if (pose.name !== 'Тадасана (Поза Горы)') {
    console.error('❌ Неверное название позы');
    return false;
  }
  
  console.log('✅ Поиск позы работает корректно');
  return true;
}

function testPoseNotFound() {
  console.log('🧪 Тест 2: Поиск несуществующей позы');
  const poseKey = 'несуществующая-поза';
  const pose = yogaPoses[poseKey];
  
  if (pose) {
    console.error('❌ Найдена несуществующая поза');
    return false;
  }
  
  console.log('✅ Обработка несуществующей позы работает корректно');
  return true;
}

function testRoutineLookup() {
  console.log('🧪 Тест 3: Поиск программы');
  const routineKey = 'утренняя';
  const routine = routines[routineKey as keyof typeof routines];
  
  if (!routine) {
    console.error('❌ Программа не найдена');
    return false;
  }
  
  if (routine.poses.length === 0) {
    console.error('❌ Программа не содержит поз');
    return false;
  }
  
  console.log('✅ Поиск программы работает корректно');
  return true;
}

function testPoseInRoutine() {
  console.log('🧪 Тест 4: Проверка поз в программе');
  const routine = routines['утренняя'];
  
  for (const { pose } of routine.poses) {
    if (!yogaPoses[pose]) {
      console.error(`❌ Поза "${pose}" из программы не найдена в базе данных`);
      return false;
    }
  }
  
  console.log('✅ Все позы в программе существуют');
  return true;
}

function testTimerLogic() {
  console.log('🧪 Тест 5: Логика таймера');
  const seconds = 300;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes !== 5 || remainingSeconds !== 0) {
    console.error('❌ Неверный расчет времени');
    return false;
  }
  
  console.log('✅ Логика таймера работает корректно');
  return true;
}

function testCommandParsing() {
  console.log('🧪 Тест 6: Парсинг команд');
  
  // Тест команды /pose
  const poseCommand = '/pose поза-собаки';
  const poseMatch = poseCommand.match(/\/pose (.+)/);
  if (!poseMatch || poseMatch[1] !== 'поза-собаки') {
    console.error('❌ Неверный парсинг команды /pose');
    return false;
  }
  
  // Тест команды /routine
  const routineCommand = '/routine утренняя';
  const routineMatch = routineCommand.match(/\/routine (.+)/);
  if (!routineMatch || routineMatch[1] !== 'утренняя') {
    console.error('❌ Неверный парсинг команды /routine');
    return false;
  }
  
  // Тест команды /timer
  const timerCommand = '/timer 300';
  const timerMatch = timerCommand.match(/\/timer(?: (.+))?/);
  if (!timerMatch || timerMatch[1] !== '300') {
    console.error('❌ Неверный парсинг команды /timer');
    return false;
  }
  
  // Тест команды /timer без параметров
  const timerNoParam = '/timer';
  const timerNoParamMatch = timerNoParam.match(/\/timer(?: (.+))?/);
  if (!timerNoParamMatch) {
    console.error('❌ Неверный парсинг команды /timer без параметров');
    return false;
  }
  
  console.log('✅ Парсинг команд работает корректно');
  return true;
}

function testAllPosesExist() {
  console.log('🧪 Тест 7: Проверка всех поз в программах');
  
  for (const routine of Object.values(routines)) {
    for (const { pose } of routine.poses) {
      if (!yogaPoses[pose]) {
        console.error(`❌ Поза "${pose}" используется в программе "${routine.name}", но не существует в базе данных`);
        return false;
      }
    }
  }
  
  console.log('✅ Все позы в программах существуют');
  return true;
}

// Запуск всех тестов
console.log('🚀 Запуск тестов логики бота...\n');

const tests = [
  testPoseLookup,
  testPoseNotFound,
  testRoutineLookup,
  testPoseInRoutine,
  testTimerLogic,
  testCommandParsing,
  testAllPosesExist
];

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  try {
    if (test()) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.error(`❌ Тест ${index + 1} вызвал ошибку:`, error);
    failed++;
  }
  console.log('');
});

console.log('📊 Результаты тестирования:');
console.log(`✅ Успешно: ${passed}`);
console.log(`❌ Провалено: ${failed}`);
console.log(`📈 Всего тестов: ${tests.length}`);

if (failed === 0) {
  console.log('\n🎉 Все тесты пройдены успешно!');
  process.exit(0);
} else {
  console.log('\n⚠️ Некоторые тесты провалены. Проверьте код.');
  process.exit(1);
}






