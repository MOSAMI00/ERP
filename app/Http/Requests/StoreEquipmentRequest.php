<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id'      => ['required', 'exists:categories,id'],
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'governorate'      => ['required', 'string'],
            'address'          => ['required', 'string'],
            'price_per_day'    => ['required', 'numeric', 'min:0'],
            'insurance_amount' => ['required', 'numeric', 'min:0'],
            'rental_terms'     => ['required', 'string'],
        ];
    }
}
