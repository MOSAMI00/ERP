import React from 'react';

const KPICard = ({ icon, title, value, sub, iconStyle, valueClassName }) => (
  <div className="owner-card owner-kpi-card">
    <div className="owner-kpi-info">
      <h4>{title}</h4>
      <p className={`kpi-value ${valueClassName ?? ''}`.trim()}>{value}</p>
      {sub ? <p className="kpi-sub">{sub}</p> : null}
    </div>
    <div className="owner-kpi-icon" style={iconStyle}>
      {icon}
    </div>
  </div>
);

export default KPICard;
