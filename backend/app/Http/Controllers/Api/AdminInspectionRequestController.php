<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InspectionRequest;

class AdminInspectionRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can access inspection requests.',
            ], 403);
        }

        $requests = InspectionRequest::with([
            'client:id,name,email',
            'vehicle',
            'mechanic:id,name,email',
            'appointment',
        ])
            ->latest()
            ->get();

        return response()->json([
            'inspection_requests' => $requests,
        ]);
    }

    public function show(
        Request $request,
        InspectionRequest $inspectionRequest
    ) {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can access inspection requests.',
            ], 403);
        }

        $inspectionRequest->load([
            'client:id,name,email',
            'vehicle',
            'mechanic:id,name,email',
            'appointment',
            'inspectionReport',
        ]);

        return response()->json([
            'inspection_request' => $inspectionRequest,
        ]);
    }
}
