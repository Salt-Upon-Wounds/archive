<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permission::create(['name' => 'create-exams']);

        $tutorRole = Role::create(['name' => 'tutor']);

        $tutorRole->givePermissionTo([
            'create-exams',
        ]);

        $user = User::first();

        $user->assignRole('tutor');
    }
}
