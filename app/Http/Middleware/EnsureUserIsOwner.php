<?php
// app/Http/Middleware/EnsureUserIsOwner.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsOwner
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || $request->user()->type !== 'owner') {
            return redirect()->route('dashboard.index')
                ->with('error', 'Access denied. Owner account required.');
        }

        return $next($request);
    }
}
