<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\InspectionRequestController;
use App\Http\Controllers\Api\MechanicProfileController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MechanicAvailabilityController;

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

    // Mechanic Profile
    Route::get(
        '/mechanic/profile',
        [MechanicProfileController::class, 'show']
    );

    Route::post(
        '/mechanic/profile',
        [MechanicProfileController::class, 'store']
    );

    Route::put(
        '/mechanic/profile',
        [MechanicProfileController::class, 'update']
    );

    // Mechanic Inspection Requests

    Route::get(
        '/mechanic/inspection-requests',
        [InspectionRequestController::class, 'mechanicIndex']
    );

    Route::get(
        '/mechanic/inspection-requests/{inspectionRequest}',
        [InspectionRequestController::class, 'mechanicShow']
    );

    Route::patch(
        '/mechanic/inspection-requests/{inspectionRequest}/accept',
        [InspectionRequestController::class, 'accept']
    );

    Route::patch(
        '/mechanic/inspection-requests/{inspectionRequest}/reject',
        [InspectionRequestController::class, 'reject']
    );

    // Appointments
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);
    Route::patch('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::get(
        '/inspection-requests/{inspectionRequest}/available-slots',
        [AppointmentController::class, 'availableSlots']
    );

    // Mechanic Availability
    Route::get('/mechanic/availability', [MechanicAvailabilityController::class, 'index']);
    Route::post('/mechanic/availability', [MechanicAvailabilityController::class, 'store']);
    Route::put('/mechanic/availability/{availability}', [MechanicAvailabilityController::class, 'update']);
    Route::delete('/mechanic/availability/{availability}', [MechanicAvailabilityController::class, 'destroy']);

    // Mechanic Appointments
    Route::get(
        '/mechanic/appointments',
        [AppointmentController::class, 'mechanicIndex']
    );
});
