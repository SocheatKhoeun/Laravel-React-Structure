<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;
    use HasRoles;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'token',                    // Your custom token field (e.g., API token)
        'status',                   // 1=Active, 0=Inactive, 2=Soft Deleted
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
            'password' => 'hashed',
            'status' => 'integer',                    // Ensure status is treated as int
            'two_factor_secret' => 'encrypted',       // Recommended: encrypt sensitive 2FA data
            'two_factor_recovery_codes' => 'encrypted',
        ];
    }

    /**
     * JWT Identifier
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * JWT Custom Claims
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'email' => $this->email,
            'name'  => $this->name,
            'roles' => $this->getRoleNames(),        // Optional: include roles in token
            'permissions' => $this->getPermissionsViaRoles()->pluck('name'), // Optional
            'status' => $this->status,
        ];
    }

    /**
     * Scope: Active users only
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    /**
     * Scope: Exclude soft-deleted users
     */
    public function scopeNotDeleted($query)
    {
        return $query->where('status', '!=', 2);
    }

    /**
     * Scope: Soft-deleted users only
     */
    public function scopeOnlyDeleted($query)
    {
        return $query->where('status', 2);
    }

    /**
     * Check if user is active
     */
    public function isActive(): bool
    {
        return $this->status === 1;
    }

    /**
     * Check if user is inactive
     */
    public function isInactive(): bool
    {
        return $this->status === 0;
    }

    /**
     * Check if user is soft-deleted
     */
    public function isDeleted(): bool
    {
        return $this->status === 2;
    }
}