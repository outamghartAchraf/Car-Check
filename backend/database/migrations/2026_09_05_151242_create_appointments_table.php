<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
             // Inspection Request
            $table->foreignId('inspection_request_id')
                ->constrained('inspection_requests')
                ->cascadeOnDelete();

            // Client
            $table->foreignId('client_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Mechanic
            $table->foreignId('mechanic_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Appointment date and time
            $table->date('appointment_date');

            $table->time('start_time');

            $table->time('end_time');

            // Appointment status
            $table->enum('status', [
                'pending',
                'confirmed',
                'completed',
                'cancelled',
            ])->default('pending');

            // Optional notes
            $table->text('notes')->nullable();

             

            // One inspection request can have only one appointment
            $table->unique('inspection_request_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
