<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->with('roles')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn (User $user) => $this->userDetails($user));

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $this->roleOptions(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->safe()->except(['role']);
        $plainPassword = Str::password(16, spaces: false);

        $user = User::query()->create([
            ...$validated,
            'password' => $plainPassword,
        ]);

        $user->assignRole($request->validated('role'));

        Inertia::flash('createdUserCredentials', [
            'email' => $user->email,
            'username' => $user->username,
            'password' => $plainPassword,
        ]);

        return redirect()->route('users.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function userDetails(User $user): array
    {
        return [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'name' => trim($user->first_name.' '.$user->last_name),
            'username' => $user->username,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'role' => $user->getRoleNames()->first(),
            'status' => $user->is_active ? 'active' : 'inactive',
            'created_at' => $user->created_at?->toIso8601String(),
            'updated_at' => $user->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function roleOptions(): array
    {
        return [
            ['value' => User::ROLE_ADMINISTRATOR, 'label' => 'Admin'],
            ['value' => User::ROLE_MANAGER, 'label' => 'Manager'],
            ['value' => User::ROLE_STAFF, 'label' => 'Staff'],
        ];
    }
}
