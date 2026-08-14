<?php

namespace Tests\Feature\User;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Support\SessionKey;
use Tests\TestCase;

class UserStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    /**
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Alex',
            'last_name' => 'Rivera',
            'username' => 'alex.rivera',
            'email' => 'alex.rivera@example.com',
            'phone_number' => '5550100',
            'role' => User::ROLE_STAFF,
            'is_active' => true,
        ], $overrides);
    }

    public function test_guests_cannot_store_users(): void
    {
        $this->post(route('users.store'), $this->validPayload())
            ->assertRedirect(route('login'));
    }

    public function test_manager_cannot_store_users(): void
    {
        $manager = User::factory()->create([
            'is_active' => true,
        ]);
        $manager->assignRole('Manager');

        $this->actingAs($manager)
            ->post(route('users.store'), $this->validPayload())
            ->assertForbidden();

        $this->assertDatabaseMissing('users', [
            'email' => 'alex.rivera@example.com',
        ]);
    }

    public function test_warehouse_staff_cannot_store_users(): void
    {
        $staff = User::factory()->create([
            'is_active' => true,
        ]);
        $staff->assignRole('Warehouse Staff');

        $this->actingAs($staff)
            ->post(route('users.store'), $this->validPayload())
            ->assertForbidden();
    }

    public function test_administrator_can_create_a_user_for_each_assignable_role(): void
    {
        $admin = User::factory()->create([
            'is_active' => true,
        ]);
        $admin->assignRole('Administrator');

        foreach (User::ASSIGNABLE_ROLES as $index => $role) {
            $email = "new-user-{$index}@example.com";
            $username = "newuser{$index}";

            $this->actingAs($admin)
                ->post(route('users.store'), $this->validPayload([
                    'username' => $username,
                    'email' => $email,
                    'role' => $role,
                ]))
                ->assertRedirect(route('users.index'))
                ->assertInertiaFlash('createdUserCredentials');

            $created = User::query()->where('email', $email)->first();

            $this->assertNotNull($created);
            $this->assertTrue($created->hasRole($role));
            $this->assertTrue($created->is_active);
        }
    }

    public function test_created_user_credentials_are_flashed_once_and_password_is_hashed(): void
    {
        $admin = User::factory()->create([
            'is_active' => true,
        ]);
        $admin->assignRole('Administrator');

        $response = $this->actingAs($admin)
            ->post(route('users.store'), $this->validPayload());

        $response
            ->assertRedirect(route('users.index'))
            ->assertInertiaFlash('createdUserCredentials');

        $credentials = session(SessionKey::FLASH_DATA)['createdUserCredentials'] ?? null;

        $this->assertIsArray($credentials);
        $this->assertSame('alex.rivera@example.com', $credentials['email']);
        $this->assertSame('alex.rivera', $credentials['username']);
        $this->assertNotEmpty($credentials['password']);

        $created = User::query()->where('email', 'alex.rivera@example.com')->first();

        $this->assertNotNull($created);
        $this->assertNotSame($credentials['password'], $created->getRawOriginal('password'));
        $this->assertTrue(Hash::check($credentials['password'], $created->password));
        $this->assertDatabaseMissing('users', [
            'email' => 'alex.rivera@example.com',
            'password' => $credentials['password'],
        ]);
        $this->assertTrue($created->hasRole(User::ROLE_STAFF));
    }

    public function test_flashed_credentials_can_be_used_to_sign_in(): void
    {
        $admin = User::factory()->create([
            'is_active' => true,
        ]);
        $admin->assignRole('Administrator');

        $this->actingAs($admin)
            ->post(route('users.store'), $this->validPayload());

        $credentials = session(SessionKey::FLASH_DATA)['createdUserCredentials'];

        $this->post(route('logout'));

        $this->post('/login', [
            'email' => $credentials['email'],
            'password' => $credentials['password'],
            'remember' => false,
        ])->assertRedirect(route('dashboard'));

        $this->assertAuthenticated();
    }

    public function test_store_user_requires_valid_fields(): void
    {
        $admin = User::factory()->create([
            'is_active' => true,
        ]);
        $admin->assignRole('Administrator');

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->post(route('users.store'), [])
            ->assertRedirect(route('users.index'))
            ->assertSessionHasErrors([
                'first_name',
                'last_name',
                'username',
                'email',
                'role',
                'is_active',
            ]);
    }

    public function test_store_user_rejects_unknown_roles(): void
    {
        $admin = User::factory()->create([
            'is_active' => true,
        ]);
        $admin->assignRole('Administrator');

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->post(route('users.store'), $this->validPayload([
                'role' => 'Super Admin',
            ]))
            ->assertRedirect(route('users.index'))
            ->assertSessionHasErrors('role');

        $this->assertDatabaseMissing('users', [
            'email' => 'alex.rivera@example.com',
        ]);
    }

    public function test_store_user_rejects_duplicate_email_and_username(): void
    {
        $admin = User::factory()->create([
            'is_active' => true,
        ]);
        $admin->assignRole('Administrator');

        User::factory()->create([
            'username' => 'alex.rivera',
            'email' => 'alex.rivera@example.com',
        ]);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->post(route('users.store'), $this->validPayload())
            ->assertRedirect(route('users.index'))
            ->assertSessionHasErrors(['username', 'email']);
    }
}
