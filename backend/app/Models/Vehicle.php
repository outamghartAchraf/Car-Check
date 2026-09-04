<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
        protected $fillable = [
        'user_id',
        'brand',
        'model',
        'year',
        'mileage',
        'registration_number',
        'fuel_type',
        'transmission',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inspectionRequests()
    {
        return $this->hasMany(InspectionRequest::class);
    }
}
