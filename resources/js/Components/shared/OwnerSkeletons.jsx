import React from 'react';

export const KPICardSkeleton = () => (
  <div className="owner-card owner-kpi-card animate-pulse">
    <div className="owner-kpi-info">
      <div className="skeleton" style={{ height: 14, width: 110, borderRadius: 6, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 28, width: 120, borderRadius: 8, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 12, width: 140, borderRadius: 6 }} />
    </div>
    <div className="owner-kpi-icon">
      <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 8 }} />
    </div>
  </div>
);

export const ChartSkeleton = ({ height = 260 }) => (
  <div className="owner-card animate-pulse">
    <div className="skeleton" style={{ height: 14, width: 180, borderRadius: 6, marginBottom: 18 }} />
    <div className="skeleton" style={{ height, width: '100%', borderRadius: 10 }} />
  </div>
);

export const EquipmentCardSkeleton = () => (
  <div className="owner-card equipment-card animate-pulse">
    <div className="skeleton" style={{ height: 180, width: '100%', borderRadius: 10 }} />
    <div className="equipment-details">
      <div className="skeleton" style={{ height: 18, width: '70%', borderRadius: 6, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 12, width: '55%', borderRadius: 6, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '50%', borderRadius: 6, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '45%', borderRadius: 6 }} />
    </div>
  </div>
);
