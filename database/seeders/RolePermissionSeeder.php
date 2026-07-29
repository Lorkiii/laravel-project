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

            'reports.view',
            'reports.export',

            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission
            ]);
        }

        $admin = Role::firstOrCreate([
            'name' => 'Administrator'
        ]);

        $manager = Role::firstOrCreate([
            'name' => 'Manager'
        ]);

        $staff = Role::firstOrCreate([
            'name' => 'Warehouse Staff'
        ]);

        $admin->givePermissionTo(Permission::all());

        $manager->givePermissionTo([
            'products.view',
            'products.create',
            'products.edit',

            'categories.view',
            'categories.create',
            'categories.edit',

            'inventory.view',
            'inventory.adjust',

            'reports.view'
        ]);

        $staff->givePermissionTo([
            'products.view',
            'inventory.view'
        ]);
    }
}