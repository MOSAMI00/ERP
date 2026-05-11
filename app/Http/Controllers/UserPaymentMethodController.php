<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserPaymentMethod;
use Illuminate\Http\Request;
use App\Http\Requests\StorePaymentMethodRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserPaymentMethodController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('PaymentMethods/Index', [
            'methods' => $user->paymentMethods()->get(),
        ]);
    }

    public function store(StorePaymentMethodRequest $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $data = $request->validated();

        if (!empty($data['is_default'])) {
            $user->paymentMethods()->update(['is_default' => false]);
        }

        $user->paymentMethods()->create($data);

        return back()->with('success', 'Payment method added.');
    }

    public function setDefault(UserPaymentMethod $method)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($method->user_id !== $user->id) {
            abort(403);
        }

        $user->paymentMethods()->update(['is_default' => false]);
        $method->update(['is_default' => true]);

        return back()->with('success', 'Default payment method updated.');
    }

    public function destroy(UserPaymentMethod $method)
    {
        /** @var User $user */
        $user = Auth::user();

        // تأكد أن الـ method تخص هذا المستخدم
        if ($method->user_id !== $user->id) {
            abort(403);
        }

        $method->delete();

        return back()->with('success', 'Payment method removed.');
    }
}
