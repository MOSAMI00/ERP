<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'images'           => ['nullable', 'array'],
            'images.*'         => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->user()?->kyc_status !== 'approved') {
                $validator->errors()->add('kyc', 'يجب توثيق الهوية بالكامل قبل إضافة أي معدة.');
            }
        });
    }
}
