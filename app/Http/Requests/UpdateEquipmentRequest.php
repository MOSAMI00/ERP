<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'governorate'      => ['required', 'string'],
            'address'          => ['required', 'string'],
            'price_per_day'    => ['required', 'numeric', 'min:0'],
            'insurance_amount' => ['required', 'numeric', 'min:0'],
            'rental_terms'     => ['required', 'string'],
            'status'           => ['nullable', 'in:active,hidden'],
        ];
    }
}
