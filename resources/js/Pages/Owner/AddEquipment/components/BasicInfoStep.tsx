import React from 'react';
import BasicDetailsFields from './BasicDetailsFields';
import LocationFields from './LocationFields';

const BasicInfoStep = ({
  draft,
  updateDraft,
}) => (
  <div>
    <h3 className="mb-6">المعلومات الأساسية</h3>

    <BasicDetailsFields draft={draft} updateDraft={updateDraft} />
    <LocationFields draft={draft} updateDraft={updateDraft} />
  </div>
);

export default BasicInfoStep;
