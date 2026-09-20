import React from 'react';
import { Home, Star, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { LanguageCode, t } from '../utils/translations';

export type TabType = 'home' | 'collection' | 'settings';

interface BottomNavBarProps {
  activeTab: TabType;
  lang?: LanguageCode;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  lang = 'en',
  onSelectTab,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'home',
      label: t(lang, 'home'),
      icon: Home,
    },
    {
      id: 'collection',
      label: t(lang, 'collection'),
      icon: Star,
    },
    {
      id: 'settings',
      label: t(lang, 'settings'),
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#edf1fa]/95 backdrop-blur-md border-t border-[#d8e0f0] shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] select-none">
      <div className="max-w-md sm:max-w-lg mx-auto px-4 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              type="button"
              id={`tab-btn-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              whileTap={{ scale: 0.88 }}
              className="relative flex flex-col items-center justify-center py-1 px-3 min-w-[76px] cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-14 h-8">
                {/* Smooth sliding active indicator pill with spring animation */}
                {isActive && (
                  <motion.div
                    layoutId="active-bottom-tab-pill"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 32,
                    }}
                    className="absolute inset-0 rounded-full bg-[#dbe4fb] shadow-2xs"
                  />
                )}

                <motion.div
                  animate={{
                    scale: isActive ? 1.12 : 1,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`relative z-10 ${
                    isActive ? 'text-[#3b52d9]' : 'text-[#6b7694] group-hover:text-[#2c385c]'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'stroke-[2.5]' : 'stroke-[2]'
                    }`}
                  />
                </motion.div>
              </div>

              <motion.span
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                className={`text-[11px] mt-0.5 tracking-tight transition-colors duration-200 relative z-10 ${
                  isActive
                    ? 'font-extrabold text-[#2e42b6]'
                    : 'font-medium text-[#65718e]'
                }`}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
