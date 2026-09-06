<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionReport extends Model
{
    protected $fillable = [
        'appointment_id',
        'inspection_request_id',
        'client_id',
        'mechanic_id',

        'engine_status',
        'transmission_status',
        'brakes_status',
        'suspension_status',
        'tires_status',
        'body_status',
        'electrical_status',

        'overall_condition',

        'engine_notes',
        'transmission_notes',
        'brakes_notes',
        'suspension_notes',
        'tires_notes',
        'body_notes',
        'electrical_notes',

        'recommendations',
        'mechanic_comment',
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function inspectionRequest()
    {
        return $this->belongsTo(InspectionRequest::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function mechanic()
    {
        return $this->belongsTo(User::class, 'mechanic_id');
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
