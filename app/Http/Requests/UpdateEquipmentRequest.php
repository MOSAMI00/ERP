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
            'category_id'      => ['sometimes', 'required', 'exists:categories,id'],
            'name'             => ['sometimes', 'required', 'string', 'max:255'],
            'description'      => ['sometimes', 'required', 'string'],
            'governorate'      => ['sometimes', 'required', 'string'],
            'address'          => ['sometimes', 'required', 'string'],
            'price_per_day'    => ['sometimes', 'required', 'numeric', 'min:0'],
            'insurance_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'rental_terms'     => ['sometimes', 'required', 'string'],
            'images'           => ['nullable', 'array'],
            'images.*'         => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'status'           => ['nullable', 'in:active,hidden'],
        ];
    }
}
