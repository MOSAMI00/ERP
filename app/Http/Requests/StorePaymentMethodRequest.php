<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type'           => ['required', 'in:bank_account,e_wallet'],
            'account_name'   => ['nullable', 'required_if:type,bank_account', 'string', 'max:255'],
            'account_number' => ['nullable', 'required_if:type,bank_account', 'string', 'max:255'],
            'bank_name'      => ['nullable', 'string'],
            'wallet_number'  => ['nullable', 'required_if:type,e_wallet', 'string', 'max:255'],
            'is_default'     => ['boolean'],
        ];
    }
}
