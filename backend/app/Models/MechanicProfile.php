<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MechanicProfile extends Model
{
        protected $fillable = [
        'user_id',
        'phone',
        'city',
        'specialization',
        'experience_years',
        'certification_number',
        'certification_document',
        'certification_status',
        'bio',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
