<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ResolveDisputeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'admin_decision'     => ['required', 'in:accept_deduction,reject_deduction,modify_compensation'],
            'final_compensation' => ['nullable', 'numeric', 'min:0'],
            'admin_note'         => ['required', 'string'],
        ];
    }
}
