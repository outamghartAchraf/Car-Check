<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InspectionReport;
use App\Models\Appointment;
use Barryvdh\DomPDF\Facade\Pdf;

class InspectionReportController extends Controller
{
    public function store(Request $request, Appointment $appointment)
    {
        $user = $request->user();

        if ($user->role !== 'mechanic') {
            return response()->json([
                'message' => 'Only mechanics can create inspection reports.',
            ], 403);
        }

        if ($appointment->mechanic_id !== $user->id) {
            return response()->json([
                'message' => 'This appointment does not belong to you.',
            ], 403);
        }

        if ($appointment->status !== 'confirmed') {
            return response()->json([
                'message' => 'Only confirmed appointments can be completed.',
            ], 422);
        }

        if ($appointment->inspectionReport) {
            return response()->json([
                'message' => 'This appointment already has an inspection report.',
            ], 422);
        }

        $validated = $request->validate([
            'engine_status' => [
                'required',
                'in:good,average,bad',
            ],

            'transmission_status' => [
                'required',
                'in:good,average,bad',
            ],

            'brakes_status' => [
                'required',
                'in:good,average,bad',
            ],

            'suspension_status' => [
                'required',
                'in:good,average,bad',
            ],

            'tires_status' => [
                'required',
                'in:good,average,bad',
            ],

            'body_status' => [
                'required',
                'in:good,average,bad',
            ],

            'electrical_status' => [
                'required',
                'in:good,average,bad',
            ],

            'overall_condition' => [
                'required',
                'in:excellent,good,average,poor',
            ],

            'engine_notes' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'transmission_notes' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'brakes_notes' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'suspension_notes' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'tires_notes' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'body_notes' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'electrical_notes' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'recommendations' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'mechanic_comment' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        $report = InspectionReport::create([
            'appointment_id' => $appointment->id,
            'inspection_request_id' => $appointment->inspection_request_id,
            'client_id' => $appointment->client_id,
            'mechanic_id' => $appointment->mechanic_id,

            ...$validated,
        ]);

        $appointment->update([
            'status' => 'completed',
        ]);

        $appointment->inspectionRequest()->update([
            'status' => 'completed',
        ]);

        $report->load([
            'appointment',
            'inspectionRequest.vehicle',
            'client:id,name,email',
            'mechanic:id,name,email',
        ]);

        return response()->json([
            'message' => 'Inspection completed successfully.',
            'report' => $report,
        ], 201);
    }

    /**
     * Client or mechanic can view report.
     */
    public function show(Request $request, InspectionReport $inspectionReport)
    {
        $user = $request->user();

        if (
            $inspectionReport->client_id !== $user->id &&
            $inspectionReport->mechanic_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $inspectionReport->load([
            'appointment',
            'inspectionRequest.vehicle',
            'client:id,name,email',
            'mechanic:id,name,email',
            'review',
        ]);

        return response()->json([
            'report' => $inspectionReport,
        ]);
    }

    /**
     * Client reports.
     */
    public function clientIndex(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client') {
            return response()->json([
                'message' => 'Only clients can access these reports.',
            ], 403);
        }

        $reports = InspectionReport::with([
            'inspectionRequest.vehicle',
            'mechanic:id,name,email',
            'appointment',
            'review',
        ])
            ->where('client_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'reports' => $reports,
        ]);
    }

    /**
     * Mechanic reports.
     */
    public function mechanicIndex(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'mechanic') {
            return response()->json([
                'message' => 'Only mechanics can access these reports.',
            ], 403);
        }

        $reports = InspectionReport::with([
            'inspectionRequest.vehicle',
            'client:id,name,email',
            'appointment',
        ])
            ->where('mechanic_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'reports' => $reports,
        ]);
    }

    public function downloadPdf(
        Request $request,
        InspectionReport $inspectionReport
    ) {
        $user = $request->user();

        if (
            $inspectionReport->client_id !== $user->id &&
            $inspectionReport->mechanic_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $inspectionReport->load([
            'appointment',
            'inspectionRequest.vehicle',
            'client:id,name,email',
            'mechanic:id,name,email',
        ]);

        $pdf = Pdf::loadView(
            'pdf.inspection-report',
            [
                'report' => $inspectionReport,
            ]
        );

        $fileName =
            'carcheck-inspection-report-' .
            $inspectionReport->id .
            '.pdf';

        return $pdf->download($fileName);
    }
}
