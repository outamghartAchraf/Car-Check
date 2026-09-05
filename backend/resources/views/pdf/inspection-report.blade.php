<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <title>
        CarCheck Inspection Report
    </title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            color: #1e293b;
            font-size: 12px;
            line-height: 1.6;
            margin: 0;
            padding: 25px;
        }

        .header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .brand {
            color: #2563eb;
            font-size: 26px;
            font-weight: bold;
        }

        .subtitle {
            color: #64748b;
            margin-top: 4px;
        }

        .report-number {
            text-align: right;
            color: #64748b;
        }

        .section {
            margin-bottom: 24px;
        }

        .section-title {
            background: #f1f5f9;
            padding: 8px 12px;
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 12px;
            border-left: 4px solid #2563eb;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td,
        th {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            text-align: left;
            vertical-align: top;
        }

        th {
            color: #64748b;
            font-size: 11px;
            text-transform: uppercase;
        }

        .label {
            color: #64748b;
            font-weight: bold;
            width: 35%;
        }

        .status {
            font-weight: bold;
            text-transform: capitalize;
        }

        .good {
            color: #059669;
        }

        .average {
            color: #d97706;
        }

        .bad,
        .poor {
            color: #dc2626;
        }

        .excellent {
            color: #059669;
        }

        .notes {
            background: #f8fafc;
            padding: 12px;
            border: 1px solid #e2e8f0;
            margin-top: 8px;
        }

        .overall {
            padding: 15px;
            border: 2px solid #e2e8f0;
            text-align: center;
            margin-top: 10px;
        }

        .overall-value {
            font-size: 20px;
            font-weight: bold;
            text-transform: capitalize;
        }

        .footer {
            margin-top: 35px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            color: #94a3b8;
            font-size: 10px;
            text-align: center;
        }
    </style>
</head>

<body>

@php
    $vehicle = $report->inspectionRequest->vehicle ?? null;
@endphp

<div class="header">

    <table style="border: none;">
        <tr>
            <td style="border: none; padding: 0;">
                <div class="brand">
                    CarCheck
                </div>

                <div class="subtitle">
                    Vehicle Inspection Report
                </div>
            </td>

            <td
                style="
                    border: none;
                    padding: 0;
                    text-align: right;
                "
            >
                <div class="report-number">
                    Report #{{ $report->id }}
                </div>

                <div>
                    {{ $report->created_at?->format('d/m/Y') }}
                </div>
            </td>
        </tr>
    </table>

</div>


{{-- Vehicle --}}
<div class="section">

    <div class="section-title">
        Vehicle Information
    </div>

    <table>

        <tr>
            <td class="label">
                Vehicle
            </td>

            <td>
                {{ $vehicle?->brand ?? '-' }}
                {{ $vehicle?->model ?? '' }}
            </td>
        </tr>

        <tr>
            <td class="label">
                Year
            </td>

            <td>
                {{ $vehicle?->year ?? '-' }}
            </td>
        </tr>

        @if($vehicle?->license_plate)
            <tr>
                <td class="label">
                    License Plate
                </td>

                <td>
                    {{ $vehicle->license_plate }}
                </td>
            </tr>
        @endif

    </table>

</div>


{{-- Client / Mechanic --}}
<div class="section">

    <div class="section-title">
        Inspection Information
    </div>

    <table>

        <tr>
            <td class="label">
                Client
            </td>

            <td>
                {{ $report->client?->name ?? '-' }}
            </td>
        </tr>

        <tr>
            <td class="label">
                Mechanic
            </td>

            <td>
                {{ $report->mechanic?->name ?? '-' }}
            </td>
        </tr>

        <tr>
            <td class="label">
                Inspection Package
            </td>

            <td style="text-transform: capitalize;">
                {{ $report->inspectionRequest?->package ?? '-' }}
            </td>
        </tr>

        <tr>
            <td class="label">
                Location
            </td>

            <td>
                {{ $report->inspectionRequest?->location ?? '-' }}
            </td>
        </tr>

        <tr>
            <td class="label">
                Appointment Date
            </td>

            <td>
                {{
                    $report->appointment?->appointment_date
                        ? $report->appointment->appointment_date->format('d/m/Y')
                        : '-'
                }}
            </td>
        </tr>

        <tr>
            <td class="label">
                Time
            </td>

            <td>
                {{ $report->appointment?->start_time ?? '-' }}
                -
                {{ $report->appointment?->end_time ?? '-' }}
            </td>
        </tr>

    </table>

</div>


{{-- Inspection --}}
<div class="section">

    <div class="section-title">
        Vehicle Inspection Results
    </div>

    <table>

        <thead>
            <tr>
                <th>
                    Component
                </th>

                <th>
                    Status
                </th>

                <th>
                    Notes
                </th>
            </tr>
        </thead>

        <tbody>

            <tr>
                <td>
                    Engine
                </td>

                <td
                    class="status {{ $report->engine_status }}"
                >
                    {{ $report->engine_status }}
                </td>

                <td>
                    {{ $report->engine_notes ?: '-' }}
                </td>
            </tr>

            <tr>
                <td>
                    Transmission
                </td>

                <td
                    class="status {{ $report->transmission_status }}"
                >
                    {{ $report->transmission_status }}
                </td>

                <td>
                    {{ $report->transmission_notes ?: '-' }}
                </td>
            </tr>

            <tr>
                <td>
                    Brakes
                </td>

                <td
                    class="status {{ $report->brakes_status }}"
                >
                    {{ $report->brakes_status }}
                </td>

                <td>
                    {{ $report->brakes_notes ?: '-' }}
                </td>
            </tr>

            <tr>
                <td>
                    Suspension
                </td>

                <td
                    class="status {{ $report->suspension_status }}"
                >
                    {{ $report->suspension_status }}
                </td>

                <td>
                    {{ $report->suspension_notes ?: '-' }}
                </td>
            </tr>

            <tr>
                <td>
                    Tires
                </td>

                <td
                    class="status {{ $report->tires_status }}"
                >
                    {{ $report->tires_status }}
                </td>

                <td>
                    {{ $report->tires_notes ?: '-' }}
                </td>
            </tr>

            <tr>
                <td>
                    Body
                </td>

                <td
                    class="status {{ $report->body_status }}"
                >
                    {{ $report->body_status }}
                </td>

                <td>
                    {{ $report->body_notes ?: '-' }}
                </td>
            </tr>

            <tr>
                <td>
                    Electrical
                </td>

                <td
                    class="status {{ $report->electrical_status }}"
                >
                    {{ $report->electrical_status }}
                </td>

                <td>
                    {{ $report->electrical_notes ?: '-' }}
                </td>
            </tr>

        </tbody>

    </table>

</div>


{{-- Overall --}}
<div class="section">

    <div class="section-title">
        Overall Condition
    </div>

    <div class="overall">

        <div
            class="
                overall-value
                {{ $report->overall_condition }}
            "
        >
            {{ $report->overall_condition }}
        </div>

    </div>

</div>


@if($report->recommendations)

    <div class="section">

        <div class="section-title">
            Recommendations
        </div>

        <div class="notes">
            {{ $report->recommendations }}
        </div>

    </div>

@endif


@if($report->mechanic_comment)

    <div class="section">

        <div class="section-title">
            Mechanic Comment
        </div>

        <div class="notes">
            {{ $report->mechanic_comment }}
        </div>

    </div>

@endif


<div class="footer">

    CarCheck Vehicle Inspection Platform

    <br>

    This report was generated automatically by CarCheck.

</div>

</body>
</html>