import React from 'react';

const RentalTimeline = ({ steps }) => (
  <div className="owner-card">
    <h4 className="mb-4">الجدول الزمني للعملية</h4>
    <div style={{ position: 'relative', paddingRight: 28 }}>
      <div style={{ position: 'absolute', right: 7, top: 10, bottom: 10, width: 2, backgroundColor: 'var(--color-border)' }} />
      {steps.map((step, index) => (
        <div key={step.label} style={{ position: 'relative', marginBottom: index === steps.length - 1 ? 0 : 24 }}>
          <div style={{
            position: 'absolute',
            right: -28,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: step.done ? 'var(--color-primary-green)' : 'white',
            border: `2px solid ${step.done ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
            zIndex: 1,
          }}
          />
          <span style={{
            fontWeight: step.done ? 600 : 400,
            color: step.done ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          }}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default RentalTimeline;
