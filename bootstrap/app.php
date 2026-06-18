<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // Inertia shared data على كل طلب web
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->redirectGuestsTo(fn (\Illuminate\Http\Request $request) =>
            $request->is('admin*') ? route('admin.login') : route('login')
        );

        // Aliases مختصرة للاستخدام في Routes
        $middleware->alias([
            'owner'      => \App\Http\Middleware\EnsureUserIsOwner::class,
            'tenant'     => \App\Http\Middleware\EnsureUserIsTenant::class,
            'active'     => \App\Http\Middleware\EnsureUserIsActive::class,
            'kyc'        => \App\Http\Middleware\EnsureKycVerified::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();