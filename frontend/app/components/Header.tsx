'use client';

import { useRouter } from 'next/navigation';

interface HeaderProps {
  icon: string;
  iconBgColor: string;
  subtitle: string;
  userName: string;
}

export default function Header({ icon, iconBgColor, subtitle, userName }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`w-7 h-7 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <span className="text-white text-sm">{icon}</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">物流管理システム</h1>
            <p className="text-xs text-gray-600">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-600">👤 {userName}</span>
          <button
            onClick={handleLogout}
            className="px-2 py-1 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}







