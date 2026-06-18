<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'full_name'   => ['required', 'string', 'max:255'],
            'phone'       => ['required', 'string', 'unique:users,phone,' . $userId],
            'governorate' => ['required', 'string'],
            'avatar'      => ['nullable', 'image', 'max:2048'],
        ];
    }
}
