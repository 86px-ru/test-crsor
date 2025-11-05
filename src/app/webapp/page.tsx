'use client';

import dynamic from 'next/dynamic';

// Отключаем SSR для Web App, так как он работает только на клиенте
const YogaWebApp = dynamic(() => import('./yoga-webapp-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl mb-2">🧘</div>
        <p className="text-gray-600">Загрузка...</p>
      </div>
    </div>
  ),
});

export default YogaWebApp;
