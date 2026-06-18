<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKycDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'doc_type'     => ['required', 'in:national_id,passport,military_id'],
            'front_image'  => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'back_image'   => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'selfie_image' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
        ];
    }
}
