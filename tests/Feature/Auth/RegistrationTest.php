<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register as tenant', function () {
    $response = $this->post('/register', [
        'full_name' => 'Test User',
        'phone' => '07712345678',
        'email' => 'test@example.com',
        'type' => 'tenant',
        'governorate' => 'Amman',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard.index'));
});

test('new users can register as owner', function () {
    $response = $this->post('/register', [
        'full_name' => 'Test Owner',
        'phone' => '07787654321',
        'email' => 'owner@example.com',
        'type' => 'owner',
        'governorate' => 'Amman',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('owner.overview'));
});
