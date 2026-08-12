<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class ProductCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $creatorId = User::query()
            ->where('email', 'admin@example.com')
            ->value('id');

        $categories = collect([
            ['code' => 'COMP', 'name' => 'Computers', 'description' => 'Desktop and laptop computers.'],
            ['code' => 'ACC', 'name' => 'Accessories', 'description' => 'Computer and workspace accessories.'],
            ['code' => 'NET', 'name' => 'Networking', 'description' => 'Network infrastructure and connectivity equipment.'],
            ['code' => 'PRINT', 'name' => 'Printing', 'description' => 'Printers, scanners, and related equipment.'],
            ['code' => 'STORE', 'name' => 'Storage', 'description' => 'Internal and external data storage devices.'],
        ])->mapWithKeys(function (array $attributes) use ($creatorId) {
            $categoryAttributes = Category::factory()->make([
                ...$attributes,
                'is_active' => true,
                'created_by' => $creatorId,
            ])->getAttributes();

            $category = Category::query()->updateOrCreate(
                ['code' => $attributes['code']],
                Arr::except($categoryAttributes, 'code'),
            );

            return [$attributes['code'] => $category];
        });

        foreach ($this->products() as $attributes) {
            /** @var Category $category */
            $category = $categories->get($attributes['category_code']);
            $productAttributes = Product::factory()->make([
                ...Arr::except($attributes, 'category_code'),
                'category_id' => $category->id,
                'created_by' => $creatorId,
            ])->getAttributes();

            $category->products()->updateOrCreate(
                ['sku' => $attributes['sku']],
                Arr::except($productAttributes, ['sku', 'category_id']),
            );
        }
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function products(): Collection
    {
        return collect([
            ['category_code' => 'COMP', 'name' => 'ThinkPad E14 Laptop', 'sku' => 'COMP-LENOVO-E14', 'brand' => 'Lenovo', 'model' => 'E14', 'description' => '14-inch business laptop.', 'price' => 899.00, 'quantity' => 18, 'minimum_stock' => 5, 'status' => true],
            ['category_code' => 'COMP', 'name' => 'ProBook 450 Laptop', 'sku' => 'COMP-HP-450G10', 'brand' => 'HP', 'model' => '450 G10', 'description' => '15-inch office laptop.', 'price' => 1049.00, 'quantity' => 4, 'minimum_stock' => 5, 'status' => true],
            ['category_code' => 'COMP', 'name' => 'OptiPlex Micro Desktop', 'sku' => 'COMP-DELL-7010M', 'brand' => 'Dell', 'model' => '7010 Micro', 'description' => 'Compact business desktop computer.', 'price' => 779.00, 'quantity' => 0, 'minimum_stock' => 3, 'status' => true],
            ['category_code' => 'COMP', 'name' => 'Mac mini', 'sku' => 'COMP-APPLE-M4', 'brand' => 'Apple', 'model' => 'M4', 'description' => 'Compact desktop for creative and office workflows.', 'price' => 699.00, 'quantity' => 9, 'minimum_stock' => 3, 'status' => true],

            ['category_code' => 'ACC', 'name' => 'MX Keys Keyboard', 'sku' => 'ACC-LOGI-MXKEYS', 'brand' => 'Logitech', 'model' => 'MX Keys', 'description' => 'Wireless full-size productivity keyboard.', 'price' => 119.99, 'quantity' => 32, 'minimum_stock' => 10, 'status' => true],
            ['category_code' => 'ACC', 'name' => 'MX Master Mouse', 'sku' => 'ACC-LOGI-MX3S', 'brand' => 'Logitech', 'model' => 'MX Master 3S', 'description' => 'Wireless ergonomic productivity mouse.', 'price' => 99.99, 'quantity' => 10, 'minimum_stock' => 10, 'status' => true],
            ['category_code' => 'ACC', 'name' => 'USB-C Dock', 'sku' => 'ACC-DELL-WD19S', 'brand' => 'Dell', 'model' => 'WD19S', 'description' => 'USB-C docking station for office workstations.', 'price' => 229.00, 'quantity' => 7, 'minimum_stock' => 4, 'status' => true],
            ['category_code' => 'ACC', 'name' => 'Noise-Cancelling Headset', 'sku' => 'ACC-JABRA-EVOLVE2', 'brand' => 'Jabra', 'model' => 'Evolve2 65', 'description' => 'Wireless headset for calls and focused work.', 'price' => 249.00, 'quantity' => 0, 'minimum_stock' => 6, 'status' => true],

            ['category_code' => 'NET', 'name' => '24-Port Managed Switch', 'sku' => 'NET-CISCO-CBS250', 'brand' => 'Cisco', 'model' => 'CBS250-24T-4G', 'description' => 'Managed gigabit switch for small business networks.', 'price' => 329.00, 'quantity' => 6, 'minimum_stock' => 2, 'status' => true],
            ['category_code' => 'NET', 'name' => 'Wi-Fi 6 Access Point', 'sku' => 'NET-UBNT-U6PRO', 'brand' => 'Ubiquiti', 'model' => 'U6 Pro', 'description' => 'Ceiling-mounted Wi-Fi 6 access point.', 'price' => 189.00, 'quantity' => 2, 'minimum_stock' => 4, 'status' => true],
            ['category_code' => 'NET', 'name' => 'Gigabit VPN Router', 'sku' => 'NET-TPER605', 'brand' => 'TP-Link', 'model' => 'ER605', 'description' => 'Multi-WAN business VPN router.', 'price' => 79.99, 'quantity' => 14, 'minimum_stock' => 3, 'status' => true],
            ['category_code' => 'NET', 'name' => 'Cat6 Patch Cable', 'sku' => 'NET-CABLE-CAT6-3M', 'brand' => 'Cable Matters', 'model' => 'CAT6-3M', 'description' => 'Three-meter Cat6 Ethernet patch cable.', 'price' => 8.99, 'quantity' => 75, 'minimum_stock' => 20, 'status' => true],

            ['category_code' => 'PRINT', 'name' => 'LaserJet Pro Printer', 'sku' => 'PRINT-HP-4003DN', 'brand' => 'HP', 'model' => '4003dn', 'description' => 'Duplex monochrome network laser printer.', 'price' => 389.00, 'quantity' => 5, 'minimum_stock' => 2, 'status' => true],
            ['category_code' => 'PRINT', 'name' => 'EcoTank Color Printer', 'sku' => 'PRINT-EPSON-L5290', 'brand' => 'Epson', 'model' => 'L5290', 'description' => 'Refillable color multifunction printer.', 'price' => 349.00, 'quantity' => 1, 'minimum_stock' => 2, 'status' => true],
            ['category_code' => 'PRINT', 'name' => 'Document Scanner', 'sku' => 'PRINT-BROTHER-ADS3100', 'brand' => 'Brother', 'model' => 'ADS-3100', 'description' => 'High-speed duplex document scanner.', 'price' => 399.00, 'quantity' => 3, 'minimum_stock' => 2, 'status' => true],
            ['category_code' => 'PRINT', 'name' => 'Thermal Label Printer', 'sku' => 'PRINT-ZEBRA-ZD421', 'brand' => 'Zebra', 'model' => 'ZD421', 'description' => 'Desktop direct thermal label printer.', 'price' => 459.00, 'quantity' => 0, 'minimum_stock' => 2, 'status' => true],

            ['category_code' => 'STORE', 'name' => 'Portable SSD 1TB', 'sku' => 'STORE-SAMSUNG-T7-1TB', 'brand' => 'Samsung', 'model' => 'T7 1TB', 'description' => 'Portable USB-C solid-state drive.', 'price' => 109.99, 'quantity' => 24, 'minimum_stock' => 8, 'status' => true],
            ['category_code' => 'STORE', 'name' => 'Desktop Hard Drive 4TB', 'sku' => 'STORE-WD-BLUE4TB', 'brand' => 'Western Digital', 'model' => 'Blue 4TB', 'description' => 'Internal 3.5-inch desktop hard drive.', 'price' => 89.99, 'quantity' => 8, 'minimum_stock' => 8, 'status' => true],
            ['category_code' => 'STORE', 'name' => 'NVMe SSD 2TB', 'sku' => 'STORE-CRUCIAL-P3-2TB', 'brand' => 'Crucial', 'model' => 'P3 2TB', 'description' => 'PCIe NVMe internal solid-state drive.', 'price' => 139.99, 'quantity' => 13, 'minimum_stock' => 5, 'status' => true],
            ['category_code' => 'STORE', 'name' => 'USB Flash Drive 128GB', 'sku' => 'STORE-SANDISK-128GB', 'brand' => 'SanDisk', 'model' => 'Ultra 128GB', 'description' => 'USB 3.0 portable flash drive.', 'price' => 19.99, 'quantity' => 0, 'minimum_stock' => 15, 'status' => true],
        ]);
    }
}
