<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rental_op_id'     => ['required', 'exists:rental_operations,id'],
            'payment_method'   => ['required', 'in:bank_transfer,cash,platform_wallet'],
            'transaction_ref'  => ['nullable', 'string'],
        ];
    }
}
