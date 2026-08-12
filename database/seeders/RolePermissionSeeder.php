<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            'products.view',
            'products.create',
            'products.edit',
            'products.delete',

            'categories.view',
            'categories.create',
            'categories.edit',
            'categories.delete',

            'suppliers.view',
            'suppliers.create',
            'suppliers.edit',
            'suppliers.delete',

            'inventory.view',
            'inventory.adjust',
            'inventory.stock_out',

            'reports.view',
            'reports.export',

            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
            ]);
        }

        $admin = Role::firstOrCreate([
            'name' => 'Administrator',
        ]);

        $manager = Role::firstOrCreate([
            'name' => 'Manager',
        ]);

        $staff = Role::firstOrCreate([
            'name' => 'Warehouse Staff',
        ]);

        $admin->syncPermissions(Permission::all());

        $manager->syncPermissions([
            'products.view',
            'products.create',
            'products.edit',

            'categories.view',

            'inventory.view',
            'inventory.adjust',
            'inventory.stock_out',

            'reports.view',
        ]);

        $staff->syncPermissions([
            'products.view',
            'inventory.view',
            'inventory.stock_out',
        ]);
    }
}
