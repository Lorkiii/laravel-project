<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_guests_are_redirected_from_account_settings(): void
    {
        $this->get(route('settings.account'))->assertRedirect(route('login'));
        $this->patch(route('settings.account.update'))->assertRedirect(route('login'));
        $this->put(route('settings.account.password'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_account_settings(): void
    {
        $user = User::factory()->create([
            'email' => 'casey@example.com',
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        $this->actingAs($user)
            ->get(route('settings.account'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Settings/Account')
                ->where('account.email', 'casey@example.com')
                ->where('account.roles', ['Manager'])
                ->has('account.first_name')
                ->has('account.last_name')
                ->has('account.username')
                ->has('account.phone_number')
            );
    }

    public function test_authenticated_user_can_update_account_profile(): void
    {
        $user = User::factory()->create([
            'first_name' => 'Casey',
            'last_name' => 'Manager',
            'username' => 'casey',
            'email' => 'casey@example.com',
            'phone_number' => null,
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        $this->actingAs($user)
            ->patch(route('settings.account.update'), [
                'first_name' => 'Casey',
                'last_name' => 'Updated',
                'username' => 'casey.updated',
                'email' => 'casey.updated@example.com',
                'phone_number' => '555-0100',
            ])
            ->assertRedirect(route('settings.account'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'first_name' => 'Casey',
            'last_name' => 'Updated',
            'username' => 'casey.updated',
            'email' => 'casey.updated@example.com',
            'phone_number' => '555-0100',
        ]);
    }

    public function test_account_update_rejects_duplicate_email(): void
    {
        $existing = User::factory()->create([
            'email' => 'taken@example.com',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'email' => 'casey@example.com',
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        $this->actingAs($user)
            ->patch(route('settings.account.update'), [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'username' => $user->username,
                'email' => $existing->email,
                'phone_number' => null,
            ])
            ->assertSessionHasErrors('email');
    }

    public function test_authenticated_user_can_update_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password12345'),
            'is_active' => true,
        ]);
        $user->assignRole('Warehouse Staff');

        $this->actingAs($user)
            ->put(route('settings.account.password'), [
                'current_password' => 'password12345',
                'password' => 'new-password-123',
                'password_confirmation' => 'new-password-123',
            ])
            ->assertRedirect(route('settings.account'))
            ->assertSessionHas('success');

        $user->refresh();

        $this->assertTrue(Hash::check('new-password-123', $user->password));
    }

    public function test_password_update_rejects_incorrect_current_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password12345'),
            'is_active' => true,
        ]);
        $user->assignRole('Warehouse Staff');

        $this->actingAs($user)
            ->put(route('settings.account.password'), [
                'current_password' => 'wrong-password',
                'password' => 'new-password-123',
                'password_confirmation' => 'new-password-123',
            ])
            ->assertSessionHasErrors('current_password');
    }
}
