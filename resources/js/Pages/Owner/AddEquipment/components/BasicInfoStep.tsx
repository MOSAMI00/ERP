import React from 'react';
import BasicDetailsFields from './BasicDetailsFields';
import ConditionDeliveryFields from './ConditionDeliveryFields';
import LocationFields from './LocationFields';
import SpecsEditor from './SpecsEditor';

const BasicInfoStep = ({
  draft,
  specs,
  addSpec,
  removeSpec,
  updateDraft,
  updateSpec,
}) => (
  <div>
    <h3 className="mb-6">المعلومات الأساسية</h3>

    <BasicDetailsFields draft={draft} updateDraft={updateDraft} />
    <SpecsEditor specs={specs} addSpec={addSpec} removeSpec={removeSpec} updateSpec={updateSpec} />
    <LocationFields draft={draft} updateDraft={updateDraft} />
    <ConditionDeliveryFields draft={draft} updateDraft={updateDraft} />
  </div>
);

export default BasicInfoStep;
