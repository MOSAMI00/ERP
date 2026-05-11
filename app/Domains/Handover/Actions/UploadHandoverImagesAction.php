<?php

namespace App\Domains\Handover\Actions;

use App\Models\HandoverImage;
use App\Models\HandoverReport;

class UploadHandoverImagesAction
{
    public function handle(HandoverReport $report, array $imageUrls): void
    {
        // ✦ تجنب insert فارغ
        if (empty($imageUrls)) {
            return;
        }

        $images = collect($imageUrls)->map(fn($url, $index) => [
            'handover_report_id' => $report->id,
            'image_url'          => $url,
            'sort_order'         => $index + 1,
            'created_at'         => now(),
            'updated_at'         => now(),
        ])->all();

        HandoverImage::insert($images);
    }
}
