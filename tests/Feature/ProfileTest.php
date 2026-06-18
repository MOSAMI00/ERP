<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/user/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create([
        'full_name' => 'Old Name',
        'phone' => '1234567890',
        'governorate' => 'Cairo',
    ]);

    $response = $this
        ->actingAs($user)
        ->put('/user/profile', [
            'full_name' => 'New Name',
            'phone' => '0987654321',
            'governorate' => 'Alexandria',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $user->refresh();

    $this->assertSame('New Name', $user->full_name);
    $this->assertSame('0987654321', $user->phone);
    $this->assertSame('Alexandria', $user->governorate);
});
