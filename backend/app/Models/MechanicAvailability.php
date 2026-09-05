<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MechanicAvailability extends Model
{
        protected $fillable = [
        'mechanic_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    public function mechanic()
    {
        return $this->belongsTo(User::class, 'mechanic_id');
    }
}
