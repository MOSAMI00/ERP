<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DecideHandoverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'owner_decision'     => ['required', 'in:full_refund,partial_refund,no_refund'],
            'proposed_deduction' => ['nullable', 'numeric', 'min:0'],
            'final_condition'    => ['required', 'in:good,damaged,partially_damaged'],
            'final_notes'        => ['nullable', 'string'],
        ];
    }
}
