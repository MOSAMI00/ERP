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
}
