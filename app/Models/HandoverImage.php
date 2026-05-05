<?php

namespace App\Models;
use App\Models\HandoverReport;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HandoverImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'handover_report_id',
        'image_url',
        'sort_order',
    ];

    public function report()
    {
        return $this->belongsTo(HandoverReport::class, 'handover_report_id');
    }
}