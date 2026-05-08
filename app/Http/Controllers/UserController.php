<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function profile()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->load(['kycDocuments', 'paymentMethods']);

        return Inertia::render('User/Profile', [
            'user' => $user,
        ]);
    }

    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $data = $request->validate([
            'full_name'   => ['required', 'string', 'max:255'],
            'phone'       => ['required', 'string', 'unique:users,phone,' . $user->id],
            'governorate' => ['required', 'string'],
            'avatar'      => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        return back()->with('success', 'Profile updated.');
    }
}