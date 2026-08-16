<?php

namespace Database\Seeders;

use App\Models\AuditEvent;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class ProductCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $creator = User::query()
            ->where('email', 'admin@example.com')
            ->first();

        $categories = $this->categories($creator);

        foreach ($this->products() as $attributes) {
            /** @var Category|null $category */
            $category = $categories->get($attributes['category_code']);

            if ($category === null) {
                continue;
            }

            $productAttributes = Product::factory()->make([
                ...Arr::except($attributes, 'category_code'),
                'category_id' => $category->id,
                'created_by' => $creator?->id,
            ])->getAttributes();

            $product = Product::query()->firstOrCreate(
                ['sku' => $attributes['sku']],
                Arr::except($productAttributes, 'sku'),
            );

            $this->ensureCreatedAudit(
                $creator,
                AuditEvent::SUBJECT_PRODUCT,
                $product,
                "{$product->name} ({$product->sku})",
            );
        }
    }

    /**
     * @return Collection<string, Category>
     */
    private function categories(?User $creator): Collection
    {
        if (Category::query()->exists()) {
            $categories = Category::query()->get()->keyBy('code');
            $categories->each(function (Category $category) use ($creator): void {
                $this->ensureCreatedAudit(
                    $creator,
                    AuditEvent::SUBJECT_CATEGORY,
                    $category,
                    "{$category->name} ({$category->code})",
                );
            });

            return $categories;
        }

        return collect([
            ['code' => 'LPTP', 'name' => 'LAPTOP', 'description' => 'Laptop computers.'],
            ['code' => 'KYBD', 'name' => 'Keyboard', 'description' => 'Computer keyboards.'],
            ['code' => 'EARPH', 'name' => 'Earphones', 'description' => 'Earphones and headphones.'],
            ['code' => 'MOU', 'name' => 'MOUSE', 'description' => 'Computer mice.'],
        ])->mapWithKeys(function (array $attributes) use ($creator) {
            $categoryAttributes = Category::factory()->make([
                ...$attributes,
                'is_active' => true,
                'created_by' => $creator?->id,
            ])->getAttributes();

            $category = Category::query()->firstOrCreate(
                ['code' => $attributes['code']],
                Arr::except($categoryAttributes, 'code'),
            );

            $this->ensureCreatedAudit(
                $creator,
                AuditEvent::SUBJECT_CATEGORY,
                $category,
                "{$category->name} ({$category->code})",
            );

            return [$attributes['code'] => $category];
        });
    }

    private function ensureCreatedAudit(
        ?User $actor,
        string $subjectType,
        Model $subject,
        string $label,
    ): void {
        if ($actor === null) {
            return;
        }

        $alreadyRecorded = AuditEvent::query()
            ->where('subject_type', $subjectType)
            ->where('subject_id', $subject->getKey())
            ->where('action', AuditEvent::ACTION_CREATED)
            ->exists();

        if ($alreadyRecorded) {
            return;
        }

        $seededByActor = (int) $subject->getAttribute('created_by') === $actor->id;

        if (! $subject->wasRecentlyCreated && ! $seededByActor) {
            return;
        }

        AuditEvent::record(
            $actor,
            AuditEvent::ACTION_CREATED,
            $subjectType,
            $subject,
            $label,
        );
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function products(): Collection
    {
        return collect([
            ['category_code' => 'LPTP', 'name' => 'ASUS A16', 'sku' => 'LPTP-ASUS-A16', 'brand' => 'Asus', 'model' => 'a16', 'description' => '16-inch everyday laptop.', 'price' => 76000.00, 'quantity' => 40, 'minimum_stock' => 10, 'status' => true],
            ['category_code' => 'LPTP', 'name' => 'ThinkPad E14 Laptop', 'sku' => 'LPTP-LENOVO-E14', 'brand' => 'Lenovo', 'model' => 'E14', 'description' => '14-inch business laptop.', 'price' => 54990.00, 'quantity' => 18, 'minimum_stock' => 5, 'status' => true],
            ['category_code' => 'LPTP', 'name' => 'HP 15s Laptop', 'sku' => 'LPTP-HP-15S', 'brand' => 'HP', 'model' => '15s', 'description' => '15-inch office laptop.', 'price' => 42990.00, 'quantity' => 3, 'minimum_stock' => 5, 'status' => true],
            ['category_code' => 'LPTP', 'name' => 'Inspiron 15 Laptop', 'sku' => 'LPTP-DELL-3511', 'brand' => 'Dell', 'model' => '3511', 'description' => '15-inch home and office laptop.', 'price' => 38990.00, 'quantity' => 0, 'minimum_stock' => 3, 'status' => true],

            ['category_code' => 'KYBD', 'name' => 'MX Keys Keyboard', 'sku' => 'KYBD-LOGITECH-MXKEYS', 'brand' => 'Logitech', 'model' => 'MX Keys', 'description' => 'Wireless full-size productivity keyboard.', 'price' => 5990.00, 'quantity' => 25, 'minimum_stock' => 8, 'status' => true],
            ['category_code' => 'KYBD', 'name' => 'Keychron K8 Keyboard', 'sku' => 'KYBD-KEYCHRON-K8', 'brand' => 'Keychron', 'model' => 'K8', 'description' => 'Wireless mechanical tenkeyless keyboard.', 'price' => 4490.00, 'quantity' => 8, 'minimum_stock' => 8, 'status' => true],
            ['category_code' => 'KYBD', 'name' => 'RK61 Keyboard', 'sku' => 'KYBD-ROYALKLUDGE-RK61', 'brand' => 'Royal Kludge', 'model' => 'RK61', 'description' => 'Compact 60-percent mechanical keyboard.', 'price' => 1890.00, 'quantity' => 12, 'minimum_stock' => 5, 'status' => true],
            ['category_code' => 'KYBD', 'name' => 'Kumara K552 Keyboard', 'sku' => 'KYBD-REDRAGON-K552', 'brand' => 'Redragon', 'model' => 'K552', 'description' => 'Wired mechanical gaming keyboard.', 'price' => 1290.00, 'quantity' => 0, 'minimum_stock' => 6, 'status' => true],

            ['category_code' => 'EARPH', 'name' => 'QKZ-AK6 PRO', 'sku' => 'EARPH-QKZ-AK6', 'brand' => 'QKZ', 'model' => 'AK6', 'description' => 'In-ear wired earphones.', 'price' => 700.00, 'quantity' => 100, 'minimum_stock' => 20, 'status' => true],
            ['category_code' => 'EARPH', 'name' => 'WF-C500 Earbuds', 'sku' => 'EARPH-SONY-WFC500', 'brand' => 'Sony', 'model' => 'WF-C500', 'description' => 'Wireless in-ear earbuds.', 'price' => 3490.00, 'quantity' => 15, 'minimum_stock' => 8, 'status' => true],
            ['category_code' => 'EARPH', 'name' => 'Tune 510BT Headphones', 'sku' => 'EARPH-JBL-TUNE510BT', 'brand' => 'JBL', 'model' => 'Tune 510BT', 'description' => 'Wireless on-ear headphones.', 'price' => 2490.00, 'quantity' => 4, 'minimum_stock' => 6, 'status' => true],
            ['category_code' => 'EARPH', 'name' => 'Life Q30 Headphones', 'sku' => 'EARPH-SOUNDCORE-LIFEQ30', 'brand' => 'Soundcore', 'model' => 'Life Q30', 'description' => 'Wireless noise-cancelling headphones.', 'price' => 3990.00, 'quantity' => 0, 'minimum_stock' => 5, 'status' => true],

            ['category_code' => 'MOU', 'name' => 'MX Master 3S Mouse', 'sku' => 'MOU-LOGITECH-MXMASTER3S', 'brand' => 'Logitech', 'model' => 'MX Master 3S', 'description' => 'Wireless ergonomic productivity mouse.', 'price' => 5490.00, 'quantity' => 20, 'minimum_stock' => 8, 'status' => true],
            ['category_code' => 'MOU', 'name' => 'DeathAdder Mouse', 'sku' => 'MOU-RAZER-DEATHADDER', 'brand' => 'Razer', 'model' => 'DeathAdder', 'description' => 'Wired ergonomic gaming mouse.', 'price' => 1290.00, 'quantity' => 2, 'minimum_stock' => 5, 'status' => true],
            ['category_code' => 'MOU', 'name' => 'M185 Mouse', 'sku' => 'MOU-LOGITECH-M185', 'brand' => 'Logitech', 'model' => 'M185', 'description' => 'Compact wireless office mouse.', 'price' => 490.00, 'quantity' => 30, 'minimum_stock' => 10, 'status' => true],
            ['category_code' => 'MOU', 'name' => 'Viper Mini Mouse', 'sku' => 'MOU-RAZER-VIPERMINI', 'brand' => 'Razer', 'model' => 'Viper Mini', 'description' => 'Lightweight wired gaming mouse.', 'price' => 1490.00, 'quantity' => 0, 'minimum_stock' => 4, 'status' => true],
        ]);
    }
}
