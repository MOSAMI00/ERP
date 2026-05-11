<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHandoverReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rental_op_id'     => ['required', 'exists:rental_operations,id'],
            'phase'            => ['required', 'in:delivery,return'],
            'notes'            => ['nullable', 'string'],
            'has_issues'       => ['required', 'boolean'],
            'condition_status' => ['required', 'in:good,damaged,partially_damaged'],
            'images'           => ['nullable', 'array'],
            'images.*'         => ['image', 'max:4096'],
        ];
    }
}
