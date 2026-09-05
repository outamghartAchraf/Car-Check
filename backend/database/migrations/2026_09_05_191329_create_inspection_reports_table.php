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
        Schema::create('inspection_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')
                ->unique()
                ->constrained('appointments')
                ->cascadeOnDelete();

            $table->foreignId('inspection_request_id')
                ->unique()
                ->constrained('inspection_requests')
                ->cascadeOnDelete();

            $table->foreignId('client_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('mechanic_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('engine_status', [
                'good',
                'average',
                'bad',
            ]);

            $table->enum('transmission_status', [
                'good',
                'average',
                'bad',
            ]);

            $table->enum('brakes_status', [
                'good',
                'average',
                'bad',
            ]);

            $table->enum('suspension_status', [
                'good',
                'average',
                'bad',
            ]);

            $table->enum('tires_status', [
                'good',
                'average',
                'bad',
            ]);

            $table->enum('body_status', [
                'good',
                'average',
                'bad',
            ]);

            $table->enum('electrical_status', [
                'good',
                'average',
                'bad',
            ]);

            $table->enum('overall_condition', [
                'excellent',
                'good',
                'average',
                'poor',
            ]);

            $table->text('engine_notes')->nullable();
            $table->text('transmission_notes')->nullable();
            $table->text('brakes_notes')->nullable();
            $table->text('suspension_notes')->nullable();
            $table->text('tires_notes')->nullable();
            $table->text('body_notes')->nullable();
            $table->text('electrical_notes')->nullable();

            $table->text('recommendations')->nullable();
            $table->text('mechanic_comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_reports');
    }
};
