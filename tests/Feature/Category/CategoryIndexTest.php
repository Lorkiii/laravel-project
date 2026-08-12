<?php

namespace Tests\Feature\Category;

use App\Models\Category;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CategoryIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_guests_are_redirected_from_categories_index(): void
    {
        $this->get(route('categories.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_categories_index_with_created_categories(): void
    {
        $creator = User::factory()->create([
            'first_name' => 'Jordan',
            'last_name' => 'Admin',
            'username' => 'jordan',
        ]);
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        Category::create([
            'name' => 'Accessories',
            'code' => 'ACC',
            'description' => 'Accessory items',
            'created_by' => $creator->id,
        ]);

        $this->actingAs($user)
            ->get(route('categories.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Category/Index')
                ->has('categories', 1)
                ->where('categories.0.name', 'Accessories')
                ->where('categories.0.code', 'ACC')
                ->where('categories.0.status', 'active')
                ->where('categories.0.creator.name', 'Jordan Admin')
                ->where('categories.0.creator.username', 'jordan')
                ->has('categories.0.created_at')
                ->has('categories.0.updated_at')
            );
    }

    public function test_authenticated_user_without_category_permission_cannot_access_categories(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get(route('categories.index'))
            ->assertForbidden();
    }
}
