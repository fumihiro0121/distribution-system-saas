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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">物流管理システム</h1>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">👤 {userName}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}




