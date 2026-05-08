<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            return back()->withErrors([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'full_name'  => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', 'unique:users'],
            'phone'      => ['required', 'string', 'unique:users'],
            'password'   => ['required', 'confirmed', 'min:8'],
            'type'       => ['required', 'in:tenant,owner'],
            'governorate'=> ['required', 'string'],
        ]);

        $user = User::create([
            ...$data,
            'password_hash' => Hash::make($data['password']),
        ]);

        Auth::login($user);

        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}