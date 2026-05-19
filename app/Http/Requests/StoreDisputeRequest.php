<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDisputeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rental_op_id'          => ['required', 'exists:rental_operations,id'],
            'equipment_handover_id' => ['required', 'exists:equipment_handover,id'],
            'tenant_claim'          => ['required', 'string'],
            'requested_amount'      => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function (\Illuminate\Validation\Validator $validator) {
            $handoverId = $this->input('equipment_handover_id');
            $rentalId = $this->input('rental_op_id');

            if ($handoverId && $rentalId) {
                $handover = \App\Models\EquipmentHandover::query()->find($handoverId);
                if (!$handover || (int) $handover->rental_op_id !== (int) $rentalId) {
                    $validator->errors()->add('equipment_handover_id', 'عملية تسليم المعدة لا تطابق رقم عملية الإيجار المرفق.');
                }
            }
        });
    }
}
