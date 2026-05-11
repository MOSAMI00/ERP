<?php
// app/Http/Middleware/EnsureUserIsActive.php

namespace App\Http\Middleware;

use App\Domains\User\Enums\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        if ($user->status === UserStatus::Banned) {
            Auth::logout();
            return redirect()->route('login')
                ->with('error', "Your account has been banned. Reason: {$user->ban_reason}");
        }

        if ($user->status === UserStatus::Suspended) {
            Auth::logout();
            return redirect()->route('login')
                ->with('error', 'Your account has been suspended. Please contact support.');
        }

        return $next($request);
    }
}
