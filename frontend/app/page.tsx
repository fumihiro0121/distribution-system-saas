'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ログイン状態をチェック
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      // 役割に応じてリダイレクト
      switch (parsed.role) {
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
          router.push('/login');
      }
    } else {
      // 未ログインの場合はログインページへ
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4 animate-pulse">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
