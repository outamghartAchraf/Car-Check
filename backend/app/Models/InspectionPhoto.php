<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionPhoto extends Model
{
    protected $fillable = [
        'inspection_request_id',
        'inspection_report_id',
        'uploaded_by',
        'photo_path',
        'description',
    ];

    public function inspectionRequest()
    {
        return $this->belongsTo(
            InspectionRequest::class
        );
    }

    public function inspectionReport()
    {
        return $this->belongsTo(
            InspectionReport::class
        );
    }

    public function uploader()
    {
        return $this->belongsTo(
            User::class,
            'uploaded_by'
        );
    }
}
