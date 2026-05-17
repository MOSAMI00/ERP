import React from 'react';
import { Search } from 'lucide-react';
import { AppInput } from '../../../../components/shared';

const RequestFilters = ({ search, onSearchChange }) => (
  <div className="flex-center gap-4">
    <div style={{ position: 'relative' }}>
      <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
      <AppInput
        type="text"
        placeholder="بحث..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        style={{ paddingRight: 36, width: 220 }}
      />
    </div>
  </div>
);

export default RequestFilters;
