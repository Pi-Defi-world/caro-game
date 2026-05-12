'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Users, PawPrint, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RenderMyPets from '@/components/me/MyPets';
import RenderMyCharacter from '@/components/me/MyCharacter';
import ShopBanner from '@/app/shop/ShopBanner';

// Types
type TabName = 'Pets' | 'Character' | 'VIP';

interface Tab {
  id: number;
  name: TabName;
  icon: React.ElementType;
}

// Constants
const TABS: Tab[] = [
  { id: 1, name: 'Pets', icon: PawPrint },
  { id: 2, name: 'Character', icon: Users },
  { id: 3, name: 'VIP', icon: Crown },
];

// Components
const TabButton: React.FC<{
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
}> = ({ tab, isActive, onClick }) => {
  const Icon = tab.icon;
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center gap-2
        px-4 py-2 
        rounded-xl
        text-base font-semibold
        transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/20' 
          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
        }
      `}
    >
      <Icon className="w-4 h-4" />
      {tab.name}
    </motion.button>
  );
};

const TabContent: React.FC<{ activeTab: TabName }> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Pets':
        return <RenderMyPets />;
      case 'Character':
        return <RenderMyCharacter />;
      case 'VIP':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Crown className="w-12 h-12 text-yellow-400 mb-4" />
            <p className="text-gray-400 text-lg">VIP content coming soon</p>
            <p className="text-gray-500 text-sm mt-2">Stay tuned for exclusive features!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400" />
  </div>
);

// Main Component
function PetsContent() {
  const searchParams = useSearchParams();
  const activeTabParam = (searchParams.get('activeTab') as TabName) || 'Pets';
  const [activeTab, setActiveTab] = useState<TabName>(activeTabParam);

  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  return (
    <div className="space-y-6">
      <ShopBanner title="Collection" redirect="/me" />
      
      <div className="flex items-center gap-2">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.name}
            onClick={() => setActiveTab(tab.name)}
          />
        ))}
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-2 min-h-[400px]">
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  );
}

export default function PetsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PetsContent />
    </Suspense>
  );
}
