<?php

use App\Models\User;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen as tenant', function () {
    $user = User::factory()->create(['type' => 'tenant', 'phone' => '07712345678']);

    $response = $this->post('/login', [
        'phone' => '07712345678',
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('dashboard.index'));
});

test('users can authenticate using the login screen as owner', function () {
    $user = User::factory()->create(['type' => 'owner', 'phone' => '07787654321']);

    $response = $this->post('/login', [
        'phone' => '07787654321',
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('owner.overview'));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create(['phone' => '07712345678']);

    $this->post('/login', [
        'phone' => '07712345678',
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
