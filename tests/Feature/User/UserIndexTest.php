<?php

namespace Tests\Feature\User;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_guests_are_redirected_from_users_index(): void
    {
        $this->get(route('users.index'))->assertRedirect(route('login'));
    }

    public function test_administrator_can_view_users_index(): void
    {
        $admin = User::factory()->create([
            'first_name' => 'Taylor',
            'last_name' => 'Admin',
            'username' => 'taylor',
            'email' => 'taylor@example.com',
            'is_active' => true,
        ]);
        $admin->assignRole('Administrator');

        $staff = User::factory()->create([
            'first_name' => 'Riley',
            'last_name' => 'Staff',
            'username' => 'riley',
            'email' => 'riley@example.com',
            'is_active' => false,
        ]);
        $staff->assignRole('Warehouse Staff');

        $this->actingAs($admin)
            ->get(route('users.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Users/Index')
                ->has('users', 2)
                ->where('users.0.email', 'taylor@example.com')
                ->where('users.0.name', 'Taylor Admin')
                ->where('users.0.username', 'taylor')
                ->where('users.0.role', 'Administrator')
                ->where('users.0.status', 'active')
                ->where('users.1.email', 'riley@example.com')
                ->where('users.1.role', 'Warehouse Staff')
                ->where('users.1.status', 'inactive')
                ->has('users.0.created_at')
                ->has('users.0.updated_at')
                ->where('roles', [
                    ['value' => 'Administrator', 'label' => 'Admin'],
                    ['value' => 'Manager', 'label' => 'Manager'],
                    ['value' => 'Warehouse Staff', 'label' => 'Staff'],
                ])
                ->missing('users.0.password')
            );
    }

    public function test_manager_cannot_access_users_index(): void
    {
        $manager = User::factory()->create([
            'is_active' => true,
        ]);
        $manager->assignRole('Manager');

        $this->actingAs($manager)
            ->get(route('users.index'))
            ->assertForbidden();
    }

    public function test_warehouse_staff_cannot_access_users_index(): void
    {
        $staff = User::factory()->create([
            'is_active' => true,
        ]);
        $staff->assignRole('Warehouse Staff');

        $this->actingAs($staff)
            ->get(route('users.index'))
            ->assertForbidden();
    }

    public function test_authenticated_user_without_permission_cannot_access_users(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get(route('users.index'))
            ->assertForbidden();
    }
}
