'use client';

import { yogaPoses, routines, YogaPose, Routine, getDifficultyColor } from '@/lib/yoga-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/use-subscription';

export default function YogaWebApp() {
  const [activeTab, setActiveTab] = useState<'poses' | 'routines' | 'timer'>('poses');
  const [selectedPose, setSelectedPose] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
  const [isRoutineActive, setIsRoutineActive] = useState(false);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [isMounted, setIsMounted] = useState(false);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const webAppRef = useRef<any>(null);
  
  const { hasAccess, subscription, loading: subscriptionLoading } = useSubscription(telegramId);

  useEffect(() => {
    // Устанавливаем флаг монтирования для предотвращения проблем с гидратацией
    setIsMounted(true);
    
    // Динамический импорт Telegram Web App только на клиенте
    import('@twa-dev/sdk').then((module) => {
      webAppRef.current = module.default;
      try {
        webAppRef.current.ready();
        webAppRef.current.expand();
        // Получаем telegram_id пользователя
        const user = webAppRef.current.initDataUnsafe?.user;
        if (user?.id) {
          setTelegramId(user.id);
        }
        // setHeaderColor и setBackgroundColor не поддерживаются в версии 6.0+
        // Используем только поддерживаемые методы
      } catch (error) {
        console.warn('Telegram WebApp не доступен:', error);
      }
    }).catch(() => {
      console.warn('Telegram WebApp SDK не загружен');
    });

    // Очистка интервала при размонтировании
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const handleStartRoutine = (routineKey: string) => {
    // Проверяем подписку перед запуском тренировки
    if (!hasAccess) {
      if (webAppRef.current) {
        webAppRef.current.openLink(`${process.env.NEXT_PUBLIC_WEB_APP_URL || '/webapp'}/subscribe`);
      } else {
        window.location.href = '/webapp/subscribe';
      }
      return;
    }

    setSelectedRoutine(routineKey);
    setIsRoutineActive(true);
    setCurrentPoseIndex(0);
  };

  const handleNextPose = () => {
    if (!selectedRoutine) return;
    const routine = routines[selectedRoutine];
    if (currentPoseIndex < routine.poses.length - 1) {
      setCurrentPoseIndex(currentPoseIndex + 1);
    } else {
      setIsRoutineActive(false);
      setSelectedRoutine(null);
      setCurrentPoseIndex(0);
      // Используем вибрацию для уведомления о завершении
      if (webAppRef.current) {
        try {
          if (webAppRef.current.HapticFeedback?.notificationOccurred) {
            webAppRef.current.HapticFeedback.notificationOccurred('success');
          }
        } catch (error) {
          console.warn('HapticFeedback не доступен:', error);
        }
      }
      
      // Используем стандартный alert как fallback
      setTimeout(() => {
        alert('🎉 Программа завершена! Отличная работа!');
      }, 100);
    }
  };

  const handleStartTimer = () => {
    setIsTimerActive(true);
    setTimeRemaining(timerSeconds);
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerActive(false);
          timerIntervalRef.current = null;
          
          // Используем вибрацию для уведомления о завершении
          if (webAppRef.current) {
            try {
              if (webAppRef.current.HapticFeedback?.notificationOccurred) {
                webAppRef.current.HapticFeedback.notificationOccurred('success');
              }
            } catch (error) {
              console.warn('HapticFeedback не доступен:', error);
            }
          }
          
          // Используем стандартный alert как fallback
          setTimeout(() => {
            alert('🔔 Медитация завершена!');
          }, 100);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    timerIntervalRef.current = interval;
  };

  const handleStopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsTimerActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isRoutineActive && selectedRoutine) {
    const routine = routines[selectedRoutine];
    const currentPose = routine.poses[currentPoseIndex];
    const poseInfo = yogaPoses[currentPose.pose];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
        <div className="max-w-md mx-auto">
          <Card className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-900">Программа: {routine.name}</CardTitle>
                    <Badge className="bg-indigo-100 text-indigo-800">{currentPoseIndex + 1}/{routine.poses.length}</Badge>
                  </div>
                </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{poseInfo.name}</h3>
                  <p className="text-gray-800 mb-4">{poseInfo.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getDifficultyColor(poseInfo.difficulty)}>
                      {poseInfo.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-700">⏱ {currentPose.duration} сек</span>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-900">Польза:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                      {poseInfo.benefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleNextPose}
                    className="flex-1 !bg-indigo-600 hover:!bg-indigo-700 !text-white"
                  >
                    {currentPoseIndex < routine.poses.length - 1 ? 'Следующая поза' : 'Завершить'}
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsRoutineActive(false);
                      setSelectedRoutine(null);
                      setCurrentPoseIndex(0);
                    }}
                    variant="outline"
                  >
                    Отменить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isTimerActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-gray-900">🧘 Медитация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-indigo-600">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-gray-800">Примите удобную позу и дышите глубоко</p>
              <Button 
                onClick={handleStopTimer}
                variant="destructive"
                className="w-full !text-white"
              >
                Остановить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4 relative">
      <div className="max-w-md mx-auto relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">🧘 Йога Тренер</h1>
          <p className="text-center text-gray-800">Ваш персональный помощник</p>
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('poses')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'poses'
                ? '!bg-indigo-600 !text-white'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            Позы
          </button>
          <button
            onClick={() => setActiveTab('routines')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'routines'
                ? '!bg-indigo-600 !text-white'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            Программы
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'timer'
                ? '!bg-indigo-600 !text-white'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            Таймер
          </button>
        </div>

        {/* Контент табов */}
        {activeTab === 'poses' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Йога позы</h2>
            {selectedPose ? (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="!text-gray-900">{yogaPoses[selectedPose].name}</CardTitle>
                    <Button
                      onClick={() => setSelectedPose(null)}
                      variant="ghost"
                      size="sm"
                    >
                      ✕
                    </Button>
                  </div>
                  <CardDescription className="!text-gray-700">{yogaPoses[selectedPose].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(yogaPoses[selectedPose].difficulty)}>
                        {yogaPoses[selectedPose].difficulty}
                      </Badge>
                      <span className="text-sm text-gray-700">
                        ⏱ {yogaPoses[selectedPose].duration}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Польза:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {yogaPoses[selectedPose].benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-gray-800">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {Object.entries(yogaPoses).map(([key, pose]) => (
                  <Card
                    key={key}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-gray-800 border-gray-700"
                    onClick={() => setSelectedPose(key)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg !text-white">{pose.name}</CardTitle>
                        <Badge className={`${getDifficultyColor(pose.difficulty)} border-0`}>
                          {pose.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 !text-gray-300">
                        {pose.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'routines' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Программы тренировок</h2>
            
            {!hasAccess && !subscriptionLoading && (
              <Card className="bg-yellow-50 border-yellow-200" suppressHydrationWarning>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-gray-800 mb-2 font-semibold">
                      🔒 Для доступа к программам тренировок требуется подписка
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      Подписка дает доступ ко всем программам тренировок и расширенным функциям
                    </p>
                    <Button
                      onClick={() => {
                        if (webAppRef.current) {
                          webAppRef.current.openLink(`${process.env.NEXT_PUBLIC_WEB_APP_URL || '/webapp'}/subscribe`);
                        } else {
                          window.location.href = '/webapp/subscribe';
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      💎 Оформить подписку
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {hasAccess && subscription && (
              <Card className="bg-green-50 border-green-200 mb-4" suppressHydrationWarning>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-semibold">✅ Подписка активна</p>
                      <p className="text-sm text-green-700">
                        {subscription.plan_type === 'monthly' && 'Месячная подписка'}
                        {subscription.plan_type === 'yearly' && 'Годовая подписка'}
                        {subscription.plan_type === 'lifetime' && 'Пожизненная подписка'}
                        {subscription.days_remaining !== null && subscription.days_remaining > 0 && 
                          ` • Осталось ${subscription.days_remaining} дней`}
                      </p>
                    </div>
                    <Badge className="bg-green-600 text-white">Premium</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {Object.entries(routines).map(([key, routine]) => (
              <Card key={key} className="hover:shadow-md transition-shadow bg-gray-800 border-gray-700" suppressHydrationWarning>
                <CardHeader>
                  <CardTitle className="!text-white">{routine.name}</CardTitle>
                  <CardDescription className="!text-gray-300">{routine.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm !text-gray-300">
                      {routine.poses.length} поз • {routine.totalTime}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleStartRoutine(key)}
                    disabled={!hasAccess && !subscriptionLoading}
                    className={`w-full ${
                      hasAccess 
                        ? '!bg-indigo-600 hover:!bg-indigo-700 !text-white' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {hasAccess ? 'Начать программу' : '🔒 Требуется подписка'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'timer' && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="!text-white">Таймер медитации</CardTitle>
              <CardDescription className="!text-gray-300">Установите время для медитации</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-2 justify-center">
                  {[5, 10, 15, 20].map((minutes) => (
                    <Button
                      key={minutes}
                      onClick={() => {
                        setTimerSeconds(minutes * 60);
                        setTimeRemaining(minutes * 60);
                      }}
                      variant={timerSeconds === minutes * 60 ? 'default' : 'outline'}
                      className={timerSeconds === minutes * 60 ? '!bg-indigo-600 !text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                    >
                      {minutes} мин
                    </Button>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-400 mb-2">
                    {formatTime(timerSeconds)}
                  </div>
                </div>
                <Button
                  onClick={handleStartTimer}
                  className="w-full !bg-indigo-600 hover:!bg-indigo-700 !text-white"
                  size="lg"
                >
                  Начать медитацию
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
