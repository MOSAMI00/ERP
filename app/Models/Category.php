<?php

namespace App\Models;
use App\Models\Equipment;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_ar',
        'icon',
        'slug',
        'parent_id',
        'sort_order',
    ];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'category_id');
    }
}