<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Vehicle;


class AdminClientController extends Controller
{
        public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can access clients.',
            ], 403);
        }

        $clients = User::where('role', 'client')
            ->withCount([
                'vehicles',
                'inspectionRequests',
                'clientAppointments',
            ])
            ->withCount([
                'inspectionRequests as completed_inspections_count' => function ($query) {
                    $query->where('status', 'completed');
                },
            ])
            ->latest()
            ->get([
                'id',
                'name',
                'email',
                'created_at',
            ]);

        return response()->json([
            'clients' => $clients,
        ]);
    }

    public function show(Request $request, User $client)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can access clients.',
            ], 403);
        }

        if ($client->role !== 'client') {
            return response()->json([
                'message' => 'The selected user is not a client.',
            ], 404);
        }

        $client->load([
            'vehicles',
            'inspectionRequests.vehicle',
            'inspectionRequests.mechanic:id,name,email',
            'clientAppointments.mechanic:id,name,email',
            'clientAppointments.inspectionRequest.vehicle',
        ]);

        $client->loadCount([
            'vehicles',
            'inspectionRequests',
            'clientAppointments',
        ]);

        return response()->json([
            'client' => $client,
        ]);
    }
}
