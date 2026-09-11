<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\InspectionRequestController;
use App\Http\Controllers\Api\MechanicProfileController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MechanicAvailabilityController;
use App\Http\Controllers\Api\InspectionReportController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminMechanicController;
use App\Http\Controllers\Api\AdminClientController;
use App\Http\Controllers\Api\AdminInspectionRequestController;
use App\Http\Controllers\Api\AdminAppointmentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\InspectionPhotoController;
use App\Http\Controllers\Api\ClientDashboardController;

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

    // Inspection Reports

    Route::post(
        '/mechanic/appointments/{appointment}/complete',
        [InspectionReportController::class, 'store']
    );

    Route::get(
        '/inspection-reports',
        [InspectionReportController::class, 'clientIndex']
    );

    Route::get(
        '/mechanic/inspection-reports',
        [InspectionReportController::class, 'mechanicIndex']
    );

    Route::get(
        '/inspection-reports/{inspectionReport}',
        [InspectionReportController::class, 'show']
    );

    Route::get(
        '/inspection-reports/{inspectionReport}/pdf',
        [InspectionReportController::class, 'downloadPdf']
    );

    // Reviews

    Route::post(
        '/inspection-reports/{inspectionReport}/review',
        [ReviewController::class, 'store']
    );

    Route::get(
        '/mechanic/reviews',
        [ReviewController::class, 'mechanicIndex']
    );

    //Admin Dashboard
    Route::get(
        '/admin/dashboard',
        [AdminDashboardController::class, 'index']
    );

    // Admin Mechanics

    Route::get(
        '/admin/mechanics',
        [AdminMechanicController::class, 'index']
    );

    Route::get(
        '/admin/mechanics/{mechanic}',
        [AdminMechanicController::class, 'show']
    );

    Route::patch(
        '/admin/mechanics/{mechanic}/certify',
        [AdminMechanicController::class, 'certify']
    );

    Route::patch(
        '/admin/mechanics/{mechanic}/reject',
        [AdminMechanicController::class, 'reject']
    );

    // Admin Clients
    Route::get(
        '/admin/clients',
        [AdminClientController::class, 'index']
    );

    Route::get(
        '/admin/clients/{client}',
        [AdminClientController::class, 'show']
    );

    // Admin Inspection Requests
    Route::get(
        '/admin/inspection-requests',
        [AdminInspectionRequestController::class, 'index']
    );

    Route::get(
        '/admin/inspection-requests/{inspectionRequest}',
        [AdminInspectionRequestController::class, 'show']
    );

    // Admin Appointments
    Route::get(
        '/admin/appointments',
        [AdminAppointmentController::class, 'index']
    );

    Route::get(
        '/admin/appointments/{appointment}',
        [AdminAppointmentController::class, 'show']
    );

    // Notifications
    Route::get(
        '/notifications',
        [NotificationController::class, 'index']
    );

    Route::patch(
        '/notifications/read-all',
        [NotificationController::class, 'markAllAsRead']
    );

    Route::patch(
        '/notifications/{notification}/read',
        [NotificationController::class, 'markAsRead']
    );



    Route::delete(
        '/notifications/{notification}',
        [NotificationController::class, 'destroy']
    );

    // Inspection Photos
    Route::get(
        '/inspection-requests/{inspectionRequest}/photos',
        [InspectionPhotoController::class, 'index']
    );

    Route::post(
        '/inspection-requests/{inspectionRequest}/photos',
        [InspectionPhotoController::class, 'store']
    );

    Route::delete(
        '/inspection-photos/{inspectionPhoto}',
        [InspectionPhotoController::class, 'destroy']
    );

    Route::post(
        '/inspection-reports/{inspectionReport}/photos',
        [InspectionPhotoController::class, 'storeForReport']
    );

    Route::get(
        '/client/dashboard',
        [ClientDashboardController::class, 'index']
    );
});
