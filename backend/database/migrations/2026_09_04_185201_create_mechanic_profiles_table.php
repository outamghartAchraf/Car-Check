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
        Schema::create('mechanic_profiles', function (Blueprint $table) {
            $table->id();
             $table->foreignId('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->string('phone')->nullable();

            $table->string('city');

            $table->string('specialization')->nullable();

            $table->unsignedSmallInteger('experience_years')
                ->default(0);

            $table->string('certification_number')->nullable();

            $table->text('certification_document')->nullable();

            $table->enum('certification_status', [
                'pending',
                'certified',
                'rejected',
            ])->default('pending');

            $table->text('bio')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mechanic_profiles');
    }
};
