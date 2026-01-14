'use client';

interface NavigationProps {
  items: string[];
  activeItem: string;
  activeColor: string;
  role: 'admin' | 'forwarder' | 'packing' | 'supermarket';
}

export default function Navigation({ items, activeItem, activeColor, role }: NavigationProps) {
  // 各タブのリンク先を定義
  const getTabLink = (item: string): string => {
    switch (role) {
      case 'admin':
        switch (item) {
          case 'ダッシュボード':
            return '/admin';
          case '出荷計画':
            return '/admin/shipments/new';
          case '商品マスタ':
            return '/admin/masters/products';
          case '取引先':
            return '/admin/masters/companies';
          case 'ユーザー管理':
            return '/admin/users';
          case 'レポート':
            return '/admin/reports';
          default:
            return '#';
        }
      case 'forwarder':
        switch (item) {
          case '出荷計画一覧':
            return '/forwarder';
          case '入荷予定':
            return '/forwarder/incoming';
          case 'パレット管理':
            return '/forwarder/pallets';
          case 'コンテナ管理':
            return '/forwarder/containers';
          case '出荷管理':
            return '/forwarder/shipments';
          default:
            return '#';
        }
      case 'packing':
        switch (item) {
          case '出荷計画一覧':
            return '/packing';
          case '入荷予定':
            return '/packing/incoming';
          case '作業報告':
            return '/packing/reports';
          case '履歴':
            return '/packing/history';
          default:
            return '#';
        }
      case 'supermarket':
        switch (item) {
          case '入荷予定一覧':
            return '/supermarket';
          case '商品詳細':
            return '/supermarket/products';
          case 'パレット構成':
            return '/supermarket/pallets';
          case '書類':
            return '/supermarket/documents';
          case 'トラッキング':
            return '/supermarket/tracking';
          default:
            return '#';
        }
      default:
        return '#';
    }
  };

  // アクティブアイテムの色を決定
  const getActiveClasses = () => {
    switch (activeColor) {
      case 'indigo':
        return 'border-indigo-500 text-indigo-600';
      case 'blue':
        return 'border-blue-500 text-blue-600';
      case 'green':
        return 'border-green-500 text-green-600';
      case 'purple':
        return 'border-purple-500 text-purple-600';
      default:
        return 'border-indigo-500 text-indigo-600';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {items.map((item) => (
            <a
              key={item}
              href={getTabLink(item)}
              target="_blank"
              rel="noopener noreferrer"
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                item === activeItem
                  ? getActiveClasses()
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

