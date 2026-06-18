import React from 'react';
import BasicDetailsFields from './BasicDetailsFields';
import LocationFields from './LocationFields';

const BasicInfoStep = ({
  draft,
  updateDraft,
  categories,
  governorates,
}) => (
  <div>
    <h3 className="mb-6">المعلومات الأساسية</h3>

    <BasicDetailsFields draft={draft} updateDraft={updateDraft} categories={categories} />
    <LocationFields draft={draft} updateDraft={updateDraft} governorates={governorates} />
  </div>
);

export default BasicInfoStep;
