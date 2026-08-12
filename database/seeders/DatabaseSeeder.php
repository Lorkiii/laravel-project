<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'username' => 'admin',
                'first_name' => 'System',
                'last_name' => 'Administrator',
                'phone_number' => '1234567890',
                'password' => Hash::make('admin-password'),
                'is_active' => true,
            ],
        );

        $manager = User::query()->updateOrCreate(
            ['email' => 'manager@example.com'],
            [
                'username' => 'manager',
                'first_name' => 'Casey',
                'last_name' => 'Manager',
                'phone_number' => '1234567891',
                'password' => Hash::make('manager-password'),
                'is_active' => true,
            ],
        );

        $staff = User::query()->updateOrCreate(
            ['email' => 'staff@example.com'],
            [
                'username' => 'staff',
                'first_name' => 'Riley',
                'last_name' => 'Staff',
                'phone_number' => '1234567892',
                'password' => Hash::make('staff-password'),
                'is_active' => true,
            ],
        );

        $admin->syncRoles(['Administrator']);
        $manager->syncRoles(['Manager']);
        $staff->syncRoles(['Warehouse Staff']);

        $this->call(ProductCatalogSeeder::class);
    }
}
