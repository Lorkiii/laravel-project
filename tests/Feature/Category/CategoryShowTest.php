<?php

namespace Tests\Feature\Category;

use App\Models\Category;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CategoryShowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_authorized_user_can_view_category_details_and_metadata(): void
    {
        $creator = User::factory()->create([
            'first_name' => 'Jordan',
            'last_name' => 'Admin',
            'username' => 'jordan',
        ]);
        $manager = User::factory()->create();
        $manager->assignRole('Manager');
        $category = Category::factory()->create([
            'name' => 'Networking',
            'code' => 'NET',
            'description' => 'Networking equipment',
            'is_active' => false,
            'created_by' => $creator->id,
        ]);

        $this->actingAs($manager)
            ->get(route('categories.show', $category))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Category/Show')
                ->where('category.name', 'Networking')
                ->where('category.code', 'NET')
                ->where('category.description', 'Networking equipment')
                ->where('category.status', 'inactive')
                ->where('category.creator.name', 'Jordan Admin')
                ->where('category.creator.username', 'jordan')
                ->has('category.created_at')
                ->has('category.updated_at')
            );
    }

    public function test_category_details_handle_legacy_records_without_a_creator(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manager');
        $category = Category::factory()->create(['created_by' => null]);

        $this->actingAs($manager)
            ->get(route('categories.show', $category))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('category.creator', null)
            );
    }

    public function test_user_without_category_view_permission_cannot_view_details(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');
        $category = Category::factory()->create();

        $this->actingAs($staff)
            ->get(route('categories.show', $category))
            ->assertForbidden();
    }
}
