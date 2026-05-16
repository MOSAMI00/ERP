<?php

namespace App\Http\Controllers\Admin;

use App\Domains\User\Services\UserStatusService;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\BanUserRequest;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function __construct(
        private UserStatusService $statusService,
    ) {}

    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, fn($q) => $q->where(fn ($searchQuery) => $searchQuery
                ->where('full_name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")
            ))
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
        $admin = auth()->guard('admin')->user();
        abort_unless($admin, 403);

        $this->statusService->suspend($user, $admin);

        return back()->with('success', 'User suspended.');
    }

    public function ban(BanUserRequest $request, User $user)
    {
        $data = $request->validated();

        $admin = auth()->guard('admin')->user();
        abort_unless($admin, 403);

        $this->statusService->ban($user, $admin, $data['ban_reason']);

        return back()->with('success', 'User banned.');
    }

    public function activate(User $user)
    {
        $admin = auth()->guard('admin')->user();
        abort_unless($admin, 403);

        $this->statusService->activate($user, $admin);

        return back()->with('success', 'User activated.');
    }
}
