<?php
// app/Http/Middleware/EnsureUserIsTenant.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsTenant
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || $request->user()->type !== 'tenant') {
            return redirect()->route('dashboard.index')
                ->with('error', 'Access denied. Tenant account required.');
        }

        return $next($request);
    }
}
