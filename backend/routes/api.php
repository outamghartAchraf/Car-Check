<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\InspectionRequestController;

Route::middleware('auth:sanctum')->group(function () {

    // Authenticated User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Vehicles
    Route::apiResource(
        'vehicles',
        VehicleController::class
    );

    // Inspection Requests
    Route::get(
        '/inspection-requests',
        [InspectionRequestController::class, 'index']
    );

    Route::post(
        '/inspection-requests',
        [InspectionRequestController::class, 'store']
    );

    Route::get(
        '/inspection-requests/{inspectionRequest}',
        [InspectionRequestController::class, 'show']
    );

    Route::put(
        '/inspection-requests/{inspectionRequest}',
        [InspectionRequestController::class, 'update']
    );

    Route::patch(
        '/inspection-requests/{inspectionRequest}/cancel',
        [InspectionRequestController::class, 'cancel']
    );
});