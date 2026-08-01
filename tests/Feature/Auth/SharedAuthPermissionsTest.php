<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SharedAuthPermissionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_administrator_receives_role_and_permissions_in_shared_auth_props(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'is_active' => true,
        ]);
        $user->assignRole('Administrator');

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('auth.user.roles', ['Administrator'])
                ->has('auth.user.permissions')
                ->where('auth.user.permissions', fn ($permissions) => collect($permissions)->contains('products.view')
                    && collect($permissions)->contains('users.view')
                    && collect($permissions)->contains('inventory.view')
                    && collect($permissions)->contains('reports.view')
                    && collect($permissions)->contains('suppliers.view'))
            );
    }

    public function test_manager_receives_expected_shared_permissions_without_users_access(): void
    {
        $user = User::factory()->create([
            'email' => 'manager@example.com',
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('auth.user.roles', ['Manager'])
                ->where('auth.user.permissions', fn ($permissions) => collect($permissions)->contains('products.view')
                    && collect($permissions)->contains('categories.view')
                    && collect($permissions)->contains('inventory.view')
                    && collect($permissions)->contains('reports.view')
                    && ! collect($permissions)->contains('users.view')
                    && ! collect($permissions)->contains('suppliers.view'))
            );
    }

    public function test_warehouse_staff_receives_limited_shared_permissions(): void
    {
        $user = User::factory()->create([
            'email' => 'staff@example.com',
            'is_active' => true,
        ]);
        $user->assignRole('Warehouse Staff');

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('auth.user.roles', ['Warehouse Staff'])
                ->where('auth.user.permissions', fn ($permissions) => collect($permissions)->contains('products.view')
                    && collect($permissions)->contains('inventory.view')
                    && ! collect($permissions)->contains('reports.view')
                    && ! collect($permissions)->contains('users.view')
                    && ! collect($permissions)->contains('categories.view'))
            );
    }

    public function test_user_without_role_has_empty_shared_permissions(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('auth.user.roles', [])
                ->where('auth.user.permissions', [])
            );
    }
}
