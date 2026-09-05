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
        Schema::create('mechanic_availabilities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('mechanic_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('day_of_week');

            $table->time('start_time');

            $table->time('end_time');

            $table->boolean('is_available')
                ->default(true);

            $table->timestamps();

            $table->unique(
                [
                    'mechanic_id',
                    'day_of_week',
                    'start_time',
                    'end_time',
                ],
                'mechanic_availability_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mechanic_availabilities');
    }
};
