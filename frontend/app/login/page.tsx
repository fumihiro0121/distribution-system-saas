'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // デモ用のログイン処理
    const demoAccounts = [
      { email: 'admin@example.com', password: 'admin123', role: 'admin', name: '管理者' },
      { email: 'forwarder@example.com', password: 'forwarder123', role: 'forwarder', name: '佐川グローバル' },
      { email: 'packing@example.com', password: 'packing123', role: 'packing', name: '福富運送' },
      { email: 'supermarket@example.com', password: 'super123', role: 'supermarket', name: 'アメリカンスーパー' },
    ];

    const account = demoAccounts.find(acc => acc.email === email && acc.password === password);

    if (account) {
      // セッション情報を保存（実際の実装ではトークンを使用）
      localStorage.setItem('user', JSON.stringify(account));
      
      // 役割に応じてリダイレクト
      switch (account.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'forwarder':
          router.push('/forwarder');
          break;
        case 'packing':
          router.push('/packing');
          break;
        case 'supermarket':
          router.push('/supermarket');
          break;
        default:
          router.push('/');
      }
    } else {
      setError('メールアドレスまたはパスワードが正しくありません');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">物流管理システム</h1>
          <p className="text-gray-600 mt-2">Distribution Management System</p>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">ログイン</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
            >
              ログイン
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">デモアカウント:</p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="bg-gray-50 p-2 rounded">
                <strong>管理者:</strong> admin@example.com / admin123
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>フォワーダー:</strong> forwarder@example.com / forwarder123
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>梱包業者:</strong> packing@example.com / packing123
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>スーパー:</strong> supermarket@example.com / super123
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
            パスワードをお忘れですか？
          </a>
        </div>
      </div>
    </div>
  );
}










