<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionRequest extends Model
{
       protected $fillable = [
        'client_id',
        'vehicle_id',
        'mechanic_id',
        'package',
        'status',
        'location',
        'description',
        'preferred_date',
        'preferred_time',
    ];

    protected $casts = [
        'preferred_date' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function mechanic()
    {
        return $this->belongsTo(User::class, 'mechanic_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
