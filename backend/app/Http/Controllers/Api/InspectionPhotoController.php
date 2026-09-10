<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InspectionPhoto;
use App\Models\InspectionRequest;
use App\Models\InspectionReport;
use Illuminate\Support\Facades\Storage;

class InspectionPhotoController extends Controller
{
    public function index(InspectionRequest $inspectionRequest)
    {
        $user = request()->user();

        // Client can only see his own request
        if (
            $user->role === 'client' &&
            $inspectionRequest->client_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        // Mechanic can only see requests assigned to him
        if (
            $user->role === 'mechanic' &&
            $inspectionRequest->mechanic_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $photos = $inspectionRequest->photos()
            ->with('uploader:id,name')
            ->latest()
            ->get();

        return response()->json([
            'photos' => $photos,
        ]);
    }


    public function store(Request $request, InspectionRequest $inspectionRequest)
    {
        $user = $request->user();

        // Client can upload to his own request
        $isClient = (
            $user->role === 'client' &&
            $inspectionRequest->client_id === $user->id
        );

        // Mechanic can upload to an assigned request
        $isMechanic = (
            $user->role === 'mechanic' &&
            $inspectionRequest->mechanic_id === $user->id
        );

        if (!$isClient && !$isMechanic) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'photo' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120',
            ],
            'description' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $path = $request->file('photo')
            ->store('inspection-photos', 'public');

        $photo = InspectionPhoto::create([
            'inspection_request_id' => $inspectionRequest->id,
            'inspection_report_id' => null,
            'uploaded_by' => $user->id,
            'photo_path' => $path,
            'description' => $validated['description'] ?? null,
        ]);

        $photo->load('uploader:id,name');

        return response()->json([
            'message' => 'Photo uploaded successfully.',
            'photo' => $photo,
        ], 201);
    }


    public function destroy(InspectionPhoto $inspectionPhoto)
    {
        $user = request()->user();

        // Only the person who uploaded the photo can delete it
        if ($inspectionPhoto->uploaded_by !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        if (
            $inspectionPhoto->photo_path &&
            Storage::disk('public')->exists($inspectionPhoto->photo_path)
        ) {
            Storage::disk('public')
                ->delete($inspectionPhoto->photo_path);
        }

        $inspectionPhoto->delete();

        return response()->json([
            'message' => 'Photo deleted successfully.',
        ]);
    }


    public function storeForReport(
        Request $request,
        InspectionReport $inspectionReport
    ) {
        $user = $request->user();
        $inspectionReport->load('appointment');


        // Only the mechanic who created the report can upload
        if (
            $user->role !== 'mechanic' ||
            $inspectionReport->appointment?->mechanic_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }
        $validated = $request->validate([
            'photo' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120',
            ],
            'description' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $path = $request->file('photo')
            ->store('inspection-photos', 'public');

        $photo = InspectionPhoto::create([
            'inspection_request_id' => $inspectionReport->inspection_request_id,
            'inspection_report_id' => $inspectionReport->id,
            'uploaded_by' => $user->id,
            'photo_path' => $path,
            'description' => $validated['description'] ?? null,
        ]);

        $photo->load('uploader:id,name');

        return response()->json([
            'message' => 'Inspection photo uploaded successfully.',
            'photo' => $photo,
        ], 201);
    }
}
