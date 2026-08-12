<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'sku' => strtoupper(fake()->unique()->bothify('PRD-####-??')),
            'category_id' => Category::factory(),
            'brand' => fake()->company(),
            'model' => strtoupper(fake()->bothify('??-###')),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 5, 2500),
            'quantity' => fake()->numberBetween(0, 100),
            'minimum_stock' => fake()->numberBetween(1, 15),
            'status' => true,
            'created_by' => null,
        ];
    }
}
