<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\InspectionRequest;
use App\Models\Vehicle;


class InspectionRequestSeeder extends Seeder
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

        $vehicle = Vehicle::where(
            'user_id',
            $client?->id
        )->first();

        if (!$client || !$vehicle) {
            return;
        }

        InspectionRequest::updateOrCreate(
            [
                'client_id' => $client->id,
                'vehicle_id' => $vehicle->id,
            ],
            [
                'package' => 'complete',

                'location' =>
                    'Beni Mellal',

                'description' =>
                    'I want a complete inspection before buying the vehicle.',

                'preferred_date' =>
                    now()->addDays(3)->toDateString(),

                'preferred_time' =>
                    '10:00',

                'status' =>
                    'pending',
            ]
        );
    
    }
}
