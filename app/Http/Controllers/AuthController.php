<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'phone'    => ['required', 'string'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt(['phone' => $credentials['phone'], 'password' => $credentials['password']])) {
            return back()->withErrors([
                'phone' => 'The provided credentials are incorrect.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard.index'));
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $data['phone'] = preg_replace('/[^0-9+]/', '', $data['phone']);
        $data['email'] = $data['email'] ?: 'phone-'.$data['phone'].'@local.erp';

        $password = $data['password'];
        unset($data['password'], $data['password_confirmation']);

        $user = User::create([
            ...$data,
            'password_hash' => Hash::make($password),
        ]);

        Auth::login($user);

        return redirect()->route('dashboard.index');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
