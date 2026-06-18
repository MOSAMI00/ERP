<?php

namespace App\Http\Requests;

use App\Models\Equipment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'start_date'        => ['required', 'date', 'after_or_equal:today'],
            'end_date'          => ['required', 'date', 'after:start_date'],
            'delivery_location' => ['required', 'string', 'min:8'],
            'time_slot'         => ['required', 'string', 'in:morning,afternoon,evening'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $user = $this->user();

            if (! $user) {
                return;
            }

            if ($user->kyc_status !== 'approved') {
                $validator->errors()->add('kyc', 'يجب توثيق الهوية بالكامل قبل طلب تأجير معدة.');
            }

            if ($user->type === 'owner') {
                $validator->errors()->add('type', 'حساب المؤجر لا يمكنه طلب تأجير المعدات. استخدم حساب مستأجر لإرسال طلبات التأجير.');
            }

            $equipmentId = $this->input('equipment_id');
            if ($equipmentId) {
                $equipment = Equipment::query()->find($equipmentId);
                if ($equipment && (int) $equipment->owner_id === (int) $user->id) {
                    $validator->errors()->add('equipment_id', 'لا يمكنك استئجار معدتك الخاصة.');
                }
            }
        });
    }
}
