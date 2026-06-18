<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rental_op_id' => ['required', 'exists:rental_operations,id'],
            'target_id'    => ['required', 'integer'],
            'target_type'  => ['required', 'in:user,equipment'],
            'rating'       => ['required', 'numeric', 'min:1', 'max:5'],
            'review_text'  => ['nullable', 'string', 'max:1000'],
        ];
    }
}
