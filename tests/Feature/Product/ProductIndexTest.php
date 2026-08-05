<?php

namespace Tests\Feature\Product;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_guests_are_redirected_from_products_index(): void
    {
        $this->get(route('products.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_products_index(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        $this->actingAs($user)
            ->get(route('products.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Product/Index')
            );
    }
}
