<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of users (excluding soft-deleted by default)
     */
    public function index(Request $request)
    {
        $query = User::with('roles');

        // Optional: Allow filtering by status via query param, e.g., ?status=all
        if ($request->query('status') !== 'all') {
            $query->where('status', '!=', 2); // Exclude soft-deleted by default
        }

        $users = $query->paginate(10)->appends($request->query());

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = Role::all();

        $user = [
            'id' => null,
            'name' => '',
            'email' => '',
            'status' => 1, // Default active
            'roles' => [],
        ];

        return Inertia::render('Users/CreateEdit', [
            'roles' => $roles,
            'user' => $user,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['required', 'integer', 'in:0,1'], // Only allow 0 or 1 on create
            'roles' => ['nullable', 'array'],
            'roles.*' => ['integer', 'exists:roles,id'],
        ])->validate();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status' => $validated['status'], // Will default to 1 anyway
        ]);

        if (!empty($validated['roles'])) {
            $user->assignRole($validated['roles']);
        }

        return to_route('users.index')->with('success', 'User created successfully');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit($id)
    {
        $user = User::with('roles')->findOrFail($id);
        $roles = Role::all();

        // Transform roles to array of IDs for checkbox/select compatibility in frontend
        $user->roles = $user->roles->pluck('id')->toArray();

        return Inertia::render('Users/CreateEdit', [
            'roles' => $roles,
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'status' => ['required', 'integer', 'in:0,1,2'], // Allow 2 only on update
            'roles' => ['nullable', 'array'],
            'roles.*' => ['integer', 'exists:roles,id'],
        ])->validate();

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->status = $validated['status'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Sync roles
        $roles = $validated['roles'] ?? [];
        $user->syncRoles($roles);

        return to_route('users.index')->with('success', 'User updated successfully');
    }

    /**
     * Soft delete the user (set status = 2)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevent self-deletion (optional safety)
        if (Auth::id() == $user->id) {
            return to_route('users.index')->with('error', 'You cannot delete yourself.');
        }

        $user->status = 2; // Soft deleted
        $user->save();

        return to_route('users.index')->with('success', 'User has been deactivated (soft deleted).');
    }

    /**
     * Optional: Restore a soft-deleted user
     */
    public function restore($id)
    {
        $user = User::findOrFail($id);

        if ($user->status !== 2) {
            return to_route('users.index')->with('error', 'User is not soft-deleted.');
        }

        $user->status = 1; // Restore to active
        $user->save();

        return to_route('users.index')->with('success', 'User restored successfully.');
    }
}