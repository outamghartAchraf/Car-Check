<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MechanicProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'mechanic') {
            return response()->json([
                'message' => 'Only mechanics can access this profile.',
            ], 403);
        }

        $profile = $user->mechanicProfile;

        return response()->json([
            'profile' => $profile,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'mechanic') {
            return response()->json([
                'message' => 'Only mechanics can create a mechanic profile.',
            ], 403);
        }

        if ($user->mechanicProfile) {
            return response()->json([
                'message' => 'Mechanic profile already exists.',
            ], 422);
        }

        $validated = $request->validate([
            'phone' => ['nullable', 'string', 'max:30'],
            'city' => ['required', 'string', 'max:100'],
            'specialization' => ['nullable', 'string', 'max:150'],
            'experience_years' => ['required', 'integer', 'min:0', 'max:60'],
            'certification_number' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:2000'],
        ]);

        $profile = $user->mechanicProfile()->create([
            ...$validated,
            'certification_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Mechanic profile created successfully.',
            'profile' => $profile,
        ], 201);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'mechanic') {
            return response()->json([
                'message' => 'Only mechanics can update this profile.',
            ], 403);
        }

        $profile = $user->mechanicProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'Mechanic profile not found.',
            ], 404);
        }

        $validated = $request->validate([
            'phone' => ['nullable', 'string', 'max:30'],
            'city' => ['sometimes', 'required', 'string', 'max:100'],
            'specialization' => ['nullable', 'string', 'max:150'],
            'experience_years' => ['sometimes', 'required', 'integer', 'min:0', 'max:60'],
            'certification_number' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:2000'],
        ]);

        $profile->update($validated);

        return response()->json([
            'message' => 'Mechanic profile updated successfully.',
            'profile' => $profile->fresh(),
        ]);
    }
}
