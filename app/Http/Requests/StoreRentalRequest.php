<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRentalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'equipment_id'      => ['required', 'exists:equipment,id'],
            'start_date'        => ['required', 'date', 'after:today'],
            'end_date'          => ['required', 'date', 'after:start_date'],
            'delivery_location' => ['nullable', 'string'],
        ];
    }
}
