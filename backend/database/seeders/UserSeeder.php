<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@carcheck.test'],
            [
                'name' => 'CarCheck Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('achrafachraf'),
                'role' => 'admin',
            ]
        );

        // Mechanic 1
        User::updateOrCreate(
            ['email' => 'mechanic@carcheck.test'],
            [
                'name' => 'Ahmed Mechanic',
                'email' => 'mechanic@gmail.com',
                'password' => Hash::make('achrafachraf'),
                'role' => 'mechanic',
            ]
        );

        // Mechanic 2
        User::updateOrCreate(
            ['email' => 'mechanic2@carcheck.test'],
            [
                'name' => 'Youssef Mechanic',
                'email' => 'mechanic2@gmail.com',
                'password' => Hash::make('achrafachraf'),
                'role' => 'mechanic',
            ]
        );

        // Client 1
        User::updateOrCreate(
            ['email' => 'client@carcheck.test'],
            [
                'name' => 'Achraf Client',
                'email' => 'client@gmail.com',
                'password' => Hash::make('achrafachraf'),
                'role' => 'client',
            ]
        );

        // Client 2
        User::updateOrCreate(
            ['email' => 'client2@carcheck.test'],
            [
                'name' => 'Omar Client',
                'email' => 'client2@gmail.com',
                'password' => Hash::make('achrafachraf'),
                'role' => 'client',
            ]
        );
    }
}