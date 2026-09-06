<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
       protected $fillable = [
        'inspection_report_id',
        'client_id',
        'mechanic_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function inspectionReport()
    {
        return $this->belongsTo(InspectionReport::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function mechanic()
    {
        return $this->belongsTo(User::class, 'mechanic_id');
    }
}
