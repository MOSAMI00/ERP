<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Categories/Index', [
            'categories' => Category::with('children')
                ->whereNull('parent_id')
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function show(Category $category)
    {
        $equipment = $category->equipment()
            ->with(['images', 'owner'])
            ->where('status', 'active')
            ->paginate(12);

        return Inertia::render('Categories/Show', [
            'category'  => $category,
            'equipment' => $equipment,
        ]);
    }
}