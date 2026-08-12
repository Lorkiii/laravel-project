<?php

namespace Tests\Feature\Category;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_guests_cannot_store_categories(): void
    {
        $this->post(route('categories.store'), [
            'name' => 'Accessories',
            'code' => 'ACC',
            'description' => 'Accessory items',
        ])->assertRedirect(route('login'));
    }

    public function test_users_without_permission_cannot_store_categories(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Warehouse Staff');

        $this->actingAs($user)
            ->post(route('categories.store'), [
                'name' => 'Accessories',
                'code' => 'ACC',
                'description' => 'Accessory items',
            ])
            ->assertForbidden();
    }

    public function test_authenticated_user_can_store_a_category(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Administrator');

        $this->actingAs($user)
            ->post(route('categories.store'), [
                'name' => 'Accessories',
                'code' => 'ACC',
                'description' => 'Accessory items',
            ])
            ->assertRedirect(route('categories.index'))
            ->assertInertiaFlash('successModal', [
                'title' => 'Category created',
                'description' => 'Your category was added successfully.',
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Accessories',
            'code' => 'ACC',
            'description' => 'Accessory items',
            'created_by' => $user->id,
        ]);
    }

    public function test_manager_cannot_store_categories(): void
    {
        $manager = User::factory()->create([
            'is_active' => true,
        ]);
        $manager->assignRole('Manager');

        $this->actingAs($manager)
            ->post(route('categories.store'), [
                'name' => 'Accessories',
                'code' => 'ACC',
                'description' => 'Accessory items',
            ])
            ->assertForbidden();
    }
}
