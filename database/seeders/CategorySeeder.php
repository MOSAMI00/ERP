<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name_ar' => 'مولدات كهرباء', 'icon' => 'Zap', 'sort_order' => 1, 'slug' => 'generators'],
            ['name_ar' => 'بناء وأعمال', 'icon' => 'HardHat', 'sort_order' => 2, 'slug' => 'construction'],
            ['name_ar' => 'زراعة', 'icon' => 'Sprout', 'sort_order' => 3, 'slug' => 'agriculture'],
            ['name_ar' => 'تصوير', 'icon' => 'Camera', 'sort_order' => 4, 'slug' => 'photography'],
            ['name_ar' => 'رياضة', 'icon' => 'Dumbbell', 'sort_order' => 5, 'slug' => 'sports'],
            ['name_ar' => 'فعاليات', 'icon' => 'PartyPopper', 'sort_order' => 6, 'slug' => 'events'],
            ['name_ar' => 'طبي', 'icon' => 'Stethoscope', 'sort_order' => 7, 'slug' => 'medical'],
            ['name_ar' => 'أخرى', 'icon' => 'MoreHorizontal', 'sort_order' => 8, 'slug' => 'others'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
