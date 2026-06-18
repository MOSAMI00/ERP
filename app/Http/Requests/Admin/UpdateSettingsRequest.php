<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'platform_fee_rate'      => ['required', 'numeric', 'min:0', 'max:100'],
            'payment_deadline_hours' => ['required', 'integer', 'min:1'],
            'min_rental_days'        => ['required', 'integer', 'min:1'],
            'max_rental_days'        => ['required', 'integer', 'min:1'],
            'objection_window_hours' => ['required', 'integer', 'min:1'],
            'refund_window_days'     => ['required', 'integer', 'min:1'],
            'kyc_required'           => ['required', 'boolean'],
            'platform_terms'         => ['nullable', 'string'],
            'contract_template'      => ['nullable', 'string'],
        ];
    }
}
