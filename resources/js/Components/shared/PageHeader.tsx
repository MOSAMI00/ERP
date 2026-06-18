import * as React from 'react';
import { cn } from '../ui/utils';

export function PageHeader({ title, description, actions, className }) {
  return (
    <div className={cn('mb-8 flex flex-wrap items-start justify-between gap-4', className)}>
      <div>
        <h2 className="m-0 text-2xl font-bold text-[#222222]">{title}</h2>
        {description ? <p className="mt-1 text-sm text-[#888888]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
