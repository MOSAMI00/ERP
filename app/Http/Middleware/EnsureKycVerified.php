<?php
// app/Http/Middleware/EnsureKycVerified.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureKycVerified
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->kyc_status !== 'verified') {
            return redirect()->route('kyc.index')
                ->with('warning', 'You need to complete KYC verification first.');
        }

        return $next($request);
    }
}