<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Vehicle;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $client = User::where(
            'email',
            'client@gmail.com'
        )->first();

        if (!$client) {
            return;
        }

        Vehicle::updateOrCreate(
            [
                'user_id' => $client->id,
                'registration_number' => '12345-A-1',
            ],
            [
                'brand' => 'Volkswagen',
                'model' => 'Golf 7',
                'year' => 2018,
                'mileage' => 125000,
                'fuel_type' => 'diesel',
                'transmission' => 'manual',
            ]
        );

        Vehicle::updateOrCreate(
            [
                'user_id' => $client->id,
                'registration_number' => '54321-B-2',
            ],
            [
                'brand' => 'Renault',
                'model' => 'Clio 4',
                'year' => 2020,
                'mileage' => 78000,
                'fuel_type' => 'diesel',
                'transmission' => 'manual',
            ]
        );
    
    }
}
