<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('features/auth/register/RegisterPage');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'full_name'    => ['required', 'string', 'max:255'],
            'phone'        => ['required', 'string', 'max:30', 'unique:users,phone'],
            'email'        => ['nullable', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'type'         => ['required', 'in:tenant,owner'],
            'governorate'  => ['required', 'string', 'max:255'],
            'password'     => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Normalise phone to digits only
        $phone = preg_replace('/[^0-9+]/', '', $request->phone);

        // Generate a placeholder email when the user leaves it blank
        $email = $request->email ?: 'phone-' . $phone . '@local.erp';

        $user = User::create([
            'full_name'     => $request->full_name,
            'email'         => $email,
            'phone'         => $phone,
            'type'          => $request->type,
            'governorate'   => $request->governorate,
            'password_hash' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect based on user type
        if ($user->type === 'owner') {
            return redirect()->route('owner.overview');
        }

        return redirect()->route('dashboard.index');
    }
}
