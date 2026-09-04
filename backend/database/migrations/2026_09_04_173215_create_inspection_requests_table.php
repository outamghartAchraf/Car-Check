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
        Schema::create('inspection_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('vehicle_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('mechanic_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->enum('package', [
                'standard',
                'complete',
            ])->default('standard');

            $table->enum('status', [
                'pending',
                'accepted',
                'rejected',
                'scheduled',
                'completed',
                'cancelled',
            ])->default('pending');

            $table->string('location');
            $table->text('description')->nullable();

            $table->date('preferred_date')->nullable();
            $table->time('preferred_time')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_requests');
    }
};
