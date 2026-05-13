import * as React from 'react';
import { cn } from '../ui/utils';

export function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}) {
  return (
    <div className={cn('mb-6 flex gap-0 overflow-x-auto border-b border-[#E0E0E0]', className)}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            className={cn(
              'mb-[-1px] inline-flex h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition-colors',
              active
                ? 'border-[#2D5A27] text-[#2D5A27]'
                : 'border-transparent text-[#888888] hover:bg-[#F4F6F9] hover:text-[#2D5A27]',
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            {tab.label}
            {typeof tab.count === 'number' && tab.count > 0 ? <span>({tab.count})</span> : null}
          </button>
        );
      })}
    </div>
  );
}
