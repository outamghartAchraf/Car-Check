<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AdminMechanicController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can access mechanics.',
            ], 403);
        }

        $mechanics = User::where('role', 'mechanic')
            ->with('mechanicProfile')
            ->withCount('receivedReviews')
            ->withAvg('receivedReviews', 'rating')
            ->latest()
            ->get();

        return response()->json([
            'mechanics' => $mechanics,
        ]);
    }

 
    public function show(
        Request $request,
        User $mechanic
    ) {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can access mechanics.',
            ], 403);
        }

        if ($mechanic->role !== 'mechanic') {
            return response()->json([
                'message' => 'The selected user is not a mechanic.',
            ], 404);
        }

        $mechanic->load([
            'mechanicProfile',
            'receivedReviews.client:id,name,email',
        ]);

        $mechanic->loadCount('receivedReviews');
        $mechanic->loadAvg('receivedReviews', 'rating');

        return response()->json([
            'mechanic' => $mechanic,
        ]);
    }

  
    public function certify(
        Request $request,
        User $mechanic
    ) {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can certify mechanics.',
            ], 403);
        }

        if ($mechanic->role !== 'mechanic') {
            return response()->json([
                'message' => 'The selected user is not a mechanic.',
            ], 404);
        }

        $profile = $mechanic->mechanicProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'This mechanic does not have a profile.',
            ], 422);
        }

        $profile->update([
            'certification_status' => 'certified',
        ]);

        $mechanic->load('mechanicProfile');

        return response()->json([
            'message' => 'Mechanic certified successfully.',
            'mechanic' => $mechanic,
        ]);
    }

 
    public function reject(
        Request $request,
        User $mechanic
    ) {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can reject mechanics.',
            ], 403);
        }

        if ($mechanic->role !== 'mechanic') {
            return response()->json([
                'message' => 'The selected user is not a mechanic.',
            ], 404);
        }

        $profile = $mechanic->mechanicProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'This mechanic does not have a profile.',
            ], 422);
        }

        $profile->update([
            'certification_status' => 'rejected',
        ]);

        $mechanic->load('mechanicProfile');

        return response()->json([
            'message' => 'Mechanic certification rejected.',
            'mechanic' => $mechanic,
        ]);
    }
}
