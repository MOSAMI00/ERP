<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name'  => ['required', 'string', 'max:255'],
            'email'      => ['nullable', 'email', 'unique:users'],
            'phone'      => ['required', 'string', 'unique:users'],
            'password'   => ['required', 'confirmed', 'min:8'],
            'type'       => ['required', 'in:tenant,owner'],
            'governorate'=> ['required', 'string'],
        ];
    }
}
