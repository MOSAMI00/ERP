<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, fn($q) => $q->where('full_name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user->load(['kycDocuments', 'equipment', 'rentalsAsTenant', 'rentalsAsOwner']),
        ]);
    }

    public function suspend(Request $request, User $user)
    {
        $user->update(['status' => 'suspended']);

        return back()->with('success', 'User suspended.');
    }

    public function ban(Request $request, User $user)
    {
        $data = $request->validate([
            'ban_reason' => ['required', 'string'],
        ]);

        $user->update([
            'status'     => 'banned',
            'ban_reason' => $data['ban_reason'],
        ]);

        return back()->with('success', 'User banned.');
    }

    public function activate(User $user)
    {
        $user->update(['status' => 'active', 'ban_reason' => null]);

        return back()->with('success', 'User activated.');
    }
}